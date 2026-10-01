import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaBellSlash,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaSyncAlt,
  FaUser,
  FaTag,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

const API_URL = "https://enterprise-collaboration-backend.onrender.com";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [formData, setFormData] = useState({
    notificationId: "",
    recipient: "",
    title: "",
    message: "",
    type: "General",
    status: "Unread",
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [statusLoading, setStatusLoading] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(`${API_URL}/api/notifications`);

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      const notificationList = data.notifications || [];

      setNotifications(notificationList);

      setSelectedNotification((currentSelected) => {
        if (!currentSelected) {
          return notificationList.length > 0 ? notificationList[0] : null;
        }

        const updatedNotification = notificationList.find(
          (notification) => notification._id === currentSelected._id,
        );

        return (
          updatedNotification ||
          (notificationList.length > 0 ? notificationList[0] : null)
        );
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);

      setLoadError("Unable to load notifications. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const totalNotifications = notifications.length;

  const unreadNotifications = notifications.filter(
    (notification) =>
      String(notification.status || "").toLowerCase() === "unread",
  ).length;

  const readNotifications = notifications.filter(
    (notification) =>
      String(notification.status || "").toLowerCase() === "read",
  ).length;

  const filteredNotifications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesStatus =
        statusFilter === "All" ||
        String(notification.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "All" ||
        String(notification.type || "").toLowerCase() ===
          typeFilter.toLowerCase();

      const searchableText = [
        notification.notificationId,
        notification.recipient,
        notification.title,
        notification.message,
        notification.type,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = search === "" || searchableText.includes(search);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [notifications, searchTerm, statusFilter, typeFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      notificationId: "",
      recipient: "",
      title: "",
      message: "",
      type: "General",
      status: "Unread",
    });

    setEditingId(null);
    setFormMessage("");
  };

  const handleAddNotification = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (notification) => {
    setFormData({
      notificationId: notification.notificationId || "",
      recipient: notification.recipient || "",
      title: notification.title || "",
      message: notification.message || "",
      type: notification.type || "General",
      status: notification.status || "Unread",
    });

    setEditingId(notification._id);
    setFormMessage("");
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setFormLoading(true);
      setFormMessage("");

      const url = editingId
        ? `${API_URL}/api/notifications/${editingId}`
        : `${API_URL}/api/notifications`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save notification");
      }

      setFormMessage(
        editingId
          ? "Notification updated successfully."
          : "Notification created successfully.",
      );

      await fetchNotifications();

      setTimeout(() => {
        resetForm();
        setShowForm(false);
      }, 700);
    } catch (error) {
      console.error("Failed to save notification:", error);

      setFormMessage(error.message || "Failed to save notification.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (notification) => {
    try {
      setStatusLoading(notification._id);

      const updatedNotification = {
        notificationId: notification.notificationId,
        recipient: notification.recipient,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status:
          String(notification.status || "").toLowerCase() === "read"
            ? "Unread"
            : "Read",
      };

      const response = await fetch(
        `${API_URL}/api/notifications/${notification._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNotification),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update notification");
      }

      await fetchNotifications();
    } catch (error) {
      console.error("Failed to update notification status:", error);

      alert("Unable to update notification status.");
    } finally {
      setStatusLoading(null);
    }
  };

  const handleDeleteClick = (notification) => {
    setNotificationToDelete(notification);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!notificationToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await fetch(
        `${API_URL}/api/notifications/${notificationToDelete._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete notification");
      }

      if (selectedNotification?._id === notificationToDelete._id) {
        setSelectedNotification(null);
      }

      setShowDeleteModal(false);
      setNotificationToDelete(null);

      await fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);

      alert("Failed to delete notification.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "No date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "No date";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "task":
        return <FaCheckCircle />;

      case "message":
        return <FaBell />;

      case "system":
        return <FaExclamationCircle />;

      case "announcement":
        return <FaInfoCircle />;

      default:
        return <FaBell />;
    }
  };

  const getTypeStyle = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "task":
        return "bg-blue-50 text-blue-600";

      case "message":
        return "bg-purple-50 text-purple-600";

      case "system":
        return "bg-red-50 text-red-600";

      case "announcement":
        return "bg-orange-50 text-orange-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const isUnread = (notification) =>
    String(notification?.status || "").toLowerCase() === "unread";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage employee notifications, alerts and system updates.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchNotifications}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button
            onClick={handleAddNotification}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <FaPlus />
            New Notification
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Notifications
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalNotifications}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <FaBell className="text-xl" />
            </div>
          </div>
        </div>

        {/* Unread */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Unread</p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                {unreadNotifications}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <FaBellSlash className="text-xl" />
            </div>
          </div>
        </div>

        {/* Read */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Read</p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {readNotifications}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <FaCheckCircle className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <FaFilter className="text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Status</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Types</option>
              <option value="General">General</option>
              <option value="Task">Task</option>
              <option value="Message">Message</option>
              <option value="System">System</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {loadError}
        </div>
      )}

      {/* Notification Workspace */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.85fr)]">
        {/* Notification List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-800">
                  Notification Center
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <FaBell className="text-lg text-blue-500" />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

                <p className="text-sm text-slate-500">
                  Loading notifications...
                </p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <FaBell className="text-xl" />
                </div>

                <h3 className="font-semibold text-slate-700">
                  No notifications found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-h-[650px] overflow-y-auto">
              {filteredNotifications.map((notification) => {
                const unread = isUnread(notification);
                const selected = selectedNotification?._id === notification._id;

                return (
                  <button
                    key={notification._id}
                    onClick={() => setSelectedNotification(notification)}
                    className={`w-full border-b border-slate-100 p-5 text-left transition last:border-b-0 ${
                      selected ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          unread
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {getTypeIcon(notification.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {unread && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600"></span>
                              )}

                              <p
                                className={`truncate text-sm ${
                                  unread
                                    ? "font-bold text-slate-800"
                                    : "font-semibold text-slate-700"
                                }`}
                              >
                                {notification.title}
                              </p>
                            </div>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {notification.recipient}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs text-slate-400">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                          {notification.message}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeStyle(
                              notification.type,
                            )}`}
                          >
                            {getTypeIcon(notification.type)}
                            {notification.type}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              unread
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {notification.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Details */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {!selectedNotification ? (
            <div className="flex min-h-[500px] items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <FaBell className="text-2xl" />
                </div>

                <h3 className="font-semibold text-slate-700">
                  Select a notification
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a notification to view its details.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[500px] flex-col">
              {/* Details Header */}
              <div className="border-b border-slate-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getTypeStyle(
                        selectedNotification.type,
                      )}`}
                    >
                      {getTypeIcon(selectedNotification.type)}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-slate-800">
                        {selectedNotification.title}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Notification ID: {selectedNotification.notificationId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      isUnread(selectedNotification)
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedNotification.status}
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <FaUser className="text-slate-400" />

                    <span className="w-20 font-medium text-slate-500">
                      Recipient
                    </span>

                    <span className="font-semibold text-slate-700">
                      {selectedNotification.recipient}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FaTag className="text-slate-400" />

                    <span className="w-20 font-medium text-slate-500">
                      Type
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeStyle(
                        selectedNotification.type,
                      )}`}
                    >
                      {selectedNotification.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FaClock className="text-slate-400" />

                    <span className="w-20 font-medium text-slate-500">
                      Created
                    </span>

                    <span className="text-slate-600">
                      {formatDate(selectedNotification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 p-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 p-5">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleToggleStatus(selectedNotification)}
                    disabled={statusLoading === selectedNotification._id}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isUnread(selectedNotification)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {isUnread(selectedNotification) ? (
                      <>
                        <FaCheckCircle />
                        {statusLoading === selectedNotification._id
                          ? "Updating..."
                          : "Mark as Read"}
                      </>
                    ) : (
                      <>
                        <FaBell />
                        {statusLoading === selectedNotification._id
                          ? "Updating..."
                          : "Mark as Unread"}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleEdit(selectedNotification)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteClick(selectedNotification)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Notification Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId ? "Edit Notification" : "Create Notification"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingId
                    ? "Update the selected notification."
                    : "Create a new employee notification or system alert."}
                </p>
              </div>

              <button
                onClick={handleCancel}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Notification ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Notification ID
                  </label>

                  <input
                    type="text"
                    name="notificationId"
                    value={formData.notificationId}
                    onChange={handleChange}
                    placeholder="Example: NOT002"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Recipient */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Recipient
                  </label>

                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Example: Ajay Kumar"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Notification title"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="General">General</option>
                    <option value="Task">Task</option>
                    <option value="Message">Message</option>
                    <option value="System">System</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter notification message..."
                  rows="6"
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Form Message */}
              {formMessage && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    formMessage.toLowerCase().includes("success")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {formMessage}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingId ? (
                    <>
                      <FaCheckCircle />
                      {formLoading ? "Updating..." : "Update Notification"}
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      {formLoading ? "Creating..." : "Create Notification"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && notificationToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <FaTrash />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Delete Notification?
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                {notificationToDelete.title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Recipient: {notificationToDelete.recipient}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setNotificationToDelete(null);
                }}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaTrash />
                {deleteLoading ? "Deleting..." : "Delete Notification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
