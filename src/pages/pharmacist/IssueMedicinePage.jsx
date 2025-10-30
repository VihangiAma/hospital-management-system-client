import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PharmacistSidebar from "../../components/PharmacistSidebar";
import PharmacistTopbar from "../../components/PharmacistTopbar";

const IssueMedicinePage = () => {
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [issued, setIssuedMedicines] = useState([]);
  

  const pharmacist = JSON.parse(localStorage.getItem("username")); // assuming your pharmacist data is stored after login

  const [formData, setFormData] = useState({
    patient_id: "",
    prescription_id: "",
    medicine_id: "",
    quantity: "",
    issue_date: new Date().toISOString().split("T")[0], // default to today
    issued_by: pharmacist?._id || "",
  });

  // ✅ Load dropdown data
 useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
      const [patientsRes, medicinesRes, issuedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/patients", { headers }),
        axios.get("http://localhost:5000/api/pharmacy/medicines", { headers }),
        axios.get("http://localhost:5000/api/pharmacy/medicines/issued", { headers }),
      ]);

      setPatients(patientsRes.data);
      setMedicines(medicinesRes.data);
      setIssuedMedicines(issuedRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  fetchData();
}, []);


  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/issued-medicines", formData);
      Swal.fire("✅ Success", "Medicine issued successfully!", "success");

      // Refresh table
      const updated = await axios.get("http://localhost:5000/api/issued-medicines");
      setIssued(updated.data);

      // Reset form
      setFormData({
        patient_id: "",
        prescription_id: "",
        medicine_id: "",
        quantity: "",
        issue_date: new Date().toISOString().split("T")[0],
        issued_by: pharmacist?._id || "",
      });
    } catch (error) {
      console.error("Error issuing medicine:", error);
      Swal.fire("❌ Error", "Failed to issue medicine", "error");
    }
  };

  return (
    <div className="flex">
      <PharmacistSidebar />
      <div className="flex-1 ml-64 p-6">
        <PharmacistTopbar />
        <h1 className="text-2xl font-bold mb-4">Medicine Management</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-6 bg-white shadow-md p-6 rounded-2xl"
      >
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Patient</label>
          <select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          >
            <option value="">Select Patient</option>
            {Array.isArray(patients) &&
              patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Prescription ID
          </label>
          <input
            type="text"
            name="prescription_id"
            value={formData.prescription_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Medicine</label>
          <select
            name="medicine_id"
            value={formData.medicine_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          >
            <option value="">Select Medicine</option>
            {Array.isArray(medicines) &&
              medicines.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Issue Date</label>
          <input
            type="date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Issued By (Pharmacist)
          </label>
          <input
            type="text"
            value={pharmacist?.name || "Unknown"}
            disabled
            className="w-full border p-2 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-[#B30000] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Issue Medicine
          </button>
        </div>
      </form>

      {/* ISSUED MEDICINES TABLE */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Issued Medicines
        </h2>
        <table className="w-full border text-sm text-left bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Prescription ID</th>
              <th className="p-2 border">Medicine</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Issue Date</th>
              <th className="p-2 border">Issued By</th>
            </tr>
          </thead>
          <tbody>
            {issued.map((item) => (
              <tr key={item._id}>
                <td className="p-2 border">{item.patient_id?.name || "N/A"}</td>
                <td className="p-2 border">{item.prescription_id}</td>
                <td className="p-2 border">{item.medicine_id?.name || "N/A"}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">
                  {new Date(item.issue_date).toLocaleDateString()}
                </td>
                <td className="p-2 border">{item.issued_by?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default IssueMedicinePage;
