import React, { useEffect, useState } from "react";
import axios from "axios";

const PharmacyAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/pharmacy/medicines/alerts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Fix: use res.data.data if backend sends { message, data: [...] }
        const alertData = res.data.data || res.data || [];
        setAlerts(alertData);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading alerts...</p>;
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center">
        ⚠️ Low Stock / Expiry Alerts
      </h2>

      {alerts.length === 0 ? (
        <p className="text-gray-500">No low stock or expired medicines found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {alerts.map((med) => (
            <li key={med.medicine_id} className="py-3">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-gray-800">{med.name}</strong>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        med.status === "Expired"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {med.status}
                    </span>{" "}
                    | Stock: {med.quantity_in_stock} / Reorder Level:{" "}
                    {med.reorder_level}
                  </p>
                </div>
                <span className="text-sm text-gray-500 italic">
                  Supplier: {med.supplier_name || "N/A"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PharmacyAlerts;
