import { Link } from "react-router-dom";

const PharmacistSidebar = () => {
  return (
    <div className="w-64 bg-green-900 text-white h-screen p-4 fixed">
      <h2 className="text-2xl font-bold mb-8 text-center border-b border-green-700 pb-3">
        Pharmacist Panel
      </h2>

      <ul className="space-y-3">
        <li>
          <Link
            to="/pharmacist-dashboard"
            className="flex items-center p-3 hover:bg-green-800 rounded cursor-pointer"
          >
            📊 <span className="ml-2">Dashboard</span>
          </Link>
        </li>

        <li>
          <Link
            to="/pharmacy/medicine-stock"
            className="flex items-center p-3 hover:bg-green-800 rounded cursor-pointer"
          >
            💊 <span className="ml-2">Medicine Stock</span>
          </Link>
        </li>

        <li>
  <Link to="/pharmacy/issue-medicine" className="flex items-center p-3 hover:bg-green-800 rounded cursor-pointer">
    🧾 <span className="ml-2">Issue Medicines</span>
  </Link>
</li>


        <li>
          <Link
            to="/pharmacy/purchase-orders"
            className="flex items-center p-3 hover:bg-green-800 rounded cursor-pointer"
          >
            📦 <span className="ml-2">Purchase Orders</span>
          </Link>
        </li>

        <li>
          <Link
            to="/pharmacy/manage-suppliers"
            className="flex items-center p-3 hover:bg-green-800 rounded cursor-pointer"
          >
            🏢 <span className="ml-2">Suppliers</span>
          </Link>
        </li>

        <hr className="border-green-700 my-3" />

        {/* ✅ Alert Section */}
        <li>
          <Link
            to="/pharmacy/alerts"
            className="flex items-center p-3 bg-red-700 hover:bg-red-800 rounded cursor-pointer transition-all duration-200"
          >
            ⚠️ <span className="ml-2 font-semibold">Low Stock & Expiry Alerts</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PharmacistSidebar;
