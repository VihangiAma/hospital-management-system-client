import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/Topbar";

const DutyShifts = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [doctors, setDoctors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [staffId, setStaffId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [remarks, setRemarks] = useState("");

  const [editingShift, setEditingShift] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctors();
    fetchStaff();
    fetchShifts();
  }, []);

  const fetchDoctors = async () => {
    const res = await fetch("http://localhost:5000/api/doctors", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDoctors(data);
  };

  const fetchStaff = async () => {
    const res = await fetch("http://localhost:5000/api/staff", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStaff(data);
  };

  const fetchShifts = async () => {
    const res = await fetch("http://localhost:5000/api/shifts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setShifts(data);
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min of ["00", "30"]) {
        times.push(`${hour.toString().padStart(2, "0")}:${min}`);
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  const getShiftType = (start) => {
    if (!start) return "";
    const hour = parseInt(start.split(":")[0]);
    if (hour >= 6 && hour < 14) return "Morning";
    if (hour >= 14 && hour < 22) return "Evening";
    return "Night";
  };

  const getShiftColor = (type) => {
    switch (type) {
      case "Morning":
        return "bg-green-100 text-green-700 border-green-300";
      case "Evening":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Night":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();

    if (!staffId && !doctorId) {
      alert("❌ Please select at least a staff member or a doctor.");
      return;
    }

    if (endTime <= startTime) {
      alert("❌ End time must be later than start time.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/shifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        staff_id: staffId || null,
        doctor_id: doctorId || null,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        remarks,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed to assign shift");

    alert("✅ Shift Assigned Successfully");
    resetForm();
    fetchShifts();
  };

  const handleEditShift = (shift) => {
    setEditingShift(shift);
    setActiveTab("create");
    setStaffId(shift.staff_id);
    setDoctorId(shift.doctor_id);
    setShiftDate(shift.shift_date);
    setStartTime(shift.start_time);
    setEndTime(shift.end_time);
    setRemarks(shift.remarks || "");
  };

  const handleUpdateShift = async (e) => {
    e.preventDefault();

    if (!staffId && !doctorId) {
      alert("❌ Please select at least a staff member or a doctor.");
      return;
    }

    const res = await fetch(`http://localhost:5000/api/shifts/${editingShift.shift_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        staff_id: staffId || null,
        doctor_id: doctorId || null,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        remarks,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed to update shift");

    alert("✏️ Shift Updated Successfully");
    resetForm();
    fetchShifts();
  };

  const handleDeleteShift = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;
    const res = await fetch(`http://localhost:5000/api/shifts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert("🗑️ Shift Deleted");
      fetchShifts();
    }
  };

  const resetForm = () => {
    setEditingShift(null);
    setStaffId("");
    setDoctorId("");
    setShiftDate("");
    setStartTime("");
    setEndTime("");
    setRemarks("");
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminTopbar />

        <div className="p-6 mt-16">
          <h2 className="text-2xl font-bold mb-6">Duty Shift Management</h2>

          {/* Tabs */}
          <div className="flex gap-6 border-b pb-2 mb-6">
            <button
              onClick={() => setActiveTab("create")}
              className={`pb-2 ${activeTab === "create" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
            >
              {editingShift ? "Edit Shift" : "Create Shift"}
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`pb-2 ${activeTab === "view" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
            >
              View Shifts
            </button>
          </div>

          {/* Create/Edit Form */}
          {activeTab === "create" && (
            <form
              onSubmit={editingShift ? handleUpdateShift : handleCreateShift}
              className="bg-white p-6 shadow rounded w-full transition-all"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Staff (Optional)</label>
                  <select
                    className="border p-2 w-full mt-1 rounded"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                  >
                    <option value="">Select Staff</option>
                    {staff.map((s) => (
                      <option key={s.staff_id} value={s.staff_id}>
                        {s.staff_code} - {s.full_name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold">Doctor (Optional)</label>
                  <select
                    className="border p-2 w-full mt-1 rounded"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.doctor_id} value={d.doctor_id}>
                        {d.doctor_code} - {d.full_name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold">Shift Date</label>
                  <input
                    type="date"
                    className="border p-2 w-full mt-1 rounded"
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold">Start Time</label>
                  <select
                    className="border p-2 w-full mt-1 rounded"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  >
                    <option value="">Select Start Time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold">End Time</label>
                  <select
                    className="border p-2 w-full mt-1 rounded"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  >
                    <option value="">Select End Time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                placeholder="Remarks"
                className="border p-2 w-full mt-4 rounded"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>

              <div className="mt-4 flex gap-3">
                <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
                  {editingShift ? "Update Shift" : "Assign Shift"}
                </button>
                {editingShift && (
                  <button
                    type="button"
                    className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {/* View Shifts */}
          {activeTab === "view" && (
            <div className="bg-white p-6 shadow rounded">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Staff</th>
                    <th className="p-2 border">Doctor</th>
                    <th className="p-2 border">Shift</th>
                    <th className="p-2 border">Remarks</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((s) => {
                    const shiftType = getShiftType(s.start_time);
                    const shiftClass = getShiftColor(shiftType);
                    return (
                      <tr key={s.shift_id}>
                        <td className="p-2 border">{s.shift_date}</td>
                        <td className="p-2 border">{s.staff_name || "-"}</td>
                        <td className="p-2 border">{s.doctor_name || "-"}</td>
                        <td className="p-2 border">
                          <span className={`px-2 py-1 rounded text-xs border ${shiftClass}`}>
                            {s.start_time} - {s.end_time} ({shiftType})
                          </span>
                        </td>
                        <td className="p-2 border">{s.remarks}</td>
                        <td className="p-2 border flex gap-2">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => handleEditShift(s)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleDeleteShift(s.shift_id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DutyShifts;
