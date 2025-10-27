import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Topbar from "../../components/Topbar";

const SPECIALIZATIONS = [
  "General Physician",
  "Cardiologist",
  "Pediatrician",
  "Surgeon",
  "Dermatologist",
  "Dentist",
  "Neurologist",
  "Other"
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    doctor_code: "",
    full_name: "",
    specialization: SPECIALIZATIONS[0],
    other_specialization: "",
    contact_number: "",
    email: "",
    department: "",
    start_time: "",
    end_time: "",
    status: "Available"
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Fetch doctors error:", err);
      alert("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditMode(false);
    setForm({
      doctor_code: generateDoctorCode(),
      full_name: "",
      specialization: SPECIALIZATIONS[0],
      other_specialization: "",
      contact_number: "",
      email: "",
      department: "",
      start_time: "",
      end_time: "",
      status: "Available"
    });
    setShowModal(true);
  };

  const openEdit = (doc) => {
    // split working_hours if present like "09:00 - 17:00"
    let start = "";
    let end = "";
    if (doc.working_hours) {
      const parts = doc.working_hours.split("-").map(p => p.trim());
      if (parts.length === 2) { start = parts[0]; end = parts[1]; }
    }
    const isOther = !SPECIALIZATIONS.includes(doc.specialization);
    setForm({
      doctor_code: doc.doctor_code || "",
      full_name: doc.full_name || "",
      specialization: isOther ? "Other" : (doc.specialization || SPECIALIZATIONS[0]),
      other_specialization: isOther ? doc.specialization : "",
      contact_number: doc.contact_number || "",
      email: doc.email || "",
      department: doc.department || "",
      start_time: start,
      end_time: end,
      status: doc.status || "Available",
      doctor_id: doc.doctor_id
    });
    setEditMode(true);
    setShowModal(true);
  };

  const generateDoctorCode = () => {
    const count = doctors.length + 1;
    return `DOC-${String(count).padStart(4, "0")}`;
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this doctor?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/doctors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchDoctors();
      else alert("Delete failed");
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    // validation
    if (!form.full_name || !form.email) return alert("Name and email required");

    const specialization = form.specialization === "Other" ? form.other_specialization.trim() : form.specialization;
    const working_hours = form.start_time && form.end_time ? `${form.start_time} - ${form.end_time}` : null;

    const payload = {
      doctor_code: form.doctor_code,
      full_name: form.full_name,
      specialization,
      contact_number: form.contact_number,
      email: form.email,
      department: form.department,
      working_hours,
      status: form.status
    };

    try {
      const url = editMode ? `http://localhost:5000/api/doctors/${form.doctor_id}` : "http://localhost:5000/api/doctors";
      const method = editMode ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json().catch(()=>({message: "Unknown error"}));
        return alert("Save failed: " + (body.message || res.statusText));
      }

      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      console.error("Save doctor error:", err);
      alert("Save failed");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        <div className="p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Doctor Management</h1>
            <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Doctor</button>
          </div>

          <div className="bg-white shadow rounded">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Code</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Specialization</th>
                  <th className="p-3 border">Contact</th>
                  <th className="p-3 border">Department</th>
                  <th className="p-3 border">Working Hours</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="p-4 text-center">Loading...</td></tr>
                ) : doctors.length === 0 ? (
                  <tr><td colSpan={8} className="p-4 text-center">No doctors found</td></tr>
                ) : doctors.map(doc => (
                  <tr key={doc.doctor_id} className="text-sm">
                    <td className="p-2 border text-center">{doc.doctor_code}</td>
                    <td className="p-2 border">{doc.full_name}</td>
                    <td className="p-2 border">{doc.specialization}</td>
                    <td className="p-2 border">{doc.contact_number}</td>
                    <td className="p-2 border">{doc.department}</td>
                    <td className="p-2 border">{doc.working_hours || "-"}</td>
                    <td className="p-2 border">{doc.status}</td>
                    <td className="p-2 border flex gap-2 justify-center">
                      <button onClick={() => openEdit(doc)} className="px-3 py-1 bg-yellow-500 rounded text-white">Edit</button>
                      <button onClick={() => handleDelete(doc.doctor_id)} className="px-3 py-1 bg-red-600 rounded text-white">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{editMode ? "Edit Doctor" : "Add Doctor"}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-600">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">Doctor Code</label>
                  <input className="w-full border p-2 rounded" value={form.doctor_code} onChange={(e)=>setForm({...form, doctor_code: e.target.value})} required />
                </div>

                <div>
                  <label className="block text-sm">Full Name</label>
                  <input className="w-full border p-2 rounded" value={form.full_name} onChange={(e)=>setForm({...form, full_name: e.target.value})} required />
                </div>

                <div>
                  <label className="block text-sm">Specialization</label>
                  <select className="w-full border p-2 rounded" value={form.specialization} onChange={(e)=>setForm({...form, specialization:e.target.value})}>
                    {SPECIALIZATIONS.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {form.specialization === "Other" && (
                  <div>
                    <label className="block text-sm">Other Specialization</label>
                    <input className="w-full border p-2 rounded" value={form.other_specialization} onChange={(e)=>setForm({...form, other_specialization:e.target.value})} required />
                  </div>
                )}

                <div>
                  <label className="block text-sm">Contact Number</label>
                  <input className="w-full border p-2 rounded" value={form.contact_number} onChange={(e)=>setForm({...form, contact_number: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm">Email</label>
                  <input type="email" className="w-full border p-2 rounded" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm">Department</label>
                  <input className="w-full border p-2 rounded" value={form.department} onChange={(e)=>setForm({...form, department: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm">Start Time</label>
                  <input type="time" className="w-full border p-2 rounded" value={form.start_time} onChange={(e)=>setForm({...form, start_time: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm">End Time</label>
                  <input type="time" className="w-full border p-2 rounded" value={form.end_time} onChange={(e)=>setForm({...form, end_time: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm">Status</label>
                  <select className="w-full border p-2 rounded" value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})}>
                    <option>Available</option>
                    <option>On Leave</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{editMode ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
