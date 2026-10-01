import { useEffect, useMemo, useState } from "react";
import {
  FaArchive,
  FaBuilding,
  FaCheckCircle,
  FaEdit,
  FaFileAlt,
  FaFolder,
  FaPlus,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";

const API_URL = "https://enterprise-collaboration-backend.onrender.com";

const initialFormData = {
  documentId: "",
  title: "",
  description: "",
  uploadedBy: "",
  department: "",
  category: "General",
  status: "Active",
};

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [editingDocument, setEditingDocument] = useState(null);

  const [deletingDocument, setDeletingDocument] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(`${API_URL}/api/documents`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch documents");
      }

      const fetchedDocuments = data.documents || [];

      setDocuments(fetchedDocuments);

      if (selectedDocument) {
        const updatedDocument = fetchedDocuments.find(
          (document) => document._id === selectedDocument._id,
        );

        setSelectedDocument(updatedDocument || null);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      setLoadError(error.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingDocument(null);
    setFormData(initialFormData);
    setFormMessage("");
    setShowForm(true);
  };

  const handleEditDocument = (document) => {
    setEditingDocument(document);

    setFormData({
      documentId: document.documentId || "",
      title: document.title || "",
      description: document.description || "",
      uploadedBy: document.uploadedBy || "",
      department: document.department || "",
      category: document.category || "General",
      status: document.status || "Active",
    });

    setFormMessage("");
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingDocument(null);
    setFormMessage("");
    setFormData(initialFormData);
  };

  const handleSubmitDocument = async (event) => {
    event.preventDefault();

    setFormLoading(true);
    setFormMessage("");

    try {
      const url = editingDocument
        ? `${API_URL}/api/documents/${editingDocument._id}`
        : `${API_URL}/api/documents`;

      const method = editingDocument ? "PUT" : "POST";

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
            (editingDocument
              ? "Failed to update document"
              : "Failed to create document"),
        );
      }

      await fetchDocuments();

      setFormData(initialFormData);
      setEditingDocument(null);
      setShowForm(false);
      setFormMessage("");
    } catch (error) {
      console.error("Document save error:", error);
      setFormMessage(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!deletingDocument) {
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/documents/${deletingDocument._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete document");
      }

      if (selectedDocument?._id === deletingDocument._id) {
        setSelectedDocument(null);
      }

      setDeletingDocument(null);

      await fetchDocuments();
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCategoryClass = (category) => {
    if (category === "Project") {
      return "bg-blue-100 text-blue-700";
    }

    if (category === "HR") {
      return "bg-purple-100 text-purple-700";
    }

    if (category === "Finance") {
      return "bg-green-100 text-green-700";
    }

    if (category === "Technical") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredDocuments = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return documents.filter((document) => {
      const matchesSearch =
        !search ||
        String(document.documentId || "")
          .toLowerCase()
          .includes(search) ||
        String(document.title || "")
          .toLowerCase()
          .includes(search) ||
        String(document.description || "")
          .toLowerCase()
          .includes(search) ||
        String(document.uploadedBy || "")
          .toLowerCase()
          .includes(search) ||
        String(document.department || "")
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        categoryFilter === "All" || document.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || document.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [documents, searchTerm, categoryFilter, statusFilter]);

  const totalDocuments = documents.length;

  const activeDocuments = documents.filter(
    (document) => document.status === "Active",
  ).length;

  const archivedDocuments = documents.filter(
    (document) => document.status === "Archived",
  ).length;

  const projectDocuments = documents.filter(
    (document) => document.category === "Project",
  ).length;

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaFileAlt />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">Documents</h1>

              <p className="mt-1 text-sm text-gray-500">
                Create and manage organizational document records.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchDocuments}
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
            Add Document
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Documents
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-800">
                {totalDocuments}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaFileAlt />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active</p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {activeDocuments}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Archived</p>

              <p className="mt-2 text-3xl font-bold text-gray-600">
                {archivedDocuments}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <FaArchive />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Project Documents
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {projectDocuments}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaFolder />
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
              placeholder="Search by ID, title, uploader or department..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Project">Project</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Technical">Technical</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredDocuments.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {documents.length}
            </span>{" "}
            documents
          </span>

          {(searchTerm ||
            categoryFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
                setStatusFilter("All");
              }}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <FaSyncAlt className="mx-auto animate-spin text-2xl text-blue-600" />

          <p className="mt-3 text-gray-500">Loading documents...</p>
        </div>
      )}

      {/* Error */}
      {!loading && loadError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">Unable to load documents</p>

          <p className="mt-1 text-sm text-red-600">{loadError}</p>

          <button
            onClick={fetchDocuments}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !loadError && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <FaFileAlt className="text-xl" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-700">
                  No documents found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters, or create a new document.
                </p>
              </div>
            ) : (
              filteredDocuments.map((document) => (
                <div
                  key={document._id}
                  onClick={() => setSelectedDocument(document)}
                  className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    selectedDocument?._id === document._id
                      ? "border-blue-400 ring-2 ring-blue-100"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FaFileAlt />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                            {document.documentId}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getCategoryClass(
                              document.category,
                            )}`}
                          >
                            {document.category || "General"}
                          </span>
                        </div>

                        <h2 className="mt-2 truncate text-lg font-semibold text-gray-800">
                          {document.title}
                        </h2>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                          {document.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                        document.status,
                      )}`}
                    >
                      {document.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />

                      <div>
                        <p className="text-xs text-gray-400">Uploaded By</p>

                        <p className="text-sm font-medium text-gray-700">
                          {document.uploadedBy}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaBuilding className="text-gray-400" />

                      <div>
                        <p className="text-xs text-gray-400">Department</p>

                        <p className="text-sm font-medium text-gray-700">
                          {document.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaFolder className="text-gray-400" />

                      <div>
                        <p className="text-xs text-gray-400">Created</p>

                        <p className="text-sm font-medium text-gray-700">
                          {formatDate(document.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEditDocument(document);
                      }}
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeletingDocument(document);
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

          {/* Document Details */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            {selectedDocument ? (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Document Details
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-gray-800">
                        {selectedDocument.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {selectedDocument.documentId}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedDocument(null)}
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
                        selectedDocument.status,
                      )}`}
                    >
                      {selectedDocument.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getCategoryClass(
                        selectedDocument.category,
                      )}`}
                    >
                      {selectedDocument.category || "General"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {selectedDocument.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FaUser />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Uploaded By</p>

                        <p className="text-sm font-medium text-gray-700">
                          {selectedDocument.uploadedBy}
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
                          {selectedDocument.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <FaFolder />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Category</p>

                        <p className="text-sm font-medium text-gray-700">
                          {selectedDocument.category || "General"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <FaFileAlt />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Created</p>

                        <p className="text-sm font-medium text-gray-700">
                          {selectedDocument.createdAt
                            ? new Date(
                                selectedDocument.createdAt,
                              ).toLocaleString("en-IN")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEditDocument(selectedDocument)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeletingDocument(selectedDocument)}
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
                  <FaFileAlt className="text-xl" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-700">
                  Select a document
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Select a document from the list to view its complete details.
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
                  {editingDocument ? "Edit Document" : "Create New Document"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingDocument
                    ? "Update the document information below."
                    : "Enter the details for the new document."}
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

            <form onSubmit={handleSubmitDocument} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Document ID
                  </label>

                  <input
                    type="text"
                    name="documentId"
                    value={formData.documentId}
                    onChange={handleInputChange}
                    placeholder="e.g. DOC001"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Document Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Project Requirements Document"
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
                  placeholder="Describe the document..."
                  rows="4"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Uploaded By
                  </label>

                  <input
                    type="text"
                    name="uploadedBy"
                    value={formData.uploadedBy}
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Project">Project</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Technical">Technical</option>
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
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
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
                    ? editingDocument
                      ? "Updating..."
                      : "Creating..."
                    : editingDocument
                      ? "Update Document"
                      : "Create Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <FaTrash />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Delete Document
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingDocument.title}
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-gray-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingDocument(null)}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteDocument}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;
