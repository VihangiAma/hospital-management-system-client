import Sidebar from "../components/PharmacistSidebar";
import Topbar from "../components/PharmacistTopbar";

const PharmacistDashboard = () => {
  return (
    <div className="flex">
      <Sidebar role="Pharmacist" />
      <div className="flex-1 ml-64">
        <Topbar title="Pharmacist Dashboard" />

        <div className="p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6">Pharmacy Overview</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Total Medicines</h3>
              <p className="text-3xl font-bold mt-2">350</p>
            </div>

            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
              <p className="text-3xl font-bold mt-2 text-red-600">12</p>
            </div>

            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Expired Medicines</h3>
              <p className="text-3xl font-bold mt-2 text-orange-600">7</p>
            </div>

            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Orders Pending</h3>
              <p className="text-3xl font-bold mt-2">5</p>
            </div>
          </div>

          {/* Pharmacist Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <button className="bg-blue-600 text-white p-4 rounded shadow hover:bg-blue-700">
                Manage Stock
              </button>
              <button className="bg-purple-600 text-white p-4 rounded shadow hover:bg-purple-700">
                Add New Medicine
              </button>
              <button className="bg-teal-600 text-white p-4 rounded shadow hover:bg-teal-700">
                Issue Medicines
              </button>
              <button className="bg-orange-600 text-white p-4 rounded shadow hover:bg-orange-700">
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
