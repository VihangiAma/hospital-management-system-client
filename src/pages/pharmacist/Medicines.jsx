import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PharmacistSidebar from "../../components/PharmacistSidebar";
import Topbar from "../../components/PharmacistTopbar";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    medicine_code: "",
    name: "",
    category: "",
    supplier_id: "",
    unit_price: "",
    quantity_in_stock: "",
    expiry_date: "",
    reorder_level: "",
    status: "Available",
  });

  useEffect(() => {
    fetchMedicines();
    fetchSuppliers();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacy/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacy/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error("Supplier fetch error:", err);
    }
  };

  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      medicine_code: `MED-${String(medicines.length + 1).padStart(4, "0")}`,
      name: "",
      category: "",
      supplier_id: "",
      unit_price: "",
      quantity_in_stock: "",
      expiry_date: "",
      reorder_level: "",
      status: "Available",
    });
    setShowModal(true);
  };

  const handleEdit = (medicine) => {
    setEditMode(true);
    setFormData(medicine);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Medicine?",
      text: "This will permanently delete the record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B30000",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/pharmacy/medicines/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "Medicine deleted successfully.", "success");
        fetchMedicines();
      } catch (err) {
        Swal.fire("Error", "Failed to delete medicine.", "error");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5000/api/pharmacy/medicines/${formData.medicine_id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Updated!", "Medicine updated successfully.", "success");
      } else {
        await axios.post("http://localhost:5000/api/pharmacy/medicines", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Added!", "Medicine added successfully.", "success");
      }
      setShowModal(false);
      fetchMedicines();
    } catch (err) {
      Swal.fire("Error", "Failed to save medicine.", "error");
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // Auto Status based on expiry/stock
  const getStatusColor = (status) => {
    switch (status) {
      case "Expired":
        return "bg-red-200 text-red-700";
      case "Out of Stock":
        return "bg-yellow-200 text-yellow-700";
      default:
        return "bg-green-200 text-green-700";
    }
  };

  return (
    <div className="flex">
      <PharmacistSidebar />
      <div className="flex-1 ml-64 p-6">
        <Topbar />
        <h1 className="text-2xl font-bold mb-4">Medicine Management</h1>

        {/* Search + Add */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search medicine..."
            className="border p-2 rounded w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Medicine
          </button>
        </div>

        {/* Medicine Table */}
        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Supplier</th>
              <th className="p-2 border">Price (Rs)</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Expiry</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((m) => (
              <tr key={m.medicine_id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{m.medicine_code}</td>
                <td className="p-2 border">{m.name}</td>
                <td className="p-2 border">{m.category}</td>
                <td className="p-2 border">{m.supplier_name || "N/A"}</td>
                <td className="p-2 border">{m.unit_price}</td>
                <td
                  className={`p-2 border ${
                    m.quantity_in_stock <= m.reorder_level
                      ? "bg-yellow-100 text-yellow-800 font-medium"
                      : ""
                  }`}
                >
                  {m.quantity_in_stock}
                </td>
                <td className="p-2 border">{m.expiry_date?.split("T")[0]}</td>
                <td className={`p-2 border rounded ${getStatusColor(m.status)}`}>
                  {m.status}
                </td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(m.medicine_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-2/3">
              <h2 className="text-xl font-semibold mb-4">
                {editMode ? "Edit Medicine" : "Add Medicine"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-2"
                  placeholder="Medicine Code"
                  value={formData.medicine_code}
                  disabled
                />
                <input
                  className="border p-2"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  className="border p-2"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
                <select
                  className="border p-2"
                  value={formData.supplier_id}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_id: e.target.value })
                  }
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.supplier_id} value={s.supplier_id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  className="border p-2"
                  type="number"
                  placeholder="Unit Price"
                  value={formData.unit_price}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_price: e.target.value })
                  }
                />
                <input
                  className="border p-2"
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity_in_stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity_in_stock: e.target.value,
                    })
                  }
                />
                <input
                  className="border p-2"
                  type="date"
                  placeholder="Expiry Date"
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                />
                <input
                  className="border p-2"
                  type="number"
                  placeholder="Reorder Level"
                  value={formData.reorder_level}
                  onChange={(e) =>
                    setFormData({ ...formData, reorder_level: e.target.value })
                  }
                />
                <select
                  className="border p-2"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option>Available</option>
                  <option>Out of Stock</option>
                  <option>Expired</option>
                </select>
              </div>

              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;
