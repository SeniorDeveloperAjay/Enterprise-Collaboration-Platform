import { useState } from "react"
import {
  FaHdd,
  FaPlay,
  FaRedo,
  FaCheckCircle,
  FaChartLine,
  FaExchangeAlt,
  FaServer,
  FaRoute,
  FaCalculator,
  FaCircle,
  FaFileAlt,
  FaSyncAlt,
  FaTrash,
  FaDatabase,
} from "react-icons/fa"

function DiskScheduling() {
  const DEFAULT_REQUESTS = "98, 183, 37, 122, 14, 124, 65, 67"

  const [activeTab, setActiveTab] = useState("overview")

  const [requests, setRequests] = useState(DEFAULT_REQUESTS)
  const [head, setHead] = useState(53)
  const [diskSize, setDiskSize] = useState(200)
  const [algorithm, setAlgorithm] = useState("FCFS")

  const [result, setResult] = useState(null)
  const [activityLog, setActivityLog] = useState([])

  // ============================================================
  // ENTERPRISE DOCUMENT INTEGRATION
  // ============================================================

  const [enterpriseDocuments, setEnterpriseDocuments] = useState([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [enterpriseMessage, setEnterpriseMessage] = useState(
    "Import Documents to create simulated disk requests."
  )

  // ============================================================
  // REQUEST PARSING
  // ============================================================

  const parseRequests = () => {
    const size = Number(diskSize)

    if (!Number.isInteger(size) || size < 2) {
      return []
    }

    return requests
      .split(",")
      .map((value) => Number(value.trim()))
      .filter(
        (value) =>
          Number.isInteger(value) &&
          value >= 0 &&
          value < size
      )
  }

  // ============================================================
  // DOCUMENT → CYLINDER MAPPING
  // ============================================================

  const calculateDocumentCylinder = (document, index, size) => {
    const source = `${document.documentId || ""}-${document.title || ""}-${index}`

    let hash = 0

    for (let i = 0; i < source.length; i++) {
      hash = (hash * 31 + source.charCodeAt(i)) % 100000
    }

    return hash % size
  }

  // ============================================================
  // IMPORT ENTERPRISE DOCUMENTS
  // ============================================================

  const importDocuments = async () => {
    setLoadingDocuments(true)
    setEnterpriseMessage("Loading enterprise documents...")

    try {
      const size = Number(diskSize)

      if (!Number.isInteger(size) || size < 2) {
        throw new Error("Disk size must be at least 2 cylinders.")
      }

      const response = await fetch(
        "https://enterprise-collaboration-backend.onrender.com/api/documents"
      )

      if (!response.ok) {
        throw new Error("Unable to fetch documents.")
      }

      const data = await response.json()

      const documents = Array.isArray(data.documents)
        ? data.documents
        : []

      if (documents.length === 0) {
        setEnterpriseDocuments([])
        setEnterpriseMessage(
          "No enterprise documents are currently available."
        )
        setRequests(DEFAULT_REQUESTS)

        setActivityLog((prev) => [
          "Document import completed: no enterprise documents were available.",
          ...prev,
        ])

        return
      }

      const mappedDocuments = documents.map((document, index) => {
        const cylinder = calculateDocumentCylinder(
          document,
          index,
          size
        )

        return {
          id: `enterprise-document-${
            document.documentId || index + 1
          }`,
          documentId: document.documentId || index + 1,
          title:
            document.title ||
            `Enterprise Document ${index + 1}`,
          category: document.category || "General",
          status: document.status || "Active",
          uploadedBy:
            document.uploadedBy || "Enterprise User",
          department:
            document.department || "General",
          description: document.description || "",
          cylinder,
        }
      })

      setEnterpriseDocuments(mappedDocuments)

      const documentRequests = mappedDocuments
        .map((document) => document.cylinder)
        .join(", ")

      setRequests(documentRequests)
      setResult(null)

      setEnterpriseMessage(
        `${mappedDocuments.length} enterprise document(s) imported as simulated disk-cylinder requests.`
      )

      setActivityLog((prev) => [
        `Imported ${mappedDocuments.length} enterprise document(s) into the disk scheduling simulator.`,
        ...prev,
      ])
    } catch (error) {
      setEnterpriseMessage(
        `Document import failed: ${error.message}`
      )

      setActivityLog((prev) => [
        `Document import failed: ${error.message}`,
        ...prev,
      ])
    } finally {
      setLoadingDocuments(false)
    }
  }

  // ============================================================
  // CLEAR ENTERPRISE DOCUMENTS
  // ============================================================

  const clearEnterpriseDocuments = () => {
    setEnterpriseDocuments([])
    setRequests(DEFAULT_REQUESTS)
    setResult(null)

    setEnterpriseMessage(
      "Enterprise document requests cleared. Manual disk requests restored."
    )

    setActivityLog((prev) => [
      "Enterprise document disk requests cleared.",
      ...prev,
    ])
  }

  // ============================================================
  // HEAD MOVEMENT CALCULATION
  // ============================================================

  const calculateMovement = (sequence) => {
    let total = 0

    for (let i = 1; i < sequence.length; i++) {
      total += Math.abs(
        sequence[i] - sequence[i - 1]
      )
    }

    return total
  }

  // ============================================================
  // FCFS
  // ============================================================

  const runFCFS = (queue, initialHead) => {
    return [initialHead, ...queue]
  }

  // ============================================================
  // SSTF
  // ============================================================

  const runSSTF = (queue, initialHead) => {
    const remaining = [...queue]
    const sequence = [initialHead]

    let current = initialHead

    while (remaining.length > 0) {
      let closestIndex = 0
      let closestDistance = Math.abs(
        remaining[0] - current
      )

      for (let i = 1; i < remaining.length; i++) {
        const distance = Math.abs(
          remaining[i] - current
        )

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      }

      current = remaining[closestIndex]

      sequence.push(current)
      remaining.splice(closestIndex, 1)
    }

    return sequence
  }

  // ============================================================
  // SCAN
  // ============================================================

  const runSCAN = (queue, initialHead, size) => {
    const lower = queue
      .filter((value) => value < initialHead)
      .sort((a, b) => b - a)

    const higher = queue
      .filter((value) => value >= initialHead)
      .sort((a, b) => a - b)

    const sequence = [
      initialHead,
      ...higher,
    ]

    if (sequence[sequence.length - 1] !== size - 1) {
      sequence.push(size - 1)
    }

    sequence.push(...lower)

    if (sequence[sequence.length - 1] !== 0) {
      sequence.push(0)
    }

    return sequence
  }

  // ============================================================
  // C-SCAN
  // ============================================================

  const runCSCAN = (queue, initialHead, size) => {
    const higher = queue
      .filter((value) => value >= initialHead)
      .sort((a, b) => a - b)

    const lower = queue
      .filter((value) => value < initialHead)
      .sort((a, b) => a - b)

    const sequence = [
      initialHead,
      ...higher,
    ]

    if (sequence[sequence.length - 1] !== size - 1) {
      sequence.push(size - 1)
    }

    if (sequence[sequence.length - 1] !== 0) {
      sequence.push(0)
    }

    sequence.push(...lower)

    return sequence
  }

  // ============================================================
  // LOOK
  // ============================================================

  const runLOOK = (queue, initialHead) => {
    const lower = queue
      .filter((value) => value < initialHead)
      .sort((a, b) => b - a)

    const higher = queue
      .filter((value) => value >= initialHead)
      .sort((a, b) => a - b)

    return [
      initialHead,
      ...higher,
      ...lower,
    ]
  }

  // ============================================================
  // C-LOOK
  // ============================================================

  const runCLOOK = (queue, initialHead) => {
    const higher = queue
      .filter((value) => value >= initialHead)
      .sort((a, b) => a - b)

    const lower = queue
      .filter((value) => value < initialHead)
      .sort((a, b) => a - b)

    return [
      initialHead,
      ...higher,
      ...lower,
    ]
  }

  // ============================================================
  // RUN SIMULATION
  // ============================================================

  const runSimulation = () => {
    const size = Number(diskSize)
    const initialHead = Number(head)

    if (!Number.isInteger(size) || size < 2) {
      setResult(null)

      setActivityLog((prev) => [
        "Simulation failed: disk size must be at least 2 cylinders.",
        ...prev,
      ])

      return
    }

    if (
      !Number.isInteger(initialHead) ||
      initialHead < 0 ||
      initialHead >= size
    ) {
      setResult(null)

      setActivityLog((prev) => [
        "Simulation failed: initial head must be within the disk range.",
        ...prev,
      ])

      return
    }

    const queue = parseRequests()

    if (queue.length === 0) {
      setResult(null)

      setActivityLog((prev) => [
        "Simulation failed: no valid disk requests entered.",
        ...prev,
      ])

      return
    }

    let sequence = []

    switch (algorithm) {
      case "FCFS":
        sequence = runFCFS(queue, initialHead)
        break

      case "SSTF":
        sequence = runSSTF(queue, initialHead)
        break

      case "SCAN":
        sequence = runSCAN(
          queue,
          initialHead,
          size
        )
        break

      case "C-SCAN":
        sequence = runCSCAN(
          queue,
          initialHead,
          size
        )
        break

      case "LOOK":
        sequence = runLOOK(
          queue,
          initialHead
        )
        break

      case "C-LOOK":
        sequence = runCLOOK(
          queue,
          initialHead
        )
        break

      default:
        sequence = runFCFS(
          queue,
          initialHead
        )
    }

    const totalMovement =
      calculateMovement(sequence)

    setResult({
      algorithm,
      sequence,
      totalMovement,
      requests: queue,
      averageMovement: (
        totalMovement / queue.length
      ).toFixed(2),
    })

    setActivityLog((prev) => [
      `${algorithm} simulation completed with ${totalMovement} cylinders of head movement.`,
      ...prev,
    ])
  }

  // ============================================================
  // RESET
  // ============================================================

  const resetSimulation = () => {
    setRequests(DEFAULT_REQUESTS)
    setHead(53)
    setDiskSize(200)
    setAlgorithm("FCFS")
    setResult(null)
    setEnterpriseDocuments([])

    setEnterpriseMessage(
      "Import Documents to create simulated disk requests."
    )

    setActivityLog([])
  }

  // ============================================================
  // TABS
  // ============================================================

  const tabs = [
    {
      id: "overview",
      name: "Overview",
      icon: <FaHdd />,
    },
    {
      id: "simulation",
      name: "Simulation",
      icon: <FaPlay />,
    },
    {
      id: "algorithms",
      name: "Algorithms",
      icon: <FaChartLine />,
    },
  ]

  // ============================================================
  // ALGORITHM INFORMATION
  // ============================================================

  const algorithms = [
    {
      name: "FCFS",
      title: "First-Come, First-Served",
      description:
        "Requests are serviced in the same order in which they arrive.",
      icon: <FaRoute />,
    },
    {
      name: "SSTF",
      title: "Shortest Seek Time First",
      description:
        "The request closest to the current disk-head position is serviced first.",
      icon: <FaExchangeAlt />,
    },
    {
      name: "SCAN",
      title: "SCAN / Elevator",
      description:
        "The disk head moves in one direction servicing requests and then reverses direction.",
      icon: <FaHdd />,
    },
    {
      name: "C-SCAN",
      title: "Circular SCAN",
      description:
        "The head services requests in one direction and returns to the beginning before continuing.",
      icon: <FaRedo />,
    },
    {
      name: "LOOK",
      title: "LOOK",
      description:
        "Similar to SCAN, but the head reverses when there are no more requests in the current direction.",
      icon: <FaRoute />,
    },
    {
      name: "C-LOOK",
      title: "Circular LOOK",
      description:
        "Similar to C-SCAN, but the head only moves as far as the last pending request.",
      icon: <FaExchangeAlt />,
    },
  ]

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50/70">
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-blue-50 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-indigo-50 blur-2xl" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <FaServer className="text-[10px]" />
                  Operating Systems
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
                  Storage Management
                </span>

                {enterpriseDocuments.length > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <FaDatabase className="text-[10px]" />
                    Documents Connected
                  </span>
                )}
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Disk Scheduling
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                Simulate disk scheduling algorithms and analyze disk-head
                movement using manual and enterprise document workloads.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:block">
              <FaHdd className="text-3xl text-blue-600" />
            </div>
          </div>
        </section>

        {/* ======================================================
            TABS
        ====================================================== */}

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
                {tab.name}
              </button>
            ))}
          </div>
        </nav>

        {/* ======================================================
            OVERVIEW
        ====================================================== */}

        {activeTab === "overview" && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaHdd className="text-xl" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Disk
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  A disk contains tracks or cylinders where data is stored.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FaExchangeAlt className="text-xl" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Disk Head
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  The disk head moves between requested cylinder positions.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaChartLine className="text-xl" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Seek Movement
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Total head movement is used to evaluate disk scheduling.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <FaPlay className="text-xl text-orange-600" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Simulation
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Compare different disk scheduling strategies interactively.
                </p>
              </div>

            </div>

            {/* ENTERPRISE DOCUMENT CONNECTION */}

            <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FaFileAlt className="text-xl" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900">
                        Enterprise Document Workloads
                      </h2>

                      {enterpriseDocuments.length > 0 && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          {enterpriseDocuments.length} Imported
                        </span>
                      )}
                    </div>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
                      Connect the Documents module with disk scheduling by
                      converting enterprise documents into simulated cylinder
                      requests.
                    </p>

                    <p className="mt-2 text-xs leading-5 text-emerald-700">
                      {enterpriseMessage}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={importDocuments}
                    disabled={loadingDocuments}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {loadingDocuments ? (
                      <FaSyncAlt className="animate-spin" />
                    ) : (
                      <FaFileAlt />
                    )}

                    {loadingDocuments
                      ? "Importing..."
                      : "Import Documents"}
                  </button>

                  {enterpriseDocuments.length > 0 && (
                    <button
                      type="button"
                      onClick={clearEnterpriseDocuments}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                    >
                      <FaTrash />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* CONCEPT */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaHdd />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Disk Scheduling Concept
                  </h2>

                  <p className="text-sm text-gray-500">
                    Understanding disk-head request servicing.
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-gray-600 sm:text-base">
                Disk scheduling determines the order in which pending disk
                requests are serviced. The main objective is to reduce
                disk-head movement and improve overall disk access performance.
              </p>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm leading-6 text-blue-700">
                  <strong>Basic flow:</strong>{" "}
                  Request Queue → Scheduling Algorithm → Disk Head Movement →
                  Requests Serviced
                </p>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================
            SIMULATION
        ====================================================== */}

        {activeTab === "simulation" && (
          <div className="space-y-6">

            {/* CONTROLS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaPlay />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Disk Scheduling Simulator
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Configure the disk request queue and execute a scheduling
                    algorithm.
                  </p>
                </div>
              </div>

              {/* ENTERPRISE IMPORT BAR */}

              <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex min-w-0 items-start gap-3">
                    <FaDatabase className="mt-1 shrink-0 text-emerald-600" />

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-emerald-900">
                        Enterprise Document Integration
                      </p>

                      <p className="mt-1 break-words text-xs leading-5 text-emerald-700">
                        Import documents from the Documents module and use
                        their simulated cylinder positions as disk requests.
                      </p>

                      {enterpriseDocuments.length > 0 && (
                        <p className="mt-1 text-xs font-semibold text-emerald-800">
                          {enterpriseDocuments.length} document workload(s)
                          currently loaded.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={importDocuments}
                      disabled={loadingDocuments}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      {loadingDocuments ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaFileAlt />
                      )}

                      {loadingDocuments
                        ? "Importing..."
                        : "Import Documents"}
                    </button>

                    {enterpriseDocuments.length > 0 && (
                      <button
                        type="button"
                        onClick={clearEnterpriseDocuments}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        <FaTrash />
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* INPUTS */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Request Queue
                  </label>

                  <input
                    type="text"
                    value={requests}
                    onChange={(e) => {
                      setRequests(e.target.value)
                      setResult(null)
                    }}
                    placeholder="98, 183, 37, 122..."
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1.5 text-xs text-gray-500">
                    Enter cylinder numbers separated by commas.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Initial Head
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={head}
                    onChange={(e) => {
                      setHead(e.target.value)
                      setResult(null)
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Disk Size
                  </label>

                  <input
                    type="number"
                    min="2"
                    value={diskSize}
                    onChange={(e) => {
                      setDiskSize(e.target.value)
                      setResult(null)
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Scheduling Algorithm
                  </label>

                  <select
                    value={algorithm}
                    onChange={(e) => {
                      setAlgorithm(e.target.value)
                      setResult(null)
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="FCFS">FCFS</option>
                    <option value="SSTF">SSTF</option>
                    <option value="SCAN">SCAN</option>
                    <option value="C-SCAN">C-SCAN</option>
                    <option value="LOOK">LOOK</option>
                    <option value="C-LOOK">C-LOOK</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <button
                    type="button"
                    onClick={runSimulation}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FaPlay />
                    Run Simulation
                  </button>

                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    <FaRedo />
                    Reset
                  </button>
                </div>
              </div>
            </section>

            {/* ENTERPRISE DOCUMENT TABLE */}

            {enterpriseDocuments.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                <div className="border-b border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                      <FaFileAlt />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                        Imported Document Disk Requests
                      </h2>

                      <p className="text-sm text-gray-500">
                        Enterprise documents represented as simulated cylinder
                        positions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 font-bold text-gray-600">
                          Document
                        </th>

                        <th className="px-5 py-3 font-bold text-gray-600">
                          Category
                        </th>

                        <th className="px-5 py-3 font-bold text-gray-600">
                          Status
                        </th>

                        <th className="px-5 py-3 font-bold text-gray-600">
                          Department
                        </th>

                        <th className="px-5 py-3 font-bold text-gray-600">
                          Cylinder
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {enterpriseDocuments.map((document) => (
                        <tr
                          key={document.id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="max-w-xs px-5 py-4">
                            <p className="break-words font-semibold text-gray-900">
                              {document.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID: {document.documentId}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                              {document.category}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                              {document.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {document.department}
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700">
                              <FaHdd className="text-xs" />
                              {document.cylinder}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ==================================================
                RESULT
            ================================================== */}

            {result && (
              <div className="space-y-6">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Algorithm
                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-600">
                      {result.algorithm}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Total Head Movement
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {result.totalMovement}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      cylinders
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Average Movement
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {result.averageMovement}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      cylinders/request
                    </p>
                  </div>

                </div>

                {/* REQUEST SEQUENCE */}

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FaRoute />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                        Head Movement Sequence
                      </h2>

                      <p className="text-sm text-gray-500">
                        Order in which cylinder positions are visited.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto pb-2">
                    <div className="flex min-w-max items-center gap-2">
                      {result.sequence.map(
                        (position, index) => (
                          <div
                            key={`${position}-${index}`}
                            className="flex items-center"
                          >
                            <div
                              className={`rounded-xl border px-4 py-3 text-sm font-bold shadow-sm ${
                                index === 0
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                              }`}
                            >
                              {position}
                            </div>

                            {index <
                              result.sequence.length - 1 && (
                              <span className="mx-2 text-gray-300">
                                →
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2">
                    <p className="break-words text-sm text-gray-600">
                      <strong className="text-gray-800">
                        Initial Head:
                      </strong>{" "}
                      {result.sequence[0]}
                    </p>

                    <p className="break-words text-sm text-gray-600">
                      <strong className="text-gray-800">
                        Requests:
                      </strong>{" "}
                      {result.requests.join(", ")}
                    </p>
                  </div>
                </section>

                {/* MOVEMENT CALCULATION */}

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <FaCalculator />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                        Movement Calculation
                      </h2>

                      <p className="text-sm text-gray-500">
                        Cylinder-by-cylinder head movement.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {result.sequence
                      .slice(1)
                      .map((position, index) => {
                        const from =
                          result.sequence[index]

                        const movement = Math.abs(
                          position - from
                        )

                        return (
                          <div
                            key={`${from}-${position}-${index}`}
                            className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                          >
                            <span className="text-sm text-gray-700">
                              |{position} − {from}|
                            </span>

                            <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-600">
                              {movement}
                            </span>
                          </div>
                        )
                      })}
                  </div>

                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="font-bold text-blue-800">
                      Total Head Movement ={" "}
                      {result.totalMovement} cylinders
                    </p>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            ALGORITHMS
        ====================================================== */}

        {activeTab === "algorithms" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {algorithms.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
                        {item.name}
                      </span>

                      <FaCircle className="text-[5px] text-gray-300" />

                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Scheduling Algorithm
                      </span>
                    </div>

                    <h3 className="mt-2 break-words font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================
            ACTIVITY LOG
        ====================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FaCheckCircle />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Activity Log
                </h2>

                <p className="text-sm text-gray-500">
                  Recent disk scheduling simulation activity.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActivityLog([])}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Clear Log
            </button>
          </div>

          {activityLog.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <FaChartLine className="mx-auto mb-3 text-2xl text-gray-300" />

              <p className="text-sm text-gray-500">
                No activity yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {activityLog.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5"
                >
                  <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />

                  <span className="break-words text-sm leading-5 text-gray-700">
                    {log}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ======================================================
            EDUCATIONAL NOTE
        ====================================================== */}

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
                This module simulates disk scheduling algorithms using
                cylinder positions. Enterprise documents are converted into
                simulated disk requests for educational analysis. No actual
                files are moved, stored, deleted, or accessed on your
                computer&apos;s physical disk.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default DiskScheduling