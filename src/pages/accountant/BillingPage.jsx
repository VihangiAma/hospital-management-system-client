import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountantSidebar from "../../components/AccountantSidebar";
import Topbar from "../../components/AccTopbar";

const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showGenModal, setShowGenModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Generate bill form
  const [genForm, setGenForm] = useState({
    patient_id: "",
    bill_code: "",
    payment_method: "Cash",
    items: [{ description: "", amount: 0 }],
  });

  // refs data
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchBills();
    fetchReferences();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/billing`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setBills(res.data || []);
    } catch (err) {
      console.error("Fetch bills:", err);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferences = async () => {
    try {
      const [pRes] = await Promise.all([axios.get(`${API}/patients`)]);
      setPatients(pRes.data || []);
    } catch (err) {
      console.error("Fetch refs:", err);
    }
  };

  // Generate bill helpers
  const addItem = () => setGenForm((g) => ({ ...g, items: [...g.items, { description: "", amount: 0 }] }));
  const removeItem = (i) => {
    setGenForm((g) => ({ ...g, items: g.items.filter((_, idx) => idx !== i) }));
  };
  const updateItem = (i, field, value) => {
    const items = [...genForm.items];
    items[i][field] = field === "amount" ? Number(value) : value;
    setGenForm((g) => ({ ...g, items }));
  };
  const genTotal = () => genForm.items.reduce((s, it) => s + Number(it.amount || 0), 0);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!genForm.patient_id || !genForm.bill_code || genForm.items.length === 0) {
      return alert("Please fill required fields and at least one item.");
    }
    try {
      await axios.post(`${API}/billing`, genForm, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      alert("Bill generated");
      setShowGenModal(false);
      setGenForm({ patient_id: "", bill_code: "", payment_method: "Cash", items: [{ description: "", amount: 0 }] });
      fetchBills();
    } catch (err) {
      console.error("Generate bill:", err);
      alert(err?.response?.data?.message || "Failed to generate bill");
    }
  };

  // view bill details
  const openView = async (billId) => {
    try {
      const res = await axios.get(`${API}/billing/${billId}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setSelectedBill(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("Open bill:", err);
      alert("Cannot open bill");
    }
  };

  return (
    <div className="flex">
      <AccountantSidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Billing & Payments" />

        <div className="p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Billing</h2>
            <div className="flex gap-3">
              <button onClick={() => setShowGenModal(true)} className="bg-[#B30000] px-4 py-2 rounded text-white">+ Generate Bill</button>
              <button onClick={fetchBills} className="px-4 py-2 border rounded">Refresh</button>
            </div>
          </div>

          <div className="bg-white rounded shadow p-4">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : bills.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No bills found.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Paid</th>
                    <th className="p-3">Outstanding</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.bill_id} className="border-b">
                      <td className="p-3">{b.bill_code}</td>
                      <td className="p-3">{b.patient_name}</td>
                      <td className="p-3">{b.bill_date?.slice(0, 10)}</td>
                      <td className="p-3">Rs. {Number(b.total_amount).toFixed(2)}</td>
                      <td className="p-3">Rs. {Number(b.total_paid || 0).toFixed(2)}</td>
                      <td className="p-3">Rs. {Number(b.outstanding_balance || 0).toFixed(2)}</td>
                      <td className="p-3">{b.status}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => openView(b.bill_id)} className="px-2 py-1 bg-gray-200 rounded">View</button>
                          <button onClick={() => window.location.assign(`/accountant/payments?bill=${b.bill_id}`)} className="px-2 py-1 bg-green-600 text-white rounded">Payments</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Generate Modal */}
        {showGenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded p-5 w-[90%] max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Generate Bill</h3>
                <button onClick={() => setShowGenModal(false)}>Close</button>
              </div>

              <form onSubmit={handleGenerate}>
                <div className="grid grid-cols-2 gap-3">
                  <label className="col-span-2">
                    <div className="text-sm">Bill Code</div>
                    <input required value={genForm.bill_code} onChange={(e)=> setGenForm(g=>({...g, bill_code: e.target.value}))} className="w-full border p-2 rounded" />
                  </label>

                  <label>
                    <div className="text-sm">Patient</div>
                    <select required value={genForm.patient_id} onChange={(e)=> setGenForm(g=>({...g, patient_id: e.target.value}))} className="w-full border p-2 rounded">
                      <option value="">Select patient</option>
                      {patients.map(p=> <option key={p.patient_id} value={p.patient_id}>{p.first_name} {p.last_name} ({p.patient_code})</option>)}
                    </select>
                  </label>

                  <label>
                    <div className="text-sm">Payment Method</div>
                    <select value={genForm.payment_method} onChange={(e)=> setGenForm(g=>({...g, payment_method: e.target.value}))} className="w-full border p-2 rounded">
                      <option>Cash</option>
                      <option>Card</option>
                      <option>Insurance</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold">Items</h4>
                  {genForm.items.map((it, idx) => (
                    <div key={idx} className="flex gap-2 items-center mt-2">
                      <input className="flex-1 border p-2 rounded" placeholder="Description" value={it.description} onChange={(e)=> updateItem(idx, "description", e.target.value)} required/>
                      <input className="w-28 border p-2 rounded" type="number" step="0.01" placeholder="Amount" value={it.amount} onChange={(e)=> updateItem(idx, "amount", e.target.value)} required/>
                      <button type="button" onClick={()=> removeItem(idx)} className="text-red-600">✕</button>
                    </div>
                  ))}
                  <div className="mt-2">
                    <button type="button" onClick={addItem} className="text-[#B30000]">+ Add item</button>
                  </div>

                  <div className="mt-4 text-right font-semibold">Total: Rs. {genTotal().toFixed(2)}</div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowGenModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#B30000] text-white rounded">Generate</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded p-5 w-[90%] max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Bill {selectedBill.bill_code}</h3>
                <button onClick={() => setShowViewModal(false)}>Close</button>
              </div>

              <div>
                <div><strong>Patient:</strong> {selectedBill.patient_name}</div>
                <div><strong>Date:</strong> {selectedBill.bill_date}</div>
                <div><strong>Total:</strong> Rs. {Number(selectedBill.total_amount).toFixed(2)}</div>
                <div className="mt-3">
                  <h4 className="font-semibold">Items</h4>
                  <ul className="mt-2">
                    {selectedBill.items.map(it => (
                      <li key={it.item_id} className="py-1 border-b">
                        {it.description} — Rs. {Number(it.amount).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4"><strong>Outstanding:</strong> Rs. {Number(selectedBill.outstanding_balance || 0).toFixed(2)}</div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
