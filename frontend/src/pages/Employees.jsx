import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiUsers,
  FiSearch,
  FiX,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiMail,
  FiBriefcase,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

const initialFormData = {
  employeeId: "",
  name: "",
  email: "",
  department: "",
  position: "",
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(`${API_URL}/api/employees`);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      const employeeList = data.employees || [];

      setEmployees(employeeList);

      if (selectedEmployee) {
        const updatedEmployee = employeeList.find(
          (employee) => employee._id === selectedEmployee._id,
        );

        setSelectedEmployee(updatedEmployee || null);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoadError(error.message || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Input handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Open create form
  const openCreateForm = () => {
    setEditingEmployee(null);
    setFormData(initialFormData);
    setFormMessage("");
    setShowForm(true);
  };

  // Open edit form
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);

    setFormData({
      employeeId: employee.employeeId || "",
      name: employee.name || "",
      email: employee.email || "",
      department: employee.department || "",
      position: employee.position || "",
    });

    setFormMessage("");
    setShowForm(true);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setFormData(initialFormData);
    setFormMessage("");
  };

  // Add / Update Employee
  const handleSubmitEmployee = async (event) => {
    event.preventDefault();

    setFormLoading(true);
    setFormMessage("");

    try {
      const url = editingEmployee
        ? `${API_URL}/api/employees/${editingEmployee._id}`
        : `${API_URL}/api/employees`;

      const method = editingEmployee ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingEmployee
              ? "Failed to update employee"
              : "Failed to add employee"),
        );
      }

      await fetchEmployees();

      if (editingEmployee && selectedEmployee?._id === editingEmployee._id) {
        setSelectedEmployee(data.employee);
      }

      setShowForm(false);
      setEditingEmployee(null);
      setFormData(initialFormData);
      setFormMessage("");
    } catch (error) {
      console.error("Employee save error:", error);
      setFormMessage(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete employee
  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) {
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/employees/${deletingEmployee._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete employee");
      }

      if (selectedEmployee?._id === deletingEmployee._id) {
        setSelectedEmployee(null);
      }

      setDeletingEmployee(null);

      await fetchEmployees();
    } catch (error) {
      console.error("Delete employee error:", error);
      alert(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Departments
  const departments = useMemo(() => {
    return [
      ...new Set(
        employees.map((employee) => employee.department).filter(Boolean),
      ),
    ].sort();
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !searchText ||
        String(employee.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(employee.employeeId || "")
          .toLowerCase()
          .includes(searchText) ||
        String(employee.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(employee.department || "")
          .toLowerCase()
          .includes(searchText) ||
        String(employee.position || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        String(employee.status || "") === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" || employee.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, search, statusFilter, departmentFilter]);

  // Statistics
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => String(employee.status || "").toLowerCase() === "active",
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => String(employee.status || "").toLowerCase() !== "active",
  ).length;

  const departmentCount = departments.length;

  // Initials
  const getInitials = (name) => {
    if (!name) {
      return "?";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Status style
  const getStatusClass = (status) => {
    if (String(status || "").toLowerCase() === "active") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Workforce Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-800">Employees</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage employee records, departments and organizational roles.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchEmployees}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus />
            Add Employee
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Employees
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-800">
                {totalEmployees}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FiUsers size={21} />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Employees
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {activeEmployees}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FiCheckCircle size={21} />
            </div>
          </div>
        </div>

        {/* Other Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Other Status</p>

              <p className="mt-2 text-3xl font-bold text-gray-600">
                {inactiveEmployees}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <FiUser size={21} />
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Departments</p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {departmentCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <FiBriefcase size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_190px_220px]">
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search by name, ID, email, department or position..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="All">All Departments</option>

            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredEmployees.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {employees.length}
            </span>{" "}
            employees
          </span>

          {(search || statusFilter !== "All" || departmentFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setDepartmentFilter("All");
              }}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {!loading && loadError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-700">Unable to load employees</p>

          <p className="mt-1 text-sm text-red-600">{loadError}</p>

          <button
            onClick={fetchEmployees}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loadError && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          {/* Employee Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-10 text-center">
                <FiRefreshCw className="mx-auto animate-spin text-2xl text-blue-600" />

                <p className="mt-3 text-sm text-gray-500">
                  Loading employees...
                </p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <FiUsers size={22} />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-700">
                  No employees found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters, or add a new employee.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Employee
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Department
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Position
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((employee) => (
                      <tr
                        key={employee._id}
                        onClick={() => setSelectedEmployee(employee)}
                        className={`cursor-pointer transition hover:bg-gray-50 ${
                          selectedEmployee?._id === employee._id
                            ? "bg-blue-50/50"
                            : ""
                        }`}
                      >
                        {/* Employee */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                              {getInitials(employee.name)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-800">
                                {employee.name}
                              </p>

                              <p className="text-xs text-gray-400">
                                {employee.employeeId}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-gray-500">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {employee.department}
                        </td>

                        {/* Position */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {employee.position}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              employee.status,
                            )}`}
                          >
                            {employee.status || "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          className="px-5 py-4"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditEmployee(employee)}
                              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                              title="Edit employee"
                            >
                              <FiEdit2 size={16} />
                            </button>

                            <button
                              onClick={() => setDeletingEmployee(employee)}
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                              title="Delete employee"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Employee Details */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            {selectedEmployee ? (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Detail Header */}
                <div className="border-b border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                        {getInitials(selectedEmployee.name)}
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {selectedEmployee.name}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {selectedEmployee.employeeId}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEmployee(null)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>

                {/* Detail Body */}
                <div className="space-y-5 p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                        selectedEmployee.status,
                      )}`}
                    >
                      {selectedEmployee.status || "Active"}
                    </span>

                    <span className="text-xs text-gray-400">
                      Employee Record
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FiMail />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Email</p>

                        <p className="truncate text-sm font-medium text-gray-700">
                          {selectedEmployee.email}
                        </p>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                        <FiBriefcase />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Department</p>

                        <p className="text-sm font-medium text-gray-700">
                          {selectedEmployee.department}
                        </p>
                      </div>
                    </div>

                    {/* Position */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                        <FiUser />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Position</p>

                        <p className="text-sm font-medium text-gray-700">
                          {selectedEmployee.position}
                        </p>
                      </div>
                    </div>

                    {/* Employee ID */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <FiUsers />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Employee ID</p>

                        <p className="text-sm font-medium text-gray-700">
                          {selectedEmployee.employeeId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                    <button
                      onClick={() => handleEditEmployee(selectedEmployee)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      <FiEdit2 />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeletingEmployee(selectedEmployee)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FiUsers size={22} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-700">
                  Select an employee
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Select an employee from the table to view their complete
                  profile.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingEmployee ? "Edit Employee" : "Add New Employee"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingEmployee
                    ? "Update the employee information below."
                    : "Enter the employee details below."}
                </p>
              </div>

              <button
                onClick={handleCancelForm}
                disabled={formLoading}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEmployee} className="space-y-5 p-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Employee ID */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>

                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="e.g. EMP002"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter employee name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="employee@example.com"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Engineering"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Developer"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Message */}
              {formMessage && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formMessage}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  disabled={formLoading}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formLoading && <FiRefreshCw className="animate-spin" />}

                  {formLoading
                    ? editingEmployee
                      ? "Updating..."
                      : "Adding..."
                    : editingEmployee
                      ? "Update Employee"
                      : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <FiTrash2 size={20} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Delete Employee
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingEmployee.name}
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-gray-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingEmployee(null)}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteEmployee}
                disabled={deleteLoading}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading && <FiRefreshCw className="animate-spin" />}

                {deleteLoading ? "Deleting..." : "Delete Employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
