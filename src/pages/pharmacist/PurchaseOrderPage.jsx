import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PharmacistSidebar from "../../components/PharmacistSidebar";
import PharmacistTopbar from "../../components/PharmacistTopbar";

const PurchaseOrderPage = () => {
  // -------------------- 🧠 State Management --------------------
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    order_code: "",
    supplier_id: "",
    items: [],
  });

  // -------------------- 🔄 Data Fetching --------------------
  const fetchPurchaseOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchase-orders");
      setPurchaseOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error fetching purchase orders:", err);
      setPurchaseOrders([]);
    }
  };

  const fetchSuppliersAndMedicines = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      const [supplierRes, medicineRes] = await Promise.all([
        axios.get("http://localhost:5000/api/pharmacy/suppliers", config),
        axios.get("http://localhost:5000/api/pharmacy/medicines", config),
      ]);

      const supplierData = supplierRes.data.map((s) => ({
        supplier_id: s.supplier_id,
        name: s.name || s.supplier_name || s.supplierName,
      }));

      const medicineData = medicineRes.data.map((m) => ({
        medicine_id: m.medicine_id,
        name: m.name || m.medicine_name || m.medicineName,
      }));

      setSuppliers(supplierData);
      setMedicines(medicineData);
    } catch (err) {
      console.error("❌ Error fetching suppliers or medicines:", err);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliersAndMedicines();
  }, []);

  // -------------------- ✏️ Form Handlers --------------------
  const handleChange = (field, value) => {
    setNewOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = value;
    setNewOrder((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { medicine_id: "", quantity: 1, unit_price: 0 }],
    }));
  };

  // -------------------- 💾 CRUD Operations --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/purchase-orders", newOrder, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      Swal.fire("✅ Success!", "Purchase order created successfully.", "success");
      setIsModalOpen(false);
      setNewOrder({ order_code: "", supplier_id: "", items: [] });
      fetchPurchaseOrders();
    } catch (err) {
      console.error("❌ Error creating purchase order:", err);
      Swal.fire("❌ Error!", "Failed to create purchase order.", "error");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/purchase-orders/${id}/status`,
        { status }
      );
      Swal.fire("✅ Updated!", `Order marked as ${status}.`, "success");
      fetchPurchaseOrders();
    } catch (err) {
      Swal.fire("❌ Error!", "Failed to update status.", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the purchase order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B30000",
      cancelButtonColor: "#2C2C2C",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/purchase-orders/${id}`);
          Swal.fire("🗑️ Deleted!", "Purchase order deleted successfully.", "success");
          fetchPurchaseOrders();
        } catch (err) {
          Swal.fire("❌ Error!", "Failed to delete order.", "error");
        }
      }
    });
  };

  // -------------------- 🎨 UI Layout --------------------
  return (
    <div className="flex">
      {/* Sidebar */}
      <PharmacistSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        <PharmacistTopbar />
        <h1 className="text-2xl font-bold mb-4 text-[#2C2C2C]">
          Medicine Management
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#B30000] hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Purchase Order
        </button>

        {/* Purchase Orders Table */}
        <div className="bg-white mt-6 p-4 rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#B30000] text-white">
                <th className="py-2 px-3 text-left">Order Code</th>
                <th className="py-2 px-3 text-left">Supplier</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Total</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.length > 0 ? (
                purchaseOrders.map((order) => (
                  <tr key={order.order_id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-3">{order.order_code}</td>
                    <td className="py-2 px-3">{order.supplier_name || "N/A"}</td>
                    <td className="py-2 px-3">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">{order.total_amount}</td>
                    <td className="py-2 px-3 font-medium">{order.status}</td>
                    <td className="py-2 px-3 flex justify-center gap-3">
                      {order.status === "Pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.order_id, "Received")
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Mark Received
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(order.order_id)}
                        className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-500"
                  >
                    No purchase orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------- 🪟 Add Purchase Order Modal -------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[700px] shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-[#B30000]"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 text-[#2C2C2C]">
              ➕ Add Purchase Order
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Order Code */}
              <div className="mb-3">
                <label className="block mb-1 font-medium text-[#2C2C2C]">
                  Order Code:
                </label>
                <input
                  type="text"
                  value={newOrder.order_code}
                  onChange={(e) => handleChange("order_code", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* Supplier */}
              <div className="mb-3">
                <label className="block mb-1 font-medium text-[#2C2C2C]">
                  Supplier:
                </label>
                <select
                  value={newOrder.supplier_id}
                  onChange={(e) => handleChange("supplier_id", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.supplier_id} value={s.supplier_id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Section */}
              <div className="mb-3">
                <label className="block mb-1 font-medium text-[#2C2C2C]">
                  Items:
                </label>

                {newOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={item.medicine_id}
                      onChange={(e) =>
                        handleItemChange(index, "medicine_id", e.target.value)
                      }
                      className="flex-1 border px-2 py-1 rounded"
                      required
                    >
                      <option value="">Select Medicine</option>
                      {medicines.map((m) => (
                        <option key={m.medicine_id} value={m.medicine_id}>
                          {m.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-20 border px-2 py-1 rounded"
                      required
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(index, "unit_price", e.target.value)
                      }
                      className="w-24 border px-2 py-1 rounded"
                      required
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItem}
                  className="text-[#B30000] hover:text-red-700 mt-1"
                >
                  + Add Item
                </button>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="bg-[#B30000] text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Save Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderPage;
