
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 fixed">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-4">
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Dashboard</li>
        <li>
  <Link to="/admin/patients" className="flex items-center p-3 hover:bg-gray-200">
    👤 <span className="ml-2">Patient Management</span>
  </Link>
</li>
        <li>
  <Link to="/admin/doctors" className="flex items-center p-3 hover:bg-gray-200">
    🩺 <span className="ml-2">Doctor Management</span>
  </Link>
</li>

<li>
  <Link to="/admin/staff" className="flex items-center p-3 hover:bg-gray-200">
    🧑‍💼 <span className="ml-2">Staff Management</span>
  </Link>
</li>

        <li>
        <Link to="/admin/appointments" className="flex items-center p-3 hover:bg-gray-200">
  📅 <span className="ml-2">Appointments</span>
</Link>
</li>
<li>
          <Link to="/admin/duty-shifts" className="flex items-center p-3 hover:bg-gray-200">
            🕒 <span className="ml-2">Duty Shifts</span>
          </Link>
        </li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
