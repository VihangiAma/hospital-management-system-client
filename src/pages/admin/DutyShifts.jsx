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
        const time = `${hour.toString().padStart(2, "0")}:${min}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  const handleCreateShift = async (e) => {
    e.preventDefault();

    if (endTime <= startTime) {
      alert("❌ End time must be later than start time.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/shifts", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        staff_id: staffId,
        doctor_id: doctorId,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        remarks
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to assign shift");
      return;
    }

    alert("✅ Shift Assigned Successfully");
    setStaffId("");
    setDoctorId("");
    setShiftDate("");
    setStartTime("");
    setEndTime("");
    setRemarks("");

    fetchShifts();
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
              Create Shift
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`pb-2 ${activeTab === "view" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
            >
              View Shifts
            </button>
          </div>

          {/* Create Shift */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateShift} className="bg-white p-6 shadow rounded w-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Staff</label>
                  <select
                    className="border p-2 w-full mt-1 rounded"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    required
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
                  <label className="font-semibold">Doctor</label>
                  <select
                    className="border p-2 w-full mt-1 rounded"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    required
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

              <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
                Assign Shift
              </button>
            </form>
          )}

          {/* View Shifts */}
          {activeTab === "view" && (
            <div className="bg-white p-6 shadow rounded">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Staff</th>
                    <th className="p-2 border">Doctor</th>
                    <th className="p-2 border">Start</th>
                    <th className="p-2 border">End</th>
                    <th className="p-2 border">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((s) => (
                    <tr key={s.shift_id}>
                      <td className="p-2 border">{s.shift_date}</td>
                      <td className="p-2 border">{s.staff_name}</td>
                      <td className="p-2 border">{s.doctor_name}</td>
                      <td className="p-2 border">{s.start_time}</td>
                      <td className="p-2 border">{s.end_time}</td>
                      <td className="p-2 border">{s.remarks}</td>
                    </tr>
                  ))}
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
