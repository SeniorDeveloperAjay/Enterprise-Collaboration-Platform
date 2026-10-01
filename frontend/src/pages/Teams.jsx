import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiUsers,
  FiSearch,
  FiX,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiBriefcase,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiLayers,
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

const initialFormData = {
  teamId: "",
  name: "",
  department: "",
  description: "",
  leader: "",
};

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [editingTeam, setEditingTeam] = useState(null);

  const [deletingTeam, setDeletingTeam] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState(null);

  // Fetch teams
  const fetchTeams = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch(`${API_URL}/api/teams`);

      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }

      const data = await response.json();

      setTeams(data.teams || []);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setLoadError(error.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Open create form
  const handleOpenCreateForm = () => {
    setEditingTeam(null);
    setFormData(initialFormData);
    setFormMessage("");
    setShowForm(true);
  };

  // Open edit form
  const handleEditTeam = (team) => {
    setEditingTeam(team);

    setFormData({
      teamId: team.teamId || "",
      name: team.name || "",
      department: team.department || "",
      description: team.description || "",
      leader: team.leader || "",
    });

    setFormMessage("");
    setShowForm(true);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTeam(null);
    setFormMessage("");
    setFormData(initialFormData);
  };

  // Add / update team
  const handleSubmitTeam = async (event) => {
    event.preventDefault();

    setFormLoading(true);
    setFormMessage("");

    try {
      const url = editingTeam
        ? `${API_URL}/api/teams/${editingTeam._id}`
        : `${API_URL}/api/teams`;

      const method = editingTeam ? "PUT" : "POST";

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
            (editingTeam ? "Failed to update team" : "Failed to create team"),
        );
      }

      setFormMessage(
        editingTeam
          ? "Team updated successfully!"
          : "Team created successfully!",
      );

      await fetchTeams();

      setTimeout(() => {
        setShowForm(false);
        setEditingTeam(null);
        setFormMessage("");
        setFormData(initialFormData);
      }, 700);
    } catch (error) {
      setFormMessage(error.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete team
  const handleDeleteTeam = async () => {
    if (!deletingTeam) {
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/teams/${deletingTeam._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete team");
      }

      setTeams((previous) =>
        previous.filter((team) => team._id !== deletingTeam._id),
      );

      if (selectedTeam?._id === deletingTeam._id) {
        setSelectedTeam(null);
      }

      setDeletingTeam(null);
    } catch (error) {
      console.error("Failed to delete team:", error);
      alert(error.message || "Failed to delete team");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Department options
  const departments = useMemo(() => {
    const values = teams.map((team) => team.department).filter(Boolean);

    return ["All", ...new Set(values)];
  }, [teams]);

  // Filter teams
  const filteredTeams = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return teams.filter((team) => {
      const matchesSearch =
        !searchValue ||
        `${team.teamId || ""} ${team.name || ""} ${
          team.department || ""
        } ${team.leader || ""} ${team.description || ""}`
          .toLowerCase()
          .includes(searchValue);

      const teamStatus = team.status || "Active";

      const matchesDepartment =
        departmentFilter === "All" || team.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || teamStatus === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [teams, search, departmentFilter, statusFilter]);

  // Statistics
  const totalTeams = teams.length;

  const activeTeams = teams.filter(
    (team) => (team.status || "Active") === "Active",
  ).length;

  const inactiveTeams = teams.filter(
    (team) => (team.status || "Active") !== "Active",
  ).length;

  const totalDepartments = new Set(
    teams.map((team) => team.department).filter(Boolean),
  ).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Organization Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800">Teams</h1>

          <p className="mt-1 text-slate-500">
            Create, organize and manage teams across the organization.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchTeams}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={handleOpenCreateForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus size={18} />
            Add Team
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Teams</p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {totalTeams}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FiUsers size={22} />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Teams</p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {activeTeams}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <FiCheckCircle size={22} />
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Other Status</p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {inactiveTeams}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <FiClock size={22} />
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Departments</p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {totalDepartments}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <FiLayers size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {editingTeam ? "Edit Team" : "Create New Team"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingTeam
                  ? "Update the team information below."
                  : "Enter the details for the new team."}
              </p>
            </div>

            <button
              onClick={handleCancelForm}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmitTeam}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Team ID */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Team ID
              </label>

              <input
                type="text"
                name="teamId"
                value={formData.teamId}
                onChange={handleInputChange}
                placeholder="e.g. TEAM001"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Team Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Team Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Development Team"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Department */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g. Engineering"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Leader */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Team Leader
              </label>

              <input
                type="text"
                name="leader"
                value={formData.leader}
                onChange={handleInputChange}
                placeholder="e.g. Ajay Kumar"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the team's responsibilities..."
                rows="4"
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Message */}
            {formMessage && (
              <div
                className={`rounded-lg px-4 py-3 text-sm md:col-span-2 ${
                  formMessage.toLowerCase().includes("success")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {formMessage}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-1 md:col-span-2">
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={formLoading}
                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={formLoading}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formLoading
                  ? editingTeam
                    ? "Updating Team..."
                    : "Creating Team..."
                  : editingTeam
                    ? "Update Team"
                    : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search teams, leaders, departments..."
              className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <FiBriefcase
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-3 pl-9 pr-8 text-sm outline-none transition focus:border-blue-500 sm:min-w-44"
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department === "All" ? "All Departments" : department}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FiFilter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-3 pl-9 pr-8 text-sm outline-none transition focus:border-blue-500 sm:min-w-40"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredTeams.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">{teams.length}</span>{" "}
            teams
          </p>

          {(search || departmentFilter !== "All" || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setDepartmentFilter("All");
                setStatusFilter("All");
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Unable to load teams</p>
          <p className="mt-1">{loadError}</p>

          <button onClick={fetchTeams} className="mt-3 font-semibold underline">
            Try again
          </button>
        </div>
      )}

      {/* Teams */}
      <div>
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <FiRefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={28}
            />

            <p className="mt-3 text-slate-500">Loading teams...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FiUsers size={25} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-700">
              No teams found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {teams.length === 0
                ? "Create your first team using the Add Team button."
                : "Try changing your search or filter settings."}
            </p>

            {teams.length === 0 && (
              <button
                onClick={handleOpenCreateForm}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Create First Team
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredTeams.map((team) => {
              const status = team.status || "Active";

              return (
                <div
                  key={team._id}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <FiUsers size={22} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-slate-800">
                          {team.name}
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-400">
                          {team.teamId}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Team Details */}
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <FiBriefcase size={14} />
                        Department
                      </div>

                      <p className="mt-1 font-semibold text-slate-700">
                        {team.department}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <FiUser size={14} />
                        Team Leader
                      </div>

                      <p className="mt-1 font-semibold text-slate-700">
                        {team.leader}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Description
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                      {team.description || "No description provided."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setSelectedTeam(team)}
                      className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                    >
                      View Details
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        <FiEdit2 size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeletingTeam(team)}
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <FiTrash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FiUsers size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {selectedTeam.name}
                  </h2>

                  <p className="text-sm text-slate-400">
                    {selectedTeam.teamId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTeam(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    (selectedTeam.status || "Active") === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedTeam.status || "Active"}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {selectedTeam.department}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Team Leader
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {selectedTeam.leader}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedTeam.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 p-6">
              <button
                onClick={() => setSelectedTeam(null)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedTeam(null);
                  handleEditTeam(selectedTeam);
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                <FiEdit2 size={16} />
                Edit Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <FiTrash2 size={22} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              Delete Team
            </h2>

            <p className="mt-2 leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deletingTeam.name}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingTeam(null)}
                disabled={deleteLoading}
                className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTeam}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete Team"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;
