import { Link } from "react-router-dom";

const PharmacistSidebar = () => {
  return (
    <div className="w-64 fixed h-screen bg-green-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-10">Pharmacist</h2>

      <ul className="space-y-4">
        <li><Link to="/pharmacist-dashboard">Dashboard</Link></li>
        <li><Link to="/pharmacy/medicine-stock">Medicine Stock</Link></li>
        <li><Link to="/pharmacy/sales">Sales</Link></li>
        <li><Link to="/pharmacy/expiry">Expiry Alerts</Link></li>
        <li><Link to="/pharmacy/orders">Purchase Orders</Link></li>
      </ul>
    </div>
  );
};

export default PharmacistSidebar;
