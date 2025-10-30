import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AccountantSidebar from "../../components/AccountantSidebar";
import Topbar from "../../components/AccTopbar";

const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

export default function InsuranceClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [form, setForm] = useState({
    bill_id: "",
    insurance_provider: "",
    policy_number: "",
    claim_amount: "",
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  // ✅ Fetch all claims
  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${API}/insurance/claims`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setClaims(res.data || []);
    } catch (err) {
      console.error("fetchClaims error:", err);
    }
  };

  // ✅ File a new claim
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/insurance/claims`, form, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      Swal.fire("Success", "Insurance claim filed successfully!", "success");
      setForm({ bill_id: "", insurance_provider: "", policy_number: "", claim_amount: "" });
      fetchClaims();
    } catch (err) {
      Swal.fire("Error", "Failed to file insurance claim", "error");
    }
  };

  // ✅ Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/insurance/claims/${id}`,
        { claim_status: status },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      Swal.fire("Updated", `Claim marked as ${status}`, "success");
      fetchClaims();
    } catch (err) {
      Swal.fire("Error", "Failed to update claim status", "error");
    }
  };

  return (
    <div className="flex">
      <AccountantSidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Insurance Claims Management" />
        <div className="p-6 mt-16">
          {/* --- Add New Claim Form --- */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-xl font-semibold mb-3 text-[#B30000]">File New Claim</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Bill ID"
                value={form.bill_id}
                onChange={(e) => setForm({ ...form, bill_id: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Insurance Provider"
                value={form.insurance_provider}
                onChange={(e) => setForm({ ...form, insurance_provider: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Policy Number"
                value={form.policy_number}
                onChange={(e) => setForm({ ...form, policy_number: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Claim Amount"
                value={form.claim_amount}
                onChange={(e) => setForm({ ...form, claim_amount: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <div className="col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#B30000] text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  File Claim
                </button>
              </div>
            </form>
          </div>

          {/* --- Claims Table --- */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-3 text-[#2C2C2C]">All Claims</h3>
            <table className="w-full border text-sm">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="border p-2">Claim ID</th>
                  <th className="border p-2">Bill ID</th>
                  <th className="border p-2">Provider</th>
                  <th className="border p-2">Policy #</th>
                  <th className="border p-2">Amount (Rs.)</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Submission</th>
                  <th className="border p-2">Approval</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-gray-500 p-4">
                      No claims found
                    </td>
                  </tr>
                ) : (
                  claims.map((c) => (
                    <tr key={c.claim_id} className="border-b">
                      <td className="border p-2">{c.claim_id}</td>
                      <td className="border p-2">{c.bill_id}</td>
                      <td className="border p-2">{c.insurance_provider}</td>
                      <td className="border p-2">{c.policy_number}</td>
                      <td className="border p-2">{Number(c.claim_amount).toFixed(2)}</td>
                      <td className="border p-2">{c.claim_status}</td>
                      <td className="border p-2">{c.submission_date || "-"}</td>
                      <td className="border p-2">{c.approval_date || "-"}</td>
                      <td className="border p-2 space-x-2">
                        <button
                          onClick={() => updateStatus(c.claim_id, "Approved")}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(c.claim_id, "Rejected")}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
