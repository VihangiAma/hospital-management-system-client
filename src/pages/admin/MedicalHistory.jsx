import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/Topbar";

const MedicalHistory = () => {
  const { patient_id } = useParams(); // ✅ must match route name
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [visitDate, setVisitDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [prescription, setPrescription] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const token = localStorage.getItem("token"); // ✅ for protected routes

 useEffect(() => {
  if (!patient_id) return;
  fetchPatient();
  fetchHistory();
}, [patient_id]);


  const fetchPatient = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/patients/${patient_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPatient(data); // or setPatient(data.patient) depending on backend
  } catch (err) {
    console.error("Error fetching patient", err);
    setLoading(false);
  }
};

const fetchHistory = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/medical-history/id/${patient_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setHistory(data);
  } catch (err) {
    console.error("Error fetching history", err);
  } finally {
    setLoading(false);
  }
};

  const handleAddHistory = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/medical-history", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        patient_id,
        visit_date: visitDate,
        diagnosis,
        treatment,
        prescription,
        doctor_id: doctorId,
      }),
    });

    if (res.ok) {
      alert("✅ Medical History Added Successfully");
      fetchHistory();
      setVisitDate("");
      setDiagnosis("");
      setTreatment("");
      setPrescription("");
      setDoctorId("");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminTopbar />

        <div className="p-6 mt-16">
          <h2 className="text-2xl font-bold mb-4">
            Medical History - {patient?.first_name} {patient?.last_name}
          </h2>

          {/* Add Medical History Form */}
          <form onSubmit={handleAddHistory} className="bg-white shadow p-4 rounded mb-6">
            <h3 className="text-lg font-semibold mb-3">Add Medical History</h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="border p-2 rounded"
                required
              />
            </div>

            <textarea
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full border p-2 rounded mt-3"
              required
            />
            <textarea
              placeholder="Treatment"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full border p-2 rounded mt-3"
              required
            />
            <textarea
              placeholder="Prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full border p-2 rounded mt-3"
              required
            />

            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add History
            </button>
          </form>

          {/* History Table */}
          <div className="bg-white shadow p-4 rounded">
            <h3 className="text-lg font-semibold mb-3">Medical History Records</h3>

            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Diagnosis</th>
                  <th className="p-2 border">Treatment</th>
                  <th className="p-2 border">Prescription</th>
                  <th className="p-2 border">Doctor ID</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.history_id}>
                    <td className="border p-2">{h.visit_date?.slice(0, 10)}</td>
                    <td className="border p-2">{h.diagnosis}</td>
                    <td className="border p-2">{h.treatment}</td>
                    <td className="border p-2">{h.prescription}</td>
                    <td className="border p-2">{h.doctor_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MedicalHistory;
