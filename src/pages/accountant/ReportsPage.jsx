import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountantSidebar from "../../components/AccountantSidebar";
import Topbar from "../../components/AccTopbar";

const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

export default function ReportsPage() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      // ✅ Fixed endpoint paths
      const [dailyRes, monthlyRes] = await Promise.all([
        axios.get(`${API}/billing/reports/daily`, {
          headers: { Authorization: `Bearer ${token()}` },
        }),
        axios.get(`${API}/billing/reports/monthly`, {
          headers: { Authorization: `Bearer ${token()}` },
        }),
      ]);

      setDaily(dailyRes.data || []);
      setMonthly(monthlyRes.data || []);
    } catch (err) {
      console.error("fetch reports", err);
      alert("Failed to load reports. Please check your backend routes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <AccountantSidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Financial Reports" />
        <div className="p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6">Reports Overview</h1>

          {loading ? (
            <div className="text-gray-600">Loading reports...</div>
          ) : (
            <>
              {/* Daily Report Section */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-[#B30000]">Daily Report</h2>
                {daily.length === 0 ? (
                  <div className="text-gray-500">No daily report data available.</div>
                ) : (
                  <table className="w-full bg-white rounded shadow overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Total Revenue (Rs.)</th>
                        <th className="p-3 text-left">Expenses (Rs.)</th>
                        <th className="p-3 text-left">Profit (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daily.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-3">{row.report_date || row.date}</td>
                          <td className="p-3">{Number(row.total_revenue).toFixed(2)}</td>
                          <td className="p-3">{Number(row.total_expenses).toFixed(2)}</td>
                          <td className="p-3 font-semibold text-green-600">
                            {Number(row.total_revenue - row.total_expenses).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              {/* Monthly Report Section */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-[#B30000]">Monthly Report</h2>
                {monthly.length === 0 ? (
                  <div className="text-gray-500">No monthly report data available.</div>
                ) : (
                  <table className="w-full bg-white rounded shadow overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Month</th>
                        <th className="p-3 text-left">Total Revenue (Rs.)</th>
                        <th className="p-3 text-left">Expenses (Rs.)</th>
                        <th className="p-3 text-left">Profit (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthly.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-3">{row.month_name || row.month}</td>
                          <td className="p-3">{Number(row.total_revenue).toFixed(2)}</td>
                          <td className="p-3">{Number(row.total_expenses).toFixed(2)}</td>
                          <td className="p-3 font-semibold text-green-600">
                            {Number(row.total_revenue - row.total_expenses).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
