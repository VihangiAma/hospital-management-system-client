import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PharmacistSidebar from "../../components/PharmacistSidebar";
import Topbar from "../../components/Topbar";


const ManageSuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    supplier_id: "",
    supplier_code: "",
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    status: "Active",
  });

  // 🔹 Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/pharmacy/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // 🔹 Handle input change
  const handleChange = (field, value) => {
    setCurrentSupplier((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Open Add Supplier Modal
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentSupplier({
      supplier_code: "",
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  // 🔹 Open Edit Modal
  const openEditModal = (supplier) => {
    setIsEditing(true);
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };

  // 🔹 Save Supplier (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/pharmacy/suppliers/${currentSupplier.supplier_id}`,
          currentSupplier,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Updated!", "Supplier updated successfully.", "success");
      } else {
        await axios.post(
          "http://localhost:5000/api/pharmacy/suppliers",
          currentSupplier,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Added!", "Supplier added successfully.", "success");
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      Swal.fire("Error!", "Failed to save supplier.", "error");
    }
  };

  // 🔹 Delete Supplier
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the supplier!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B30000",
      cancelButtonColor: "#2C2C2C",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:5000/api/pharmacy/suppliers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "Supplier deleted successfully.", "success");
          fetchSuppliers();
        } catch (err) {
          Swal.fire("Error!", "Failed to delete supplier.", "error");
        }
      }
    });
  };

  return (
    <div className="p-6 bg-[#F5F5F5] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#2C2C2C]">🏭 Manage Suppliers</h2>
        <button
          onClick={openAddModal}
          className="bg-[#B30000] hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Supplier
        </button>
      </div>

      {/* Supplier Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#B30000] text-white">
              <th className="py-2 px-3 text-left">Code</th>
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Contact Person</th>
              <th className="py-2 px-3 text-left">Phone</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Status</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.supplier_id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-3">{supplier.supplier_code}</td>
                  <td className="py-2 px-3">{supplier.name}</td>
                  <td className="py-2 px-3">{supplier.contact_person}</td>
                  <td className="py-2 px-3">{supplier.phone}</td>
                  <td className="py-2 px-3">{supplier.email}</td>
                  <td className="py-2 px-3 font-medium">{supplier.status}</td>
                  <td className="py-2 px-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(supplier)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.supplier_id)}
                      className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[600px] shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-[#B30000]"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4 text-[#2C2C2C]">
              {isEditing ? "✏️ Edit Supplier" : "➕ Add Supplier"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Supplier Code"
                  value={currentSupplier.supplier_code}
                  onChange={(e) => handleChange("supplier_code", e.target.value)}
                  className="border px-3 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={currentSupplier.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border px-3 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={currentSupplier.contact_person}
                  onChange={(e) => handleChange("contact_person", e.target.value)}
                  className="border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={currentSupplier.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="border px-3 py-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={currentSupplier.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border px-3 py-2 rounded col-span-2"
                />
                <textarea
                  placeholder="Address"
                  value={currentSupplier.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="border px-3 py-2 rounded col-span-2"
                  rows="2"
                />
                <select
                  value={currentSupplier.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="border px-3 py-2 rounded col-span-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#B30000] text-white px-4 py-2 rounded hover:bg-red-700 w-full"
              >
                {isEditing ? "Update Supplier" : "Save Supplier"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSuppliersPage;
