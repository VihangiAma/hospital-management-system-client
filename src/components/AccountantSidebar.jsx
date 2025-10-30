import { Link } from "react-router-dom";

const AccountantSidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white h-screen p-4 fixed">
      <h2 className="text-2xl font-bold mb-6">Accountant Panel</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/accountant-dashboard" className="flex items-center p-3 hover:bg-blue-800 rounded-lg transition">
            📊 <span className="ml-2">Dashboard</span>
          </Link>
        </li>

        <li>
          <Link to="/accountant/billing" className="flex items-center p-3 hover:bg-blue-800 rounded-lg transition">
            💳 <span className="ml-2">Billing</span>
          </Link>
        </li>

        <li>
          <Link to="/accountant/payments" className="flex items-center p-3 hover:bg-blue-800 rounded-lg transition">
            💵 <span className="ml-2">Payments</span>
          </Link>
        </li>

        <li>
          <Link to="/accountant/reports" className="flex items-center p-3 hover:bg-blue-800 rounded-lg transition">
            📈 <span className="ml-2">Reports</span>
          </Link>
        </li>
       <li>
          <Link
            to="/accountant/insurance-claims"
            className="flex items-center p-3 hover:bg-blue-800 rounded-lg transition"
          >
            🧾 <span className="ml-2">Insurance Claims</span>
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default AccountantSidebar;
