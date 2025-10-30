/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PatientManagement from "./pages/admin/PatientManagement";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import MedicalHistory from "./pages/admin/MedicalHistory";
import DoctorsPage from "./pages/admin/DoctorsPage";
import StaffManagement from "./pages/admin/StaffManagement";
import DutyShifts from "./pages/admin/DutyShifts";
import MedicineStock from "./pages/pharmacist/Medicines";
import LowStockAlert from "./pages/pharmacist/LowStockAlert";
import IssueMedicineForm from "./pages/pharmacist/IssueMedicinePage";
import PurchaseOrderPage from "./pages/pharmacist/PurchaseOrderPage";
import ManageSuppliersPage from "./pages/pharmacist/ManageSuppliersPage";
import BillingPage from "./pages/accountant/BillingPage";
import PaymentsPage from "./pages/accountant/PayementsPage";
import ReportsPage from "./pages/accountant/ReportsPage";
import InsuranceClaimsPage from "./pages/accountant/InsuranceClaimsPage";
import DepartmentsPage from "./pages/admin/DepartmentsPage";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/accountant-dashboard" element={<AccountantDashboard />} />
<Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
<Route path="/admin/patients" element={<PatientManagement />} />
 <Route path="/admin/appointments" element={<AppointmentsPage />} />
 <Route path="/admin/patients/:patient_id/history" element={<MedicalHistory />} />
 <Route path="/admin/doctors" element={<DoctorsPage/>} />
 <Route path ="/admin/staff" element={<StaffManagement/>}/> 
 <Route path ="/admin/duty-shifts" element={<DutyShifts/>}/>
<Route path="/pharmacy/medicine-stock" element={<MedicineStock />} />
<Route path="/pharmacy/alerts" element={<LowStockAlert />} />
<Route path="/pharmacy/issue-medicine" element={<IssueMedicineForm />} />
<Route path="/pharmacy/purchase-orders" element={<PurchaseOrderPage />} />
<Route path="pharmacy/manage-suppliers" element={<ManageSuppliersPage />} />
<Route path="/accountant-dashboard" element={<AccountantDashboard />} />
<Route path="/accountant/billing" element={<BillingPage />} />
<Route path="/accountant/payments" element={<PaymentsPage />} />
<Route path="/accountant/reports" element={<ReportsPage />} />
<Route path="/accountant/insurance-claims" element={<InsuranceClaimsPage />} />
<Route path="/admin/departments" element={<DepartmentsPage />} /> 


    </Routes>
  );
}
