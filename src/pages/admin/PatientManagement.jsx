import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import Topbar from "../../components/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PatientManagement = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    patient_code: "",
    first_name: "",
    last_name: "",
    gender: "Male",
    age: "",
    contact_number: "",
    address: "",
    email: "",
    status: "Active",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  // Auto-generate patient code
  const generatePatientCode = () => {
    let number = patients.length + 1;
    return `PAT-${String(number).padStart(4, "0")}`;
  };

  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      patient_code: generatePatientCode(),
      first_name: "",
      last_name: "",
      gender: "Male",
      age: "",
      contact_number: "",
      address: "",
      email: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleEdit = (patient) => {
    setEditMode(true);
    setFormData(patient);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the patient record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B30000",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 || res.status === 204) {
          Swal.fire("Deleted!", "The patient has been removed.", "success");
          fetchPatients();
        } else {
          Swal.fire("Error", "Failed to delete patient.", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Something went wrong while deleting.", "error");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5000/api/patients/${formData.patient_id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Updated!", "Patient record has been updated.", "success");
      } else {
        await axios.post("http://localhost:5000/api/patients", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Added!", "New patient has been added successfully.", "success");
      }

      setShowModal(false);
      fetchPatients();
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire("Error", "Failed to save patient record.", "error");
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? p.status === statusFilter : true)
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        <div className="p-6 mt-16">
          <h1 className="text-2xl font-bold mb-4">Patient Management</h1>

          {/* Search + Filter + Add */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="border p-2 rounded w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Patient
            </button>
          </div>

          {/* Patient Table */}
          <table className="w-full border-collapse shadow-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Gender</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.patient_id} className="text-center border">
                  <td className="p-2 border">{p.patient_code}</td>
                  <td className="p-2 border">
                    {p.first_name} {p.last_name}
                  </td>
                  <td className="p-2 border">{p.gender}</td>
                  <td className="p-2 border">{p.age}</td>
                  <td className="p-2 border">{p.contact_number}</td>
                  <td className="p-2 border">{p.email}</td>
                  <td className="p-2 border">{p.address}</td>
                  <td className="p-2 border">{p.status}</td>
                  <td className="p-2 border flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 px-3 py-1 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.patient_id)}
                      className="bg-red-600 px-3 py-1 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/patients/${p.patient_id}/history`)
                      }
                      className="bg-purple-600 px-3 py-1 text-white rounded hover:bg-purple-700"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal Add/Edit */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-1/2">
                <h2 className="text-xl font-bold mb-3">
                  {editMode ? "Edit Patient" : "Add Patient"}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="border p-2"
                    value={formData.patient_code}
                    disabled
                  />
                  <input
                    className="border p-2"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                  />
                  <input
                    className="border p-2"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                  />

                  <select
                    className="border p-2"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <input
                    className="border p-2"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                  <input
                    className="border p-2"
                    placeholder="Contact Number"
                    value={formData.contact_number}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_number: e.target.value })
                    }
                  />
                  <input
                    className="border p-2"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <input
                    className="border p-2 col-span-2"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />

                  <select
                    className="border p-2"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editMode ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
