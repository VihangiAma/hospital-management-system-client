import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar";
import Topbar from "../../components/Topbar";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    department_code: "",
    name: "",
    description: "",
    head_doctor_id: "",
    status: "Active",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ add token here
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/departments/${editingId}`,
          formData
        );
        Swal.fire("Updated!", "Department updated successfully.", "success");
      } else {
        await axios.post("http://localhost:5000/api/departments", formData);
        Swal.fire("Added!", "Department added successfully.", "success");
      }
      setFormData({
        department_code: "",
        name: "",
        description: "",
        head_doctor_id: "",
        status: "Active",
      });
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire("Error", "Failed to save department.", "error");
    }
  };

  const handleEdit = (dept) => {
    setFormData(dept);
    setEditingId(dept.department_id);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the department.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B30000",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${id}`);
        Swal.fire("Deleted!", "Department removed successfully.", "success");
        fetchDepartments();
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Unable to delete department.", "error");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-[#B30000]">Departments</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="department_code"
            value={formData.department_code}
            onChange={handleChange}
            placeholder="Department Code"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Department Name"
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded col-span-2"
          />
          <input
            type="number"
            name="head_doctor_id"
            value={formData.head_doctor_id}
            onChange={handleChange}
            placeholder="Head Doctor ID"
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-[#B30000] text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
        >
          {editingId ? "Update Department" : "Add Department"}
        </button>
      </form>

      {/* Department Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Code</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Head Doctor ID</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept.department_id} className="hover:bg-gray-50">
                  <td className="p-3 border">{dept.department_code}</td>
                  <td className="p-3 border">{dept.name}</td>
                  <td className="p-3 border">{dept.description}</td>
                  <td className="p-3 border">{dept.head_doctor_id}</td>
                  <td
                    className={`p-3 border font-semibold ${
                      dept.status === "Active"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {dept.status}
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept.department_id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentsPage;
