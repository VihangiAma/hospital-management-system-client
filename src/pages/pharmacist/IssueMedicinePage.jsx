import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const IssueMedicinePage = () => {
  const [formData, setFormData] = useState({
    patient_id: "",
    prescription_id: "",
    medicine_id: "",
    quantity: "",
  });
  const [issuedList, setIssuedList] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);

  // ✅ Fetch data
  useEffect(() => {
    fetchMedicines();
    fetchPatients();
    fetchIssuedMedicines();
  }, []);

  const token = localStorage.getItem("token");

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacy/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const fetchIssuedMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacy/medicines/issued", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssuedList(res.data);
    } catch (err) {
      console.error("Error fetching issued medicines:", err);
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/pharmacy/medicines/issue",
        {
          ...formData,
          issued_by: 4, // pharmacist user_id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("✅ Success", "Medicine issued successfully!", "success");
      setFormData({
        patient_id: "",
        prescription_id: "",
        medicine_id: "",
        quantity: "",
      });
      fetchIssuedMedicines(); // refresh table
    } catch (err) {
      Swal.fire("❌ Error", err.response?.data?.message || "Failed to issue medicine", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-red-700 mb-4">💊 Issue Medicine</h1>

      {/* Issue Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-8 grid grid-cols-2 gap-4"
      >
        <div>
          <label className="block font-semibold mb-1">Patient</label>
          <select
            className="w-full border rounded p-2"
            value={formData.patient_id}
            onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.patient_id} value={p.patient_id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Prescription ID</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={formData.prescription_id}
            onChange={(e) => setFormData({ ...formData, prescription_id: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Medicine</label>
          <select
            className="w-full border rounded p-2"
            value={formData.medicine_id}
            onChange={(e) => setFormData({ ...formData, medicine_id: e.target.value })}
            required
          >
            <option value="">-- Select Medicine --</option>
            {medicines.map((m) => (
              <option key={m.medicine_id} value={m.medicine_id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Quantity</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
          >
            Issue Medicine
          </button>
        </div>
      </form>

      {/* Issued Medicines List */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 Issued Medicines List</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Issue ID</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Patient</th>
              <th className="border p-2">Medicine</th>
              <th className="border p-2">Prescription</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Issued By</th>
            </tr>
          </thead>
          <tbody>
            {issuedList.length > 0 ? (
              issuedList.map((i) => (
                <tr key={i.issue_id} className="text-center hover:bg-gray-100">
                  <td className="border p-2">{i.issue_id}</td>
                  <td className="border p-2">{i.issue_date}</td>
                  <td className="border p-2">{i.patient_name}</td>
                  <td className="border p-2">{i.medicine_name}</td>
                  <td className="border p-2">{i.prescription_id}</td>
                  <td className="border p-2">{i.quantity}</td>
                  <td className="border p-2">{i.issued_by}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 p-3">
                  No issued medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueMedicinePage;
