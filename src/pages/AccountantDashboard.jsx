import Sidebar from "../components/AccountantSidebar";
import Topbar from "../components/AccTopbar";

const AccountantDashboard = () => {
  return (
    <div className="flex">
      <Sidebar role="Accountant" />
      <div className="flex-1 ml-64">
        <Topbar title="Accountant Dashboard" />

        <div className="p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6">Finance Overview</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2">Rs. 2.5M</p>
            </div>

            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Pending Payments</h3>
              <p className="text-3xl font-bold mt-2">Rs. 150K</p>
            </div>

            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Expenses This Month</h3>
              <p className="text-3xl font-bold mt-2">Rs. 450K</p>
            </div>
          </div>

          {/* Add Accountant Features */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button className="bg-blue-600 text-white p-4 rounded shadow hover:bg-blue-700">
                Generate Invoice
              </button>
              <button className="bg-green-600 text-white p-4 rounded shadow hover:bg-green-700">
                Manage Payments
              </button>
              <button className="bg-yellow-600 text-white p-4 rounded shadow hover:bg-yellow-700">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
