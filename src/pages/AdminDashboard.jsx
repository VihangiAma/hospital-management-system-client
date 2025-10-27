import Sidebar from "../components/AdminSidebar";
import Topbar from "../components/Topbar";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        {/* Main Content */}
        <div className="p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Total Patients</h3>
              <p className="text-3xl font-bold mt-2">120</p>
            </div>

            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Doctors</h3>
              <p className="text-3xl font-bold mt-2">25</p>
            </div>

            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Staff</h3>
              <p className="text-3xl font-bold mt-2">40</p>
            </div>

            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-lg font-semibold">Today Appointments</h3>
              <p className="text-3xl font-bold mt-2">18</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
