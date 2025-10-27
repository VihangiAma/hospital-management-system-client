import { Link } from "react-router-dom";

const AccountantSidebar = () => {
  return (
    <div className="w-64 fixed h-screen bg-blue-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-10">Accountant</h2>

      <ul className="space-y-4">
        <li><Link to="/accountant-dashboard">Dashboard</Link></li>
        <li><Link to="/accountant/billing">Billing & Payments</Link></li>
        <li><Link to="/accountant/reports">Financial Reports</Link></li>
        <li><Link to="/accountant/expenses">Expenses Management</Link></li>
      </ul>
    </div>
  );
};

export default AccountantSidebar;
