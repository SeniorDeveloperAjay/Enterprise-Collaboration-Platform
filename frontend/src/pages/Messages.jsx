import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaEnvelopeOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaInbox,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaFilter,
  FaSyncAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);

  const [deletingMessage, setDeletingMessage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    messageId: "",
    sender: "",
    recipient: "",
    subject: "",
    content: "",
    status: "Unread",
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(`${API_URL}/api/messages`);

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      const messageList = data.messages || [];

      setMessages(messageList);

      setSelectedMessage((currentSelected) => {
        if (!currentSelected) {
          return messageList.length > 0 ? messageList[0] : null;
        }

        const updatedSelected = messageList.find(
          (message) => message._id === currentSelected._id,
        );

        return (
          updatedSelected || (messageList.length > 0 ? messageList[0] : null)
        );
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoadError("Unable to load messages. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const totalMessages = messages.length;

  const unreadMessages = messages.filter(
    (message) => String(message.status || "").toLowerCase() === "unread",
  ).length;

  const readMessages = messages.filter(
    (message) => String(message.status || "").toLowerCase() === "read",
  ).length;

  const filteredMessages = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesStatus =
        statusFilter === "All" ||
        String(message.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const searchableText = [
        message.messageId,
        message.sender,
        message.recipient,
        message.subject,
        message.content,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = search === "" || searchableText.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [messages, searchTerm, statusFilter]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      messageId: "",
      sender: "",
      recipient: "",
      subject: "",
      content: "",
      status: "Unread",
    });

    setEditingMessage(null);
    setFormMessage("");
  };

  const handleOpenNewMessage = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);

    setFormData({
      messageId: message.messageId || "",
      sender: message.sender || "",
      recipient: message.recipient || "",
      subject: message.subject || "",
      content: message.content || "",
      status: message.status || "Unread",
    });

    setFormMessage("");
    setShowForm(true);
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    try {
      setFormLoading(true);
      setFormMessage("");

      const url = editingMessage
        ? `${API_URL}/api/messages/${editingMessage._id}`
        : `${API_URL}/api/messages`;

      const method = editingMessage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save message");
      }

      setFormMessage(
        editingMessage
          ? "Message updated successfully."
          : "Message sent successfully.",
      );

      await fetchMessages();

      setTimeout(() => {
        resetForm();
        setShowForm(false);
      }, 700);
    } catch (error) {
      console.error("Error saving message:", error);
      setFormMessage(error.message || "Something went wrong.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (message) => {
    try {
      setStatusLoading(message._id);

      const updatedMessage = {
        messageId: message.messageId,
        sender: message.sender,
        recipient: message.recipient,
        subject: message.subject,
        content: message.content,
        status:
          String(message.status || "").toLowerCase() === "read"
            ? "Unread"
            : "Read",
      };

      const response = await fetch(`${API_URL}/api/messages/${message._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessage),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Unable to update message status");
      }

      await fetchMessages();
    } catch (error) {
      console.error("Error updating message status:", error);
      alert("Unable to update message status.");
    } finally {
      setStatusLoading(null);
    }
  };

  const handleDeleteMessage = async () => {
    if (!deletingMessage) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await fetch(
        `${API_URL}/api/messages/${deletingMessage._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete message");
      }

      if (selectedMessage?._id === deletingMessage._id) {
        setSelectedMessage(null);
      }

      setDeletingMessage(null);
      await fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Unable to delete message.");
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

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const isUnread = (message) =>
    String(message?.status || "").toLowerCase() === "unread";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Messages</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage internal organizational communication and messages.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchMessages}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button
            onClick={handleOpenNewMessage}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <FaPlus />
            New Message
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Messages
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalMessages}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <FaInbox className="text-xl" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Unread Messages
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                {unreadMessages}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <FaEnvelope className="text-xl" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Read Messages
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {readMessages}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <FaEnvelopeOpen className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by sender, recipient, subject, message..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400" />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Messages</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
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

      {/* Messages Workspace */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.85fr)]">
        {/* Message List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-800">Inbox</h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredMessages.length} message
                  {filteredMessages.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <FaInbox className="text-lg text-blue-500" />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

                <p className="text-sm text-slate-500">Loading messages...</p>
              </div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <FaEnvelope className="text-xl" />
                </div>

                <h3 className="font-semibold text-slate-700">
                  No messages found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-h-[650px] overflow-y-auto">
              {filteredMessages.map((message) => {
                const unread = isUnread(message);
                const selected = selectedMessage?._id === message._id;

                return (
                  <button
                    key={message._id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full border-b border-slate-100 p-5 text-left transition last:border-b-0 ${
                      selected ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          unread
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {getInitials(message.sender)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p
                              className={`truncate text-sm ${
                                unread
                                  ? "font-bold text-slate-800"
                                  : "font-semibold text-slate-700"
                              }`}
                            >
                              {message.sender}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              To: {message.recipient}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs text-slate-400">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          {unread && (
                            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                          )}

                          <p
                            className={`truncate text-sm ${
                              unread
                                ? "font-bold text-slate-800"
                                : "font-medium text-slate-700"
                            }`}
                          >
                            {message.subject}
                          </p>
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Details */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {!selectedMessage ? (
            <div className="flex min-h-[500px] items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <FaEnvelopeOpen className="text-2xl" />
                </div>

                <h3 className="font-semibold text-slate-700">
                  Select a message
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a message from the inbox to view its details.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[500px] flex-col">
              {/* Detail Header */}
              <div className="border-b border-slate-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      {getInitials(selectedMessage.sender)}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-slate-800">
                        {selectedMessage.subject}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Message ID: {selectedMessage.messageId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      isUnread(selectedMessage)
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              {/* Sender / Recipient */}
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <FaUser className="text-slate-400" />

                    <span className="w-16 font-medium text-slate-500">
                      From
                    </span>

                    <span className="font-semibold text-slate-700">
                      {selectedMessage.sender}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FaArrowRight className="text-slate-400" />

                    <span className="w-16 font-medium text-slate-500">To</span>

                    <span className="font-semibold text-slate-700">
                      {selectedMessage.recipient}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FaClock className="text-slate-400" />

                    <span className="w-16 font-medium text-slate-500">
                      Date
                    </span>

                    <span className="text-slate-600">
                      {formatDate(selectedMessage.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {selectedMessage.content}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 p-5">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleToggleStatus(selectedMessage)}
                    disabled={statusLoading === selectedMessage._id}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isUnread(selectedMessage)
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {isUnread(selectedMessage) ? (
                      <>
                        <FaCheckCircle />
                        {statusLoading === selectedMessage._id
                          ? "Updating..."
                          : "Mark as Read"}
                      </>
                    ) : (
                      <>
                        <FaEnvelope />
                        {statusLoading === selectedMessage._id
                          ? "Updating..."
                          : "Mark as Unread"}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleEditMessage(selectedMessage)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => setDeletingMessage(selectedMessage)}
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

      {/* Compose / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingMessage ? "Edit Message" : "Compose New Message"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingMessage
                    ? "Update the selected organizational message."
                    : "Send a new internal organizational message."}
                </p>
              </div>

              <button
                onClick={handleCancelForm}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitMessage} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Message ID
                  </label>

                  <input
                    type="text"
                    name="messageId"
                    value={formData.messageId}
                    onChange={handleInputChange}
                    placeholder="Example: MSG002"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Sender
                  </label>

                  <input
                    type="text"
                    name="sender"
                    value={formData.sender}
                    onChange={handleInputChange}
                    placeholder="Sender name"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Recipient
                  </label>

                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    placeholder="Recipient name"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Message subject"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message
                </label>

                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your message..."
                  rows="6"
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

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

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingMessage ? (
                    <>
                      <FaCheckCircle />
                      {formLoading ? "Updating..." : "Update Message"}
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      {formLoading ? "Sending..." : "Send Message"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <FaTrash />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Delete Message?
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                {deletingMessage.subject}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                From: {deletingMessage.sender}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingMessage(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteMessage}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaTrash />
                {deleteLoading ? "Deleting..." : "Delete Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
