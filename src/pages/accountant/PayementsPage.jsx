import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountantSidebar from "../../components/AccountantSidebar";
import Topbar from "../../components/AccTopbar";
import { useLocation } from "react-router-dom";

const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

export default function PaymentsPage() {
  const [billId, setBillId] = useState(null);
  const [bill, setBill] = useState(null);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    amount_paid: "",
    payment_method: "Cash",
    reference_number: "",
    received_by: "",
  });
  const [staffList, setStaffList] = useState([]);
  const loc = useLocation();

  useEffect(() => {
    // optional ?bill= query
    const params = new URLSearchParams(loc.search);
    const q = params.get("bill");
    if (q) {
      setBillId(q);
      fetchBill(q);
      fetchPayments(q);
    }
    fetchStaff();
  }, []);

  const fetchBill = async (id) => {
    try {
      const res = await axios.get(`${API}/billing/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setBill(res.data);
    } catch (err) {
      console.error("fetch bill", err);
    }
  };

  const fetchPayments = async (id) => {
    try {
      const res = await axios.get(`${API}/billing/payments/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setPayments(res.data || []);
    } catch (err) {
      console.error("fetch payments", err);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API}/staff`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setStaffList(res.data || []);
    } catch (err) {
      console.error("fetch staff", err);
    }
  };

  const handleRecord = async (e) => {
    e.preventDefault();
    if (!billId) return alert("No bill selected.");
    try {
      await axios.post(
        `${API}/billing/payments`,
        { bill_id: billId, ...form },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      alert("Payment recorded successfully!");
      setForm({
        amount_paid: "",
        payment_method: "Cash",
        reference_number: "",
        received_by: "",
      });
      fetchPayments(billId);
      fetchBill(billId);
    } catch (err) {
      console.error("record payment", err);
      alert("Failed to record payment");
    }
  };

  return (
    <div className="flex">
      <AccountantSidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Manage Payments" />
        <div className="p-6 mt-16">
          <h2 className="text-2xl font-semibold mb-4">Record Payment</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Bill Info */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Select Bill</h3>
              <input
                type="number"
                placeholder="Bill ID"
                value={billId || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setBillId(val);
                  if (val) {
                    fetchBill(val);
                    fetchPayments(val);
                  }
                }}
                className="w-full border p-2 rounded"
              />
              {bill && (
                <div className="mt-3 text-sm">
                  <div>
                    <strong>Code:</strong> {bill.bill_code}
                  </div>
                  <div>
                    <strong>Patient:</strong> {bill.patient_name}
                  </div>
                  <div>
                    <strong>Total:</strong> Rs.{" "}
                    {Number(bill.total_amount).toFixed(2)}
                  </div>
                  <div>
                    <strong>Outstanding:</strong> Rs.{" "}
                    {Number(bill.outstanding_balance || 0).toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Form */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">New Payment</h3>
              <form onSubmit={handleRecord} className="space-y-3">
                <input
                  required
                  placeholder="Amount"
                  type="number"
                  step="0.01"
                  value={form.amount_paid}
                  onChange={(e) =>
                    setForm({ ...form, amount_paid: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <select
                  value={form.payment_method}
                  onChange={(e) =>
                    setForm({ ...form, payment_method: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Insurance</option>
                </select>
                <input
                  placeholder="Reference #"
                  value={form.reference_number}
                  onChange={(e) =>
                    setForm({ ...form, reference_number: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <select
                  value={form.received_by}
                  onChange={(e) =>
                    setForm({ ...form, received_by: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">Received By (Staff)</option>
                  {staffList.map((s) => (
                    <option key={s.staff_id} value={s.staff_id}>
                      {s.full_name} ({s.role})
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#B30000] text-white rounded"
                  >
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Payments Table */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Payments History</h3>
            {payments.length === 0 ? (
              <div className="text-gray-500">No payments yet</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Method</th>
                    <th className="p-2">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.payment_id} className="border-b">
                      <td className="p-2">{p.payment_date?.slice(0, 10)}</td>
                      <td className="p-2">
                        Rs. {Number(p.amount_paid).toFixed(2)}
                      </td>
                      <td className="p-2">{p.payment_method}</td>
                      <td className="p-2">{p.reference_number || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
