import { useState } from "react"
import {
  FaFolderOpen,
  FaFileAlt,
  FaPlus,
  FaTrash,
  FaRedo,
  FaPlay,
  FaCheckCircle,
  FaExchangeAlt,
  FaDatabase,
  FaServer,
  FaHdd,
  FaFolder,
  FaCircle,
  FaCloudDownloadAlt,
  FaSyncAlt,
  FaLink,
} from "react-icons/fa"

function FileManagement() {
  const [activeTab, setActiveTab] = useState("overview")

  // ---------------- ENTERPRISE DOCUMENT INTEGRATION ----------------

  const [enterpriseDocuments, setEnterpriseDocuments] = useState([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [enterpriseMessage, setEnterpriseMessage] = useState(
    "Import Documents to create simulated enterprise file records."
  )

  const calculateDocumentSize = (category) => {
    const normalizedCategory = String(category || "").toLowerCase()

    if (normalizedCategory.includes("project")) return 8
    if (normalizedCategory.includes("report")) return 6
    if (normalizedCategory.includes("technical")) return 5

    return 4
  }

  const mapDocumentStatus = (status) => {
    const normalizedStatus = String(status || "").toLowerCase()

    if (
      normalizedStatus.includes("archive") ||
      normalizedStatus.includes("completed")
    ) {
      return "Archived"
    }

    if (
      normalizedStatus.includes("read") ||
      normalizedStatus.includes("locked")
    ) {
      return "Read Only"
    }

    return "Active"
  }

  const importDocuments = async () => {
    setLoadingDocuments(true)
    setEnterpriseMessage("Loading enterprise documents...")

    try {
      const response = await fetch("https://enterprise-collaboration-backend.onrender.com/api/documents")

      if (!response.ok) {
        throw new Error("Unable to fetch enterprise documents.")
      }

      const data = await response.json()
      const documents = Array.isArray(data.documents)
        ? data.documents
        : []

      const importedDocuments = documents.map((document, index) => ({
        id: `enterprise-document-${document.documentId || index + 1}`,
        name: document.title || `document-${index + 1}`,
        size: calculateDocumentSize(document.category),
        status: mapDocumentStatus(document.status),
        source: "Enterprise Document",
        documentId: document.documentId,
        category: document.category || "General",
        uploadedBy: document.uploadedBy || "Unknown",
        department: document.department || "Unassigned",
        originalStatus: document.status || "Active",
        description: document.description || "",
      }))

      setEnterpriseDocuments(importedDocuments)

      setFiles((prev) => {
        const manualFiles = prev.filter(
          (file) => file.source !== "Enterprise Document"
        )

        return [...manualFiles, ...importedDocuments]
      })

      setActivityLog((prev) => [
        `Imported ${importedDocuments.length} enterprise document${
          importedDocuments.length === 1 ? "" : "s"
        } into the simulated file system`,
        ...prev,
      ])

      if (importedDocuments.length === 0) {
        setEnterpriseMessage(
          "No enterprise documents were found."
        )
      } else {
        setEnterpriseMessage(
          `${importedDocuments.length} enterprise document${
            importedDocuments.length === 1 ? "" : "s"
          } imported successfully.`
        )
      }
    } catch (error) {
      setEnterpriseMessage(
        "Unable to load enterprise documents. Make sure the backend server is running."
      )
    } finally {
      setLoadingDocuments(false)
    }
  }

  const clearEnterpriseDocuments = () => {
    setEnterpriseDocuments([])

    setFiles((prev) =>
      prev.filter(
        (file) => file.source !== "Enterprise Document"
      )
    )

    setActivityLog((prev) => [
      "Enterprise document records cleared from the simulated file system",
      ...prev,
    ])

    setEnterpriseMessage(
      "Enterprise document records have been cleared."
    )
  }

  // ---------------- FILE ALLOCATION ----------------

  const [fileName, setFileName] = useState("")
  const [requiredBlocks, setRequiredBlocks] = useState("")
  const [allocationMethod, setAllocationMethod] = useState("Contiguous")

  const [blocks, setBlocks] = useState(
    Array.from({ length: 12 }, (_, index) => ({
      id: index,
      file: null,
    }))
  )

  const [allocationMessage, setAllocationMessage] = useState("")

  const allocateFile = () => {
    const count = Number(requiredBlocks)

    if (!fileName.trim()) {
      setAllocationMessage("Please enter a file name.")
      return
    }

    if (!count || count <= 0 || count > 12) {
      setAllocationMessage(
        "Enter a valid number of blocks between 1 and 12."
      )
      return
    }

    const freeBlocks = blocks.filter(
      (block) => block.file === null
    )

    if (freeBlocks.length < count) {
      setAllocationMessage(
        "Not enough free blocks available."
      )
      return
    }

    let selectedBlocks = []

    if (allocationMethod === "Contiguous") {
      let found = false

      for (
        let i = 0;
        i <= blocks.length - count;
        i++
      ) {
        const group = blocks.slice(i, i + count)

        if (
          group.every(
            (block) => block.file === null
          )
        ) {
          selectedBlocks = group
          found = true
          break
        }
      }

      if (!found) {
        setAllocationMessage(
          "Contiguous allocation failed: no continuous free space available."
        )
        return
      }
    } else {
      selectedBlocks = freeBlocks.slice(0, count)
    }

    const selectedIds = selectedBlocks.map(
      (block) => block.id
    )

    setBlocks((prev) =>
      prev.map((block) =>
        selectedIds.includes(block.id)
          ? {
              ...block,
              file: fileName,
            }
          : block
      )
    )

    setAllocationMessage(
      `${fileName} allocated using ${allocationMethod} allocation.`
    )

    setActivityLog((prev) => [
      `${fileName} allocated using ${allocationMethod} allocation`,
      ...prev,
    ])

    setFileName("")
    setRequiredBlocks("")
  }

  const resetBlocks = () => {
    setBlocks(
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        file: null,
      }))
    )

    setAllocationMessage("")
  }

  // ---------------- FILE OPERATIONS ----------------

  const [newFileName, setNewFileName] = useState("")
  const [newFileSize, setNewFileSize] = useState("")

  const initialFiles = [
    {
      id: 1,
      name: "project.txt",
      size: 5,
      status: "Active",
      source: "OS Simulation",
    },
    {
      id: 2,
      name: "report.pdf",
      size: 3,
      status: "Archived",
      source: "OS Simulation",
    },
    {
      id: 3,
      name: "database.db",
      size: 7,
      status: "Read Only",
      source: "OS Simulation",
    },
  ]

  const [files, setFiles] = useState(initialFiles)

  const [activityLog, setActivityLog] = useState([
    "project.txt created",
    "report.pdf archived",
    "database.db marked as Read Only",
  ])

  const createFile = () => {
    if (!newFileName.trim()) {
      return
    }

    if (!newFileSize || Number(newFileSize) <= 0) {
      return
    }

    const newFile = {
      id: Date.now(),
      name: newFileName,
      size: Number(newFileSize),
      status: "Active",
      source: "OS Simulation",
    }

    setFiles((prev) => [...prev, newFile])

    setActivityLog((prev) => [
      `${newFileName} created with Active status`,
      ...prev,
    ])

    setNewFileName("")
    setNewFileSize("")
  }

  const deleteFile = (id) => {
    const file = files.find(
      (item) => item.id === id
    )

    if (!file) return

    setFiles((prev) =>
      prev.filter((item) => item.id !== id)
    )

    setActivityLog((prev) => [
      `${file.name} deleted`,
      ...prev,
    ])
  }

  const changeFileStatus = (id, newStatus) => {
    const targetFile = files.find(
      (file) => file.id === id
    )

    if (!targetFile) return

    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === id) {
          return {
            ...file,
            status: newStatus,
          }
        }

        return file
      })
    )

    setActivityLog((logs) => [
      `${targetFile.name} status changed from ${targetFile.status} to ${newStatus}`,
      ...logs,
    ])
  }

  const resetFileOperations = () => {
    setFiles([
      ...initialFiles,
      ...enterpriseDocuments,
    ])

    setActivityLog([
      "File operations reset",
    ])

    setNewFileName("")
    setNewFileSize("")
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"

      case "Archived":
        return "bg-amber-50 text-amber-700 border-amber-200"

      case "Read Only":
        return "bg-blue-50 text-blue-700 border-blue-200"

      case "Deleted":
        return "bg-red-50 text-red-700 border-red-200"

      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // ---------------- TABS ----------------

  const tabs = [
    {
      id: "overview",
      name: "Overview",
      icon: <FaFolderOpen />,
    },
    {
      id: "allocation",
      name: "File Allocation",
      icon: <FaDatabase />,
    },
    {
      id: "directories",
      name: "Directories",
      icon: <FaFolderOpen />,
    },
    {
      id: "operations",
      name: "File Operations",
      icon: <FaFileAlt />,
    },
  ]

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50/70">
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-50 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-indigo-50 blur-2xl" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <FaServer className="text-[10px]" />
                  Operating Systems
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
                  File System Module
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <FaLink className="text-[10px]" />
                  Documents Connected
                </span>
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                File Management
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                Learn how operating systems manage files,
                directories, allocation and file operations.
                Enterprise Documents can also be imported as
                simulated file-system records.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:block">
              <FaHdd className="text-3xl text-blue-600" />
            </div>
          </div>
        </section>

        {/* ================= ENTERPRISE DOCUMENT CONNECTION ================= */}

        <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <FaCloudDownloadAlt />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">
                    Enterprise Documents
                  </h2>

                  <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
                    Connected
                  </span>
                </div>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Import documents from the enterprise
                  Documents module and represent them as
                  simulated files inside this OS file system.
                </p>

                <p className="mt-2 break-words text-xs font-medium text-indigo-700">
                  {enterpriseMessage}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={importDocuments}
                disabled={loadingDocuments}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingDocuments ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaCloudDownloadAlt />
                )}

                {loadingDocuments
                  ? "Importing..."
                  : "Import Documents"}
              </button>

              {enterpriseDocuments.length > 0 && (
                <button
                  type="button"
                  onClick={clearEnterpriseDocuments}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                  <FaTrash />
                  Clear Enterprise Files
                </button>
              )}
            </div>
          </div>

          {enterpriseDocuments.length > 0 && (
            <div className="border-t border-indigo-100 bg-white/70 px-5 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600">
                <span>
                  Imported Files:{" "}
                  <strong className="text-indigo-700">
                    {enterpriseDocuments.length}
                  </strong>
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-300" />

                <span>
                  Simulated File Records
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-300" />

                <span>
                  Source: Enterprise Documents
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ================= TABS ================= */}

        <nav className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* ================= OVERVIEW ================= */}

        {activeTab === "overview" && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaFileAlt className="text-xl" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Files
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Files store user and system data permanently.
                </p>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FaFolderOpen className="text-xl" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Directories
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Directories organize files into a structured hierarchy.
                </p>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaDatabase className="text-xl" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Allocation
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  File allocation determines how disk blocks are assigned.
                </p>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <FaExchangeAlt className="text-xl" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Operations
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Create, delete and modify files.
                </p>
              </div>

            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <FaFileAlt />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    File Attributes
                  </h2>

                  <p className="text-sm text-gray-500">
                    Common metadata maintained by a file system.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "File Name",
                  "File Type",
                  "File Size",
                  "Location",
                  "Protection",
                  "Creation Time",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                  >
                    <p className="font-semibold text-gray-800">
                      {item}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      File system attribute
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ENTERPRISE FLOW */}

            <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FaLink />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Enterprise Document → File System
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Documents from the collaboration platform can
                    be represented as simulated files for OS file
                    management demonstrations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Step 1
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    Enterprise Documents
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Documents are retrieved from the existing
                    backend API.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Step 2
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    Simulated File Records
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Each document becomes a simulated file record.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Step 3
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    OS File Operations
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Imported files participate in the file-system
                    simulation.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= FILE ALLOCATION ================= */}

        {activeTab === "allocation" && (
          <div className="space-y-6">

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaDatabase />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    File Allocation Simulation
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Allocate files to simulated disk blocks using different
                    allocation methods.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    File Name
                  </label>

                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) =>
                      setFileName(e.target.value)
                    }
                    placeholder="example.txt"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Required Blocks
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={requiredBlocks}
                    onChange={(e) =>
                      setRequiredBlocks(e.target.value)
                    }
                    placeholder="3"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Allocation Method
                  </label>

                  <select
                    value={allocationMethod}
                    onChange={(e) =>
                      setAllocationMethod(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Contiguous</option>
                    <option>Linked</option>
                    <option>Indexed</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={allocateFile}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaPlay />
                  Allocate File
                </button>

                <button
                  type="button"
                  onClick={resetBlocks}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <FaRedo />
                  Reset
                </button>
              </div>

              {allocationMessage && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                  <FaCheckCircle className="mt-0.5 shrink-0" />

                  <span className="break-words">
                    {allocationMessage}
                  </span>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Disk Blocks
                  </h2>

                  <p className="text-sm text-gray-500">
                    Simulated disk block allocation state.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <FaCircle className="text-[8px] text-blue-500" />
                    Allocated
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FaCircle className="text-[8px] text-gray-300" />
                    Free
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className={`overflow-hidden rounded-xl border-2 p-4 text-center transition ${
                      block.file
                        ? "border-blue-300 bg-blue-50 shadow-sm"
                        : "border-dashed border-gray-300 bg-gray-50"
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Block
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-800">
                      {block.id}
                    </p>

                    <div className="mt-2 truncate text-xs font-medium text-gray-600">
                      {block.file || "Free"}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaDatabase />
                </div>

                <h3 className="font-bold text-gray-900">
                  Contiguous Allocation
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  File blocks are stored next to each other.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaExchangeAlt />
                </div>

                <h3 className="font-bold text-gray-900">
                  Linked Allocation
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  File blocks can be located anywhere and are linked.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FaFolder />
                </div>

                <h3 className="font-bold text-gray-900">
                  Indexed Allocation
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  An index block stores pointers to file blocks.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ================= DIRECTORIES ================= */}

        {activeTab === "directories" && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Single-Level Directory",
                  text: "All files are stored in one directory.",
                },
                {
                  title: "Two-Level Directory",
                  text: "Each user has a separate directory.",
                },
                {
                  title: "Tree Directory",
                  text: "Directories are organized hierarchically.",
                },
                {
                  title: "Acyclic Graph",
                  text: "Files or directories can be shared.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <FaFolderOpen className="text-xl" />
                  </div>

                  <h3 className="font-bold leading-5 text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <FaFolder />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Example Directory Tree
                  </h2>

                  <p className="text-sm text-gray-500">
                    Example hierarchical organization of enterprise files.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-5">
                <pre className="min-w-max font-mono text-sm leading-7 text-gray-200">
{`📁 EnterprisePlatform
├── 📁 Documents
│   ├── 📄 report.pdf
│   └── 📄 project.txt
├── 📁 Projects
│   └── 📄 database.db
└── 📁 Users`}
                </pre>
              </div>
            </section>
          </div>
        )}

        {/* ================= FILE OPERATIONS ================= */}

        {activeTab === "operations" && (
          <div className="space-y-6">

            {/* CREATE FILE */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaPlus />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Create New File
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add a new file to the simulated file system.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    File Name
                  </label>

                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) =>
                      setNewFileName(e.target.value)
                    }
                    placeholder="newfile.txt"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    File Size (KB)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={newFileSize}
                    onChange={(e) =>
                      setNewFileSize(e.target.value)
                    }
                    placeholder="10"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={createFile}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaPlus />
                Create File
              </button>
            </section>

            {/* FILE TABLE */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                      File Operations
                    </h2>

                    {enterpriseDocuments.length > 0 && (
                      <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
                        {enterpriseDocuments.length} Enterprise
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage the simulated files and their states.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActivityLog([])}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    Clear Log
                  </button>

                  <button
                    type="button"
                    onClick={resetFileOperations}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <FaRedo />
                    Reset
                  </button>
                </div>
              </div>

              {files.length === 0 ? (
                <div className="px-5 py-14 text-center sm:px-6">
                  <FaFolderOpen className="mx-auto mb-3 text-3xl text-gray-300" />

                  <p className="font-semibold text-gray-600">
                    No files available.
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Create a new file or import enterprise documents to continue.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-left">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                          File
                        </th>

                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Source
                        </th>

                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Size
                        </th>

                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Status
                        </th>

                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Change Status
                        </th>

                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {files.map((file) => (
                        <tr
                          key={file.id}
                          className="transition hover:bg-gray-50/80"
                        >
                          <td className="px-5 py-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                  file.source ===
                                  "Enterprise Document"
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                {file.source ===
                                "Enterprise Document" ? (
                                  <FaFolderOpen />
                                ) : (
                                  <FaFileAlt />
                                )}
                              </div>

                              <div className="min-w-0">
                                <span className="block max-w-[240px] truncate font-semibold text-gray-800">
                                  {file.name}
                                </span>

                                {file.source ===
                                  "Enterprise Document" &&
                                  file.category && (
                                    <span className="mt-1 block max-w-[240px] truncate text-xs text-gray-400">
                                      {file.category}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                                file.source ===
                                "Enterprise Document"
                                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                                  : "border-gray-200 bg-gray-50 text-gray-600"
                              }`}
                            >
                              {file.source ===
                              "Enterprise Document" ? (
                                <FaLink className="text-[9px]" />
                              ) : (
                                <FaServer className="text-[9px]" />
                              )}

                              {file.source ||
                                "OS Simulation"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-gray-600">
                            {file.size} KB
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                                file.status
                              )}`}
                            >
                              <FaCircle className="text-[6px]" />
                              {file.status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={file.status}
                              onChange={(e) =>
                                changeFileStatus(
                                  file.id,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                              <option value="Active">
                                Active
                              </option>

                              <option value="Archived">
                                Archived
                              </option>

                              <option value="Read Only">
                                Read Only
                              </option>

                              <option value="Deleted">
                                Deleted
                              </option>
                            </select>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                deleteFile(file.id)
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                              <FaTrash />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* ENTERPRISE DOCUMENT DETAILS */}

            {enterpriseDocuments.length > 0 && (
              <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FaCloudDownloadAlt />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                      Imported Enterprise Documents
                    </h2>

                    <p className="text-sm text-gray-500">
                      Documents currently represented as simulated file records.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[820px] text-left">
                    <thead className="bg-indigo-50/60">
                      <tr className="border-b border-indigo-100">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-indigo-700">
                          Document
                        </th>

                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-indigo-700">
                          Category
                        </th>

                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-indigo-700">
                          Uploaded By
                        </th>

                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-indigo-700">
                          Department
                        </th>

                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-indigo-700">
                          File Size
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {enterpriseDocuments.map(
                        (document) => (
                          <tr
                            key={document.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                  <FaFileAlt />
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[260px] truncate font-semibold text-gray-800">
                                    {document.name}
                                  </p>

                                  <p className="text-xs text-gray-400">
                                    {document.documentId ||
                                      "Enterprise Document"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-600">
                              {document.category}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-600">
                              {document.uploadedBy}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-600">
                              {document.department}
                            </td>

                            <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                              {document.size} KB
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ACTIVITY LOG */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FaCheckCircle />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Activity Log
                  </h2>

                  <p className="text-sm text-gray-500">
                    Recent simulated file-system operations.
                  </p>
                </div>
              </div>

              {activityLog.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    No activity yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activityLog.map(
                    (log, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5"
                      >
                        <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />

                        <span className="break-words text-sm leading-5 text-gray-700">
                          {log}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ================= EDUCATIONAL NOTE ================= */}

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <FaServer />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-blue-900">
                Educational Simulation
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                This module demonstrates file-management concepts
                using a frontend simulation. Imported Enterprise
                Documents are represented as simulated file records.
                The module does not create, delete or modify actual
                files on your computer.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default FileManagement