import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaListAlt,
  FaPlus,
  FaSearch,
  FaTasks,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaTimes,
} from "react-icons/fa";

const API_URL = "https://enterprise-collaboration-backend.onrender.com";

const initialFormData = {
  taskId: "",
  title: "",
  description: "",
  assignedTo: "",
  department: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(`${API_URL}/api/tasks`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks");
      }

      const fetchedTasks = data.tasks || [];

      setTasks(fetchedTasks);

      if (selectedTask) {
        const updatedSelectedTask = fetchedTasks.find(
          (task) => task._id === selectedTask._id,
        );

        setSelectedTask(updatedSelectedTask || null);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setLoadError(error.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setFormData(initialFormData);
    setFormMessage("");
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);

    setFormData({
      taskId: task.taskId || "",
      title: task.title || "",
      description: task.description || "",
      assignedTo: task.assignedTo || "",
      department: task.department || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    });

    setFormMessage("");
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormMessage("");
    setFormData(initialFormData);
  };

  const handleSubmitTask = async (event) => {
    event.preventDefault();

    setFormLoading(true);
    setFormMessage("");

    try {
      const url = editingTask
        ? `${API_URL}/api/tasks/${editingTask._id}`
        : `${API_URL}/api/tasks`;

      const method = editingTask ? "PUT" : "POST";

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
            (editingTask ? "Failed to update task" : "Failed to create task"),
        );
      }

      await fetchTasks();

      setFormData(initialFormData);
      setEditingTask(null);
      setShowForm(false);
      setFormMessage("");
    } catch (error) {
      console.error("Task save error:", error);
      setFormMessage(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) {
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/tasks/${deletingTask._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task");
      }

      if (selectedTask?._id === deletingTask._id) {
        setSelectedTask(null);
      }

      setDeletingTask(null);

      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    if (task.status === newStatus) {
      return;
    }

    setStatusLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: task.taskId,
          title: task.title,
          description: task.description || "",
          assignedTo: task.assignedTo,
          department: task.department,
          priority: task.priority || "Medium",
          status: newStatus,
          dueDate: task.dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task status");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert(error.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") {
      return "bg-red-100 text-red-700";
    }

    if (priority === "Low") {
      return "bg-gray-100 text-gray-600";
    }

    return "bg-orange-100 text-orange-700";
  };

  const getStatusIcon = (status) => {
    if (status === "Completed") {
      return <FaCheckCircle />;
    }

    if (status === "In Progress") {
      return <FaClock />;
    }

    return <FaExclamationTriangle />;
  };

  const formatDate = (date) => {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === "Completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(23, 59, 59, 999);

    return dueDate < new Date();
  };

  const filteredTasks = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        String(task.taskId || "")
          .toLowerCase()
          .includes(search) ||
        String(task.title || "")
          .toLowerCase()
          .includes(search) ||
        String(task.description || "")
          .toLowerCase()
          .includes(search) ||
        String(task.assignedTo || "")
          .toLowerCase()
          .includes(search) ||
        String(task.department || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaTasks />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>

              <p className="mt-1 text-sm text-gray-500">
                Create, assign and manage organizational tasks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <FaPlus />
            Add Task
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                {totalTasks}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaListAlt />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {pendingTasks}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
              <FaExclamationTriangle />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {inProgressTasks}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaClock />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {completedTasks}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FaCheckCircle />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by task ID, title, employee or department..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="All">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredTasks.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">{tasks.length}</span>{" "}
            tasks
          </span>

          {(searchTerm ||
            statusFilter !== "All" ||
            priorityFilter !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <FaSyncAlt className="mx-auto animate-spin text-2xl text-blue-600" />

          <p className="mt-3 text-gray-500">Loading tasks...</p>
        </div>
      )}

      {!loading && loadError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">Unable to load tasks</p>

          <p className="mt-1 text-sm text-red-600">{loadError}</p>

          <button
            onClick={fetchTasks}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Task Area */}
      {!loading && !loadError && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <FaTasks className="text-xl" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-700">
                  No tasks found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters, or create a new task.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    selectedTask?._id === task._id
                      ? "border-blue-400 ring-2 ring-blue-100"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                          {task.taskId}
                        </span>

                        <span
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                            task.priority,
                          )}`}
                        >
                          {task.priority || "Medium"}
                        </span>

                        {isOverdue(task) && (
                          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            <FaExclamationTriangle />
                            Overdue
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 truncate text-lg font-semibold text-gray-800">
                        {task.title}
                      </h2>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    <span
                      className={`flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                        task.status,
                      )}`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaUser className="text-gray-400" />

                      <div>
                        <p className="text-xs text-gray-400">Assigned To</p>
                        <p className="font-medium text-gray-700">
                          {task.assignedTo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaBuilding className="text-gray-400" />

                      <div>
                        <p className="text-xs text-gray-400">Department</p>
                        <p className="font-medium text-gray-700">
                          {task.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-gray-400" />

                      <div>
                        <p className="text-xs text-gray-400">Due Date</p>
                        <p
                          className={`font-medium ${
                            isOverdue(task) ? "text-red-600" : "text-gray-700"
                          }`}
                        >
                          {formatDate(task.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEditTask(task);
                      }}
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeletingTask(task);
                      }}
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Task Details */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            {selectedTask ? (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Task Details
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-gray-800">
                        {selectedTask.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {selectedTask.taskId}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedTask(null)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                        selectedTask.status,
                      )}`}
                    >
                      {selectedTask.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getPriorityClass(
                        selectedTask.priority,
                      )}`}
                    >
                      {selectedTask.priority || "Medium"} Priority
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {selectedTask.description || "No description provided."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FaUser />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Assigned To</p>
                        <p className="text-sm font-medium text-gray-700">
                          {selectedTask.assignedTo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                        <FaBuilding />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Department</p>
                        <p className="text-sm font-medium text-gray-700">
                          {selectedTask.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <FaCalendarAlt />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Due Date</p>
                        <p
                          className={`text-sm font-medium ${
                            isOverdue(selectedTask)
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {formatDate(selectedTask.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Status */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Update Status
                    </p>

                    <select
                      value={selectedTask.status}
                      disabled={statusLoading}
                      onChange={(event) =>
                        handleStatusChange(selectedTask, event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:opacity-60"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEditTask(selectedTask)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeletingTask(selectedTask)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FaTasks className="text-xl" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-700">
                  Select a task
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Select a task from the list to view its complete details and
                  update its status.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingTask ? "Edit Task" : "Create New Task"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingTask
                    ? "Update the task information below."
                    : "Enter the details for the new organizational task."}
                </p>
              </div>

              <button
                onClick={handleCancelForm}
                disabled={formLoading}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Task ID
                  </label>

                  <input
                    type="text"
                    name="taskId"
                    value={formData.taskId}
                    onChange={handleInputChange}
                    placeholder="e.g. TASK001"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Task Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Complete project documentation"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the task..."
                  rows="3"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Assigned To
                  </label>

                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    placeholder="e.g. Ajay Kumar"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

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

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              {formMessage && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formMessage}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
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
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formLoading
                    ? editingTask
                      ? "Updating..."
                      : "Creating..."
                    : editingTask
                      ? "Update Task"
                      : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <FaTrash />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Delete Task
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingTask.title}
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-gray-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingTask(null)}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTask}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
