// src/pages/admin/AppointmentsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import Topbar from "../../components/Topbar";

const API = "http://localhost:5000/api";

const statusTabs = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "Scheduled", label: "Scheduled" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token") || "";

  // form state for add
  const defaultForm = {
    appointment_code: "",
    patient_id: "",
    doctor_id: "",
    department: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
    status: "Scheduled",
  };
  const [form, setForm] = useState(defaultForm);

  // axios auth headers helper
  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
    fetchRefs();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [appointments, tab, search, doctorFilter, dateFilter, departmentFilter]);

  // fetch appointments (backend returns joined patient_name & doctor_name if your backend controller does that)
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/appointments`, { headers: authHeaders });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Fetch appointments:", err);
      alert("Error fetching appointments — check backend.");
    } finally {
      setLoading(false);
    }
  };

  // fetch doctors & patients for dropdowns (include auth header)
  const fetchRefs = async () => {
    try {
      const [dRes, pRes] = await Promise.all([
        axios.get(`${API}/doctors`, { headers: authHeaders }),
        axios.get(`${API}/patients`, { headers: authHeaders }),
      ]);
      setDoctors(dRes.data || []);
      setPatients(pRes.data || []);
    } catch (err) {
      console.error("Fetch refs:", err);
      // still allow page to load; show message
    }
  };

  // apply local filters
  const applyFilters = () => {
    let list = [...appointments];

    // Tab filter
    if (tab === "today") {
      const today = new Date().toISOString().slice(0, 10);
      list = list.filter((a) => a.appointment_date === today);
    } else if (tab !== "all") {
      list = list.filter((a) => a.status === tab);
    }

    // search
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (a) =>
          (a.appointment_code && a.appointment_code.toLowerCase().includes(s)) ||
          (a.patient_name && a.patient_name.toLowerCase().includes(s)) ||
          (a.notes && a.notes.toLowerCase().includes(s))
      );
    }

    // doctor filter (by id)
    if (doctorFilter) list = list.filter((a) => String(a.doctor_id) === String(doctorFilter));

    // department filter
    if (departmentFilter) list = list.filter((a) => (a.department || "").toLowerCase().includes(departmentFilter.toLowerCase()));

    // date filter
    if (dateFilter) list = list.filter((a) => a.appointment_date === dateFilter);

    setFiltered(list);
  };

  // helper to get patient/doctor names from ref lists if appointment row lacks joined names
  const getPatientName = (id) => {
    const p = patients.find((x) => String(x.patient_id) === String(id));
    return p ? `${p.first_name} ${p.last_name}` : `#${id}`;
  };
  const getDoctorName = (id) => {
    const d = doctors.find((x) => String(x.doctor_id) === String(id));
    return d ? d.full_name : `#${id}`;
  };

  // Auto-generate appointment code
  const genAppointmentCode = () => {
    const max = appointments.length ? Math.max(...appointments.map((a) => a.appointment_id || 0)) : 0;
    const next = max + 1;
    return `APT-${String(next).padStart(3, "0")}`;
  };

  // Create appointment
  const handleSave = async () => {
    if (!form.patient_id || !form.doctor_id || !form.appointment_date || !form.appointment_time) {
      return alert("Please fill patient, doctor, date and time.");
    }
    try {
      setLoading(true);
      // ensure code
      const code = form.appointment_code || genAppointmentCode();
      const payload = {
        ...form,
        appointment_code: code,
        patient_id: parseInt(form.patient_id, 10),
        doctor_id: parseInt(form.doctor_id, 10),
        status: form.status || "Scheduled",
      };

      const res = await axios.post(`${API}/appointments`, payload, { headers: authHeaders });
      if (res.status === 201 || res.status === 200) {
        setShowAdd(false);
        setForm(defaultForm);
        fetchAll(); // refresh with server-side joined names
      } else {
        alert("Failed to create appointment.");
      }
    } catch (err) {
      console.error("Create appt:", err);
      alert(err?.response?.data?.message || "Error creating appointment.");
    } finally {
      setLoading(false);
    }
  };

  // update status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API}/appointments/${id}`, { status: newStatus }, { headers: authHeaders });
      fetchAll();
    } catch (err) {
      console.error("Update status:", err);
      alert("Error updating status");
    }
  };

  // delete appointment
  const handleDelete = async (id) => {
    if (!window.confirm("Delete appointment?")) return;
    try {
      await axios.delete(`${API}/appointments/${id}`, { headers: authHeaders });
      fetchAll();
    } catch (err) {
      console.error("Delete appt:", err);
      alert("Error deleting appointment.");
    }
  };

  // open view modal
  const openView = (row) => {
    setViewItem(row);
    setShowView(true);
  };

  const StatusBadge = ({ status }) => {
    const classes =
      status === "Scheduled"
        ? "bg-yellow-100 text-yellow-800"
        : status === "Completed"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    return <span className={`px-2 py-1 rounded text-sm ${classes}`}>{status}</span>;
  };

  const formatDate = (d) => (d ? d : "-");

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Appointments</h1>
              <p className="text-sm text-gray-600 mt-1">Manage scheduling and doctor allocation</p>
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => {
                  setForm((f) => ({ ...defaultForm, appointment_code: genAppointmentCode() }));
                  setShowAdd(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow"
              >
                + New Appointment
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {statusTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded ${tab === t.key ? "bg-blue-600 text-white" : "bg-white border"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <input
              placeholder="Search by patient name, code, notes..."
              className="border p-2 rounded w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select className="border p-2 rounded" value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
              <option value="">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.doctor_id} value={d.doctor_id}>
                  {d.full_name} ({d.specialization})
                </option>
              ))}
            </select>

            <input type="text" placeholder="Department" className="border p-2 rounded" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} />

            <input type="date" className="border p-2 rounded" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />

            <button onClick={() => { setSearch(""); setDoctorFilter(""); setDepartmentFilter(""); setDateFilter(""); }} className="px-3 py-2 border rounded">Clear</button>
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="9" className="p-6 text-center">Loading...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan="9" className="p-6 text-center text-gray-500">No appointments found.</td></tr>
                )}

                {!loading &&
                  filtered.map((a) => (
                    <tr key={a.appointment_id} className="border-b">
                      <td className="p-3">{a.appointment_code}</td>
                      <td className="p-3">{a.patient_name || getPatientName(a.patient_id)}</td>
                      <td className="p-3">{a.doctor_name || getDoctorName(a.doctor_id)}</td>
                      <td className="p-3">{a.department}</td>
                      <td className="p-3">{formatDate(a.appointment_date)}</td>
                      <td className="p-3">{a.appointment_time ? a.appointment_time.substring(0,5) : "-"}</td>
                      <td className="p-3"><StatusBadge status={a.status} /></td>
                      <td className="p-3">{a.notes ? (a.notes.length>50? a.notes.slice(0,50)+"...": a.notes) : "-"}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => openView(a)} className="px-2 py-1 bg-gray-200 rounded">View</button>
                          <select
                            value=""
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) return;
                              updateStatus(a.appointment_id, val);
                            }}
                            className="border rounded p-1"
                          >
                            <option value="">Change status</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button onClick={() => handleDelete(a.appointment_id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Create Appointment" onClose={() => setShowAdd(false)}>
          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2">
              <div className="text-sm font-semibold mb-1">Appointment Code</div>
              <input className="w-full border p-2 rounded" value={form.appointment_code || genAppointmentCode()} onChange={(e)=> setForm({...form, appointment_code: e.target.value})} />
            </label>

            <label>
              <div className="text-sm font-semibold mb-1">Patient</div>
              <select className="w-full border p-2 rounded" value={form.patient_id} onChange={(e)=> setForm({...form, patient_id: e.target.value})}>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.first_name} {p.last_name} ({p.patient_code})</option>)}
              </select>
            </label>

            <label>
              <div className="text-sm font-semibold mb-1">Doctor</div>
              <select className="w-full border p-2 rounded" value={form.doctor_id} onChange={(e)=> setForm({...form, doctor_id: e.target.value})}>
                <option value="">Select doctor</option>
                {doctors.map(d => <option key={d.doctor_id} value={d.doctor_id}>{d.full_name} - {d.specialization}</option>)}
              </select>
            </label>

            <label>
              <div className="text-sm font-semibold mb-1">Department</div>
              <input className="w-full border p-2 rounded" value={form.department} onChange={(e)=> setForm({...form, department: e.target.value})} placeholder="e.g. Cardiology"/>
            </label>

            <label>
              <div className="text-sm font-semibold mb-1">Date</div>
              <input type="date" className="w-full border p-2 rounded" value={form.appointment_date} onChange={(e)=> setForm({...form, appointment_date: e.target.value})}/>
            </label>

            <label>
              <div className="text-sm font-semibold mb-1">Time</div>
              <input type="time" className="w-full border p-2 rounded" value={form.appointment_time} onChange={(e)=> setForm({...form, appointment_time: e.target.value})}/>
            </label>

            <label className="col-span-2">
              <div className="text-sm font-semibold mb-1">Notes</div>
              <textarea className="w-full border p-2 rounded" rows="3" value={form.notes} onChange={(e)=> setForm({...form, notes: e.target.value})}/>
            </label>

            <div className="col-span-2 flex justify-end gap-3">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {showView && viewItem && (
        <Modal title={`Appointment ${viewItem.appointment_code}`} onClose={() => setShowView(false)}>
          <div className="space-y-3">
            <div><strong>Patient:</strong> {viewItem.patient_name || getPatientName(viewItem.patient_id)}</div>
            <div><strong>Doctor:</strong> {viewItem.doctor_name || getDoctorName(viewItem.doctor_id)}</div>
            <div><strong>Department:</strong> {viewItem.department}</div>
            <div><strong>Date:</strong> {viewItem.appointment_date}</div>
            <div><strong>Time:</strong> {viewItem.appointment_time}</div>
            <div><strong>Status:</strong> <StatusBadge status={viewItem.status} /></div>
            <div><strong>Notes:</strong> <div className="mt-1 p-2 bg-gray-50 rounded">{viewItem.notes || "-"}</div></div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowView(false)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );

  // helper to set form defaults (optional)
  function setEditDefaults() {
    if (!form.appointment_code) setForm((f) => ({ ...f, appointment_code: genAppointmentCode() }));
  }
}

// small Modal component
function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded shadow-lg w-[90%] max-w-3xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
