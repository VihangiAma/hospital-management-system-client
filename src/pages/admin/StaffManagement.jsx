import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/Topbar";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [staffCode, setStaffCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Nurse");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [shift, setShift] = useState("");
  const [status, setStatus] = useState("Active");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStaff();
  }, []);

  // 🧭 Fetch all staff
  const fetchStaff = async () => {
    const res = await fetch("http://localhost:5000/api/staff", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStaff(data);
    setLoading(false);
  };

  // 🔁 Reset form
  const resetForm = () => {
    setStaffCode("");
    setFullName("");
    setRole("Nurse");
    setContactNumber("");
    setEmail("");
    setShift("");
    setStatus("Active");
    setEditingStaff(null);
  };

  // 🧮 Generate next staff code automatically
  const generateStaffCode = () => {
    if (staff.length === 0) return "STF001";
    const lastCode = staff[staff.length - 1].staff_code || "STF000";
    const num = parseInt(lastCode.replace("STF", "")) + 1;
    return `STF${num.toString().padStart(3, "0")}`;
  };

  // 💾 Add or Update staff
  const handleSubmit = async (e) => {
    e.preventDefault();

    const codeToUse = editingStaff ? staffCode : generateStaffCode();

    const staffData = {
      staff_code: codeToUse,
      full_name: fullName,
      role,
      contact_number: contactNumber,
      email,
      shift,
      status,
    };

    console.log("Sending staff data:", staffData);

    let url = "http://localhost:5000/api/staff";
    let method = "POST";

    if (editingStaff) {
      url = `http://localhost:5000/api/staff/${editingStaff.staff_id}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(staffData),
    });

    if (res.ok) {
      alert(editingStaff ? "✅ Staff Updated" : "✅ Staff Added");
      fetchStaff();
      setShowModal(false);
      resetForm();
    } else {
      const error = await res.json();
      alert(`❌ Failed: ${error.message}`);
      console.error("Error:", error);
    }
  };

  // ✏️ Edit staff
  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setStaffCode(staffMember.staff_code);
    setFullName(staffMember.full_name);
    setRole(staffMember.role);
    setContactNumber(staffMember.contact_number);
    setEmail(staffMember.email);
    setShift(staffMember.shift);
    setStatus(staffMember.status);
    setShowModal(true);
  };

  // 🗑️ Delete staff
  const handleDelete = async (id) => {
    if (!window.confirm("❗ Are you sure you want to delete this staff?")) return;

    const res = await fetch(`http://localhost:5000/api/staff/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert("🗑️ Staff Deleted");
      fetchStaff();
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminTopbar />

        <div className="p-6 mt-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Staff Management</h2>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add Staff
            </button>
          </div>

          {/* Staff Table */}
          <div className="bg-white shadow rounded p-4">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Code</th>
                  <th className="p-2 border">Full Name</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Shift</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.staff_id}>
                    <td className="border p-2">{s.staff_code}</td>
                    <td className="border p-2">{s.full_name}</td>
                    <td className="border p-2">{s.role}</td>
                    <td className="border p-2">{s.contact_number}</td>
                    <td className="border p-2">{s.email}</td>
                    <td className="border p-2">{s.shift}</td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          s.status === "Active" ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.staff_id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-1/2">
                <h3 className="text-xl font-semibold mb-4">
                  {editingStaff ? "Edit Staff" : "Add Staff"}
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Staff Code"
                      value={staffCode || generateStaffCode()}
                      onChange={(e) => setStaffCode(e.target.value)}
                      className="border p-2 rounded"
                      readOnly={!editingStaff}
                    />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border p-2 rounded"
                      required
                    />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option>Nurse</option>
                      <option>Lab Technician</option>
                      <option>Receptionist</option>
                      <option>Pharmacist</option>
                      <option>Cleaner</option>
                      <option>Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Contact Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Shift (e.g., Morning / Night)"
                      value={shift}
                      onChange={(e) => setShift(e.target.value)}
                      className="border p-2 rounded"
                      required
                    />
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>

                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      {editingStaff ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
