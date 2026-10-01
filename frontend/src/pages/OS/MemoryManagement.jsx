import { useState } from "react"
import {
  FaMemory,
  FaPlay,
  FaRedo,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaLayerGroup,
  FaCogs,
  FaHistory,
  FaShieldAlt,
  FaDatabase,
  FaArrowRight,
  FaTasks,
  FaFileAlt,
  FaSyncAlt,
  FaCloudDownloadAlt,
} from "react-icons/fa"

function MemoryManagement() {
  const initialBlocks = [
    { id: 1, size: 100, process: null },
    { id: 2, size: 250, process: null },
    { id: 3, size: 150, process: null },
    { id: 4, size: 300, process: null },
    { id: 5, size: 200, process: null },
  ]

  const initialProcesses = [
    { id: "P1", size: 120, source: "OS Simulation" },
    { id: "P2", size: 80, source: "OS Simulation" },
    { id: "P3", size: 200, source: "OS Simulation" },
    { id: "P4", size: 150, source: "OS Simulation" },
  ]

  const [activeTopic, setActiveTopic] = useState("Overview")

  const [blocks, setBlocks] = useState(initialBlocks)
  const [processes, setProcesses] = useState(initialProcesses)
  const [selectedProcess, setSelectedProcess] = useState("P1")
  const [allocationAlgorithm, setAllocationAlgorithm] =
    useState("First Fit")

  const [allocationMessage, setAllocationMessage] = useState(
    "Select a process and allocation algorithm."
  )

  const [pageSize, setPageSize] = useState(100)
  const [memorySize, setMemorySize] = useState(1000)
  const [logicalAddress, setLogicalAddress] = useState(250)
  const [translationResult, setTranslationResult] = useState(null)

  const [logs, setLogs] = useState([])

  const [enterpriseTasks, setEnterpriseTasks] = useState([])
  const [enterpriseDocuments, setEnterpriseDocuments] = useState([])
  const [loadingEnterpriseData, setLoadingEnterpriseData] =
    useState(false)
  const [enterpriseMessage, setEnterpriseMessage] = useState(
    "Import Tasks or Documents to create enterprise memory workloads."
  )

  const topics = [
    "Overview",
    "Address Binding",
    "Contiguous Allocation",
    "Paging",
    "Segmentation",
  ]

  const addLog = (message) => {
    setLogs((previous) => [
      `${new Date().toLocaleTimeString()} - ${message}`,
      ...previous,
    ])
  }

  const resetAllocation = () => {
    setBlocks(initialBlocks)
    setProcesses(initialProcesses)
    setSelectedProcess("P1")
    setAllocationMessage(
      "Select a process and allocation algorithm."
    )
    addLog("Memory allocation simulation reset.")
  }

  const calculateWorkloadSize = (item, source) => {
    if (source === "Task") {
      if (item.priority === "High") return 200
      if (item.priority === "Medium") return 150
      return 80
    }

    const category = String(item.category || "").toLowerCase()

    if (category.includes("project")) return 200
    if (category.includes("report")) return 150
    if (category.includes("technical")) return 120

    return 100
  }

  const importTasks = async () => {
    setLoadingEnterpriseData(true)

    try {
      const response = await fetch("https://enterprise-collaboration-backend.onrender.com/api/tasks")

      if (!response.ok) {
        throw new Error("Unable to fetch tasks.")
      }

      const data = await response.json()
      const tasks = Array.isArray(data.tasks) ? data.tasks : []

      const workloads = tasks.map((task, index) => ({
        id: `T${index + 1}`,
        size: calculateWorkloadSize(task, "Task"),
        source: "Enterprise Task",
        originalId: task.taskId,
        name: task.title || `Task ${index + 1}`,
        priority: task.priority || "Medium",
        status: task.status || "Pending",
      }))

      setEnterpriseTasks(workloads)

      setProcesses((previous) => {
        const existingIds = new Set(previous.map((item) => item.id))

        const newProcesses = workloads
          .filter((item) => !existingIds.has(item.id))
          .map((item) => ({
            id: item.id,
            size: item.size,
            source: item.source,
            name: item.name,
            priority: item.priority,
            status: item.status,
          }))

        return [...previous, ...newProcesses]
      })

      if (workloads.length > 0) {
        setSelectedProcess(workloads[0].id)
      }

      setEnterpriseMessage(
        `${workloads.length} enterprise task workload${
          workloads.length === 1 ? "" : "s"
        } imported into the memory simulation.`
      )

      addLog(
        `Imported ${workloads.length} enterprise task workload${
          workloads.length === 1 ? "" : "s"
        }.`
      )
    } catch (error) {
      setEnterpriseMessage(
        "Unable to import tasks. Make sure the backend is running."
      )

      addLog("Task memory workload import failed.")
    } finally {
      setLoadingEnterpriseData(false)
    }
  }

  const importDocuments = async () => {
    setLoadingEnterpriseData(true)

    try {
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

      const workloads = documents.map((document, index) => ({
        id: `D${index + 1}`,
        size: calculateWorkloadSize(document, "Document"),
        source: "Enterprise Document",
        originalId: document.documentId,
        name: document.title || `Document ${index + 1}`,
        category: document.category || "General",
        status: document.status || "Active",
      }))

      setEnterpriseDocuments(workloads)

      setProcesses((previous) => {
        const existingIds = new Set(previous.map((item) => item.id))

        const newProcesses = workloads
          .filter((item) => !existingIds.has(item.id))
          .map((item) => ({
            id: item.id,
            size: item.size,
            source: item.source,
            name: item.name,
            category: item.category,
            status: item.status,
          }))

        return [...previous, ...newProcesses]
      })

      if (workloads.length > 0) {
        setSelectedProcess(workloads[0].id)
      }

      setEnterpriseMessage(
        `${workloads.length} enterprise document workload${
          workloads.length === 1 ? "" : "s"
        } imported into the memory simulation.`
      )

      addLog(
        `Imported ${workloads.length} enterprise document workload${
          workloads.length === 1 ? "" : "s"
        }.`
      )
    } catch (error) {
      setEnterpriseMessage(
        "Unable to import documents. Make sure the backend is running."
      )

      addLog("Document memory workload import failed.")
    } finally {
      setLoadingEnterpriseData(false)
    }
  }

  const clearEnterpriseWorkloads = () => {
    const enterpriseIds = new Set(
      [...enterpriseTasks, ...enterpriseDocuments].map(
        (item) => item.id
      )
    )

    setBlocks((previous) =>
      previous.map((block) =>
        enterpriseIds.has(block.process)
          ? { ...block, process: null }
          : block
      )
    )

    setProcesses(initialProcesses)
    setEnterpriseTasks([])
    setEnterpriseDocuments([])
    setSelectedProcess("P1")

    setEnterpriseMessage(
      "Enterprise workloads cleared from the memory simulation."
    )

    addLog("Enterprise task and document workloads cleared.")
  }

  const allocateProcess = () => {
    const process = processes.find(
      (item) => item.id === selectedProcess
    )

    if (!process) return

    if (blocks.some((block) => block.process === process.id)) {
      setAllocationMessage(
        `${process.id} is already allocated in memory.`
      )
      return
    }

    const freeBlocks = blocks
      .map((block, index) => ({
        ...block,
        index,
      }))
      .filter(
        (block) =>
          !block.process && block.size >= process.size
      )

    if (freeBlocks.length === 0) {
      setAllocationMessage(
        `No suitable memory block is available for ${process.id}.`
      )

      addLog(
        `Allocation failed for ${process.id}: insufficient suitable block.`
      )

      return
    }

    let selectedBlock

    if (allocationAlgorithm === "First Fit") {
      selectedBlock = freeBlocks[0]
    }

    if (allocationAlgorithm === "Best Fit") {
      selectedBlock = [...freeBlocks].sort(
        (a, b) => a.size - b.size
      )[0]
    }

    if (allocationAlgorithm === "Worst Fit") {
      selectedBlock = [...freeBlocks].sort(
        (a, b) => b.size - a.size
      )[0]
    }

    const updatedBlocks = blocks.map((block, index) => {
      if (index !== selectedBlock.index) {
        return block
      }

      return {
        ...block,
        process: process.id,
      }
    })

    setBlocks(updatedBlocks)

    const unused =
      selectedBlock.size - process.size

    setAllocationMessage(
      `${process.id} allocated to Block ${selectedBlock.id}. Unused space in block: ${unused} units.`
    )

    addLog(
      `${allocationAlgorithm}: ${process.id} (${process.size} units) allocated to Block ${selectedBlock.id}.`
    )
  }

  const deallocateProcess = (processId) => {
    const exists = blocks.some(
      (block) => block.process === processId
    )

    if (!exists) {
      setAllocationMessage(
        `${processId} is not currently allocated.`
      )
      return
    }

    setBlocks(
      blocks.map((block) =>
        block.process === processId
          ? { ...block, process: null }
          : block
      )
    )

    setAllocationMessage(
      `${processId} has been removed from memory.`
    )

    addLog(`${processId} deallocated from memory.`)
  }

  const calculateFragmentation = () => {
    const freeSpace = blocks
      .filter((block) => !block.process)
      .reduce((total, block) => total + block.size, 0)

    const allocatedSpace = blocks
      .filter((block) => block.process)
      .reduce((total, block) => {
        const process = processes.find(
          (item) => item.id === block.process
        )

        return total + (process ? process.size : 0)
      }, 0)

    const internalFragmentation = blocks
      .filter((block) => block.process)
      .reduce((total, block) => {
        const process = processes.find(
          (item) => item.id === block.process
        )

        if (!process) return total

        return total + (block.size - process.size)
      }, 0)

    return {
      freeSpace,
      allocatedSpace,
      internalFragmentation,
    }
  }

  const translateAddress = () => {
    const numericMemory = Number(memorySize)
    const numericPageSize = Number(pageSize)
    const numericAddress = Number(logicalAddress)

    if (
      numericMemory <= 0 ||
      numericPageSize <= 0 ||
      numericAddress < 0
    ) {
      setTranslationResult({
        success: false,
        message:
          "Enter valid positive memory and page-size values.",
      })
      return
    }

    if (numericAddress >= numericMemory) {
      setTranslationResult({
        success: false,
        message:
          "Logical address is outside the configured logical memory.",
      })
      return
    }

    const numberOfPages = Math.ceil(
      numericMemory / numericPageSize
    )

    const pageNumber = Math.floor(
      numericAddress / numericPageSize
    )

    const offset = numericAddress % numericPageSize

    const frameNumber =
      (pageNumber * 3 + 2) % numberOfPages

    const physicalAddress =
      frameNumber * numericPageSize + offset

    setTranslationResult({
      success: true,
      pageNumber,
      offset,
      frameNumber,
      physicalAddress,
      numberOfPages,
    })

    addLog(
      `Address ${numericAddress} translated: Page ${pageNumber}, Offset ${offset}, Frame ${frameNumber}.`
    )
  }

  const resetPaging = () => {
    setPageSize(100)
    setMemorySize(1000)
    setLogicalAddress(250)
    setTranslationResult(null)
    addLog("Paging simulation reset.")
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            title: "Memory Management",
            text: "Controls allocation and deallocation of memory for processes.",
            icon: FaMemory,
          },
          {
            title: "Address Translation",
            text: "Converts logical addresses into physical addresses.",
            icon: FaExchangeAlt,
          },
          {
            title: "Memory Protection",
            text: "Prevents processes from accessing unauthorized memory.",
            icon: FaShieldAlt,
          },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="group rounded-2xl border border-gray-200 bg-gray-50/70 p-5 transition duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon />
              </div>

              <h3 className="font-semibold text-gray-800">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {item.text}
              </p>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
            <FaDatabase className="text-indigo-600" />
          </div>

          <div>
            <h3 className="font-semibold text-indigo-800">
              Enterprise Memory Connection
            </h3>

            <p className="mt-2 text-sm leading-6 text-indigo-700">
              Tasks and Documents from the enterprise platform can
              be represented as simulated memory workloads. Their
              workload size is mapped to the memory-allocation
              simulation so you can observe how enterprise activity
              affects allocation and fragmentation.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <FaCogs className="text-blue-600" />
          </div>

          <div>
            <h3 className="font-semibold text-blue-800">
              Main responsibilities
            </h3>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-blue-700">
              <li>Keep track of used and free memory.</li>
              <li>Allocate memory to processes.</li>
              <li>Deallocate memory when processes finish.</li>
              <li>Provide address translation and protection.</li>
              <li>Manage fragmentation and efficient memory usage.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEnterpriseWorkloads = () => {
    const allEnterprise = [
      ...enterpriseTasks,
      ...enterpriseDocuments,
    ]

    return (
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
              <FaDatabase className="text-indigo-600" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Enterprise Workloads
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Tasks and Documents are represented as memory
                workloads for the allocation simulation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={importTasks}
              disabled={loadingEnterpriseData}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaTasks />
              Import Tasks
            </button>

            <button
              onClick={importDocuments}
              disabled={loadingEnterpriseData}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaFileAlt />
              Import Documents
            </button>

            <button
              onClick={clearEnterpriseWorkloads}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <FaRedo />
              Clear
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-indigo-100 bg-white px-4 py-3">
          <div className="flex items-start gap-3">
            <FaSyncAlt className="mt-1 shrink-0 text-indigo-500" />

            <p className="text-sm leading-6 text-gray-600">
              {enterpriseMessage}
            </p>
          </div>
        </div>

        {allEnterprise.length === 0 ? (
          <div className="rounded-xl border border-dashed border-indigo-200 bg-white p-7 text-center">
            <FaCloudDownloadAlt className="mx-auto mb-3 text-2xl text-indigo-300" />

            <p className="text-sm font-medium text-gray-500">
              No enterprise workloads imported yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {allEnterprise.map((workload) => (
              <div
                key={`${workload.source}-${workload.id}`}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      {workload.source === "Enterprise Task" ? (
                        <FaTasks className="text-indigo-600" />
                      ) : (
                        <FaFileAlt className="text-gray-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800">
                        {workload.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {workload.id} · {workload.source}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    {workload.size} units
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {workload.priority && (
                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-gray-600">
                      Priority: {workload.priority}
                    </span>
                  )}

                  {workload.category && (
                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-gray-600">
                      {workload.category}
                    </span>
                  )}

                  <span className="rounded-lg bg-gray-100 px-2 py-1 text-gray-600">
                    {workload.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderAddressBinding = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            title: "Compile Time",
            text: "Addresses are determined during compilation when the memory location is known.",
          },
          {
            title: "Load Time",
            text: "Address binding is performed when the program is loaded into memory.",
          },
          {
            title: "Execution Time",
            text: "Addresses can be changed while the program is executing.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaExchangeAlt />
            </div>

            <h3 className="font-semibold text-gray-800">
              {item.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <FaArrowRight className="text-blue-600" />
          </div>

          <h3 className="font-semibold text-gray-800">
            Address Binding Flow
          </h3>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-[650px] items-center justify-center gap-3 text-sm">
            {[
              "Source Program",
              "Compiler",
              "Loader",
              "Physical Memory",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <span className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm">
                  {item}
                </span>

                {index < 3 && (
                  <FaArrowRight className="shrink-0 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderContiguousAllocation = () => {
    const fragmentation = calculateFragmentation()

    return (
      <div className="space-y-6">
        {renderEnterpriseWorkloads()}

        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <FaCogs className="text-blue-600" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Allocation Controls
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Select an OS process or imported enterprise workload
                and allocation strategy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Process / Workload
              </label>

              <select
                value={selectedProcess}
                onChange={(event) =>
                  setSelectedProcess(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {processes.map((process) => (
                  <option key={process.id} value={process.id}>
                    {process.id} — {process.size} units
                    {process.source !== "OS Simulation"
                      ? ` — ${process.source}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Allocation Algorithm
              </label>

              <select
                value={allocationAlgorithm}
                onChange={(event) =>
                  setAllocationAlgorithm(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option>First Fit</option>
                <option>Best Fit</option>
                <option>Worst Fit</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={allocateProcess}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaPlay />
                Allocate Workload
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <FaMemory className="text-gray-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Memory Blocks
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Observe allocation and fragmentation across memory
                  blocks.
                </p>
              </div>
            </div>

            <button
              onClick={resetAllocation}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <FaRedo />
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {blocks.map((block) => {
              const process = processes.find(
                (item) => item.id === block.process
              )

              const usedSize = process
                ? process.size
                : 0

              const usedPercentage = process
                ? Math.min(
                    100,
                    (usedSize / block.size) * 100
                  )
                : 0

              return (
                <div key={block.id}>
                  <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold text-gray-700">
                      Block {block.id}
                    </span>

                    <span className="text-gray-500">
                      {process
                        ? `${process.id} — ${process.size}/${block.size}`
                        : `${block.size} free`}
                    </span>
                  </div>

                  <div className="h-12 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    {process && (
                      <div
                        className={`flex h-full items-center px-4 font-semibold text-white transition-all duration-300 ${
                          process.source === "Enterprise Task"
                            ? "bg-indigo-500"
                            : process.source ===
                              "Enterprise Document"
                            ? "bg-gray-700"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: `${usedPercentage}%`,
                        }}
                      >
                        {process.id}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Allocated Memory", fragmentation.allocatedSpace],
            ["Free Memory", fragmentation.freeSpace],
            [
              "Internal Fragmentation",
              fragmentation.internalFragmentation,
            ],
          ].map(([title, value]) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                {title}
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <FaCheckCircle className="text-blue-600" />
            </div>

            <p className="text-sm leading-6 text-blue-700">
              {allocationMessage}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <FaExchangeAlt className="text-gray-600" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Deallocate Processes
              </h3>

              <p className="text-sm text-gray-500">
                Remove a process or enterprise workload from its
                currently allocated block.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {processes.map((process) => (
              <button
                key={process.id}
                onClick={() => deallocateProcess(process.id)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Free {process.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderPaging = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <FaExchangeAlt className="text-blue-600" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Address Translation Controls
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Configure the logical memory and translate a logical
              address through the simulated page table.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Logical Memory Size
            </label>

            <input
              type="number"
              min="1"
              value={memorySize}
              onChange={(event) =>
                setMemorySize(Number(event.target.value))
              }
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Page Size
            </label>

            <input
              type="number"
              min="1"
              value={pageSize}
              onChange={(event) =>
                setPageSize(Number(event.target.value))
              }
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Logical Address
            </label>

            <input
              type="number"
              min="0"
              value={logicalAddress}
              onChange={(event) =>
                setLogicalAddress(Number(event.target.value))
              }
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={translateAddress}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaExchangeAlt />
          Translate Address
        </button>

        <button
          onClick={resetPaging}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          <FaRedo />
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <FaLayerGroup className="text-blue-600" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Page Table Visualization
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Each page is mapped to a simulated frame.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {Array.from({
            length: Math.min(
              20,
              Math.max(
                1,
                Math.ceil(
                  Number(memorySize) /
                    Math.max(1, Number(pageSize))
                )
              )
            ),
          }).map((_, index) => {
            const frames = Math.max(
              1,
              Math.ceil(
                Number(memorySize) /
                  Math.max(1, Number(pageSize))
              )
            )

            const frame =
              (index * 3 + 2) % frames

            return (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-center transition hover:bg-white hover:shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Page
                </p>

                <p className="mt-1 text-lg font-bold text-gray-800">
                  {index}
                </p>

                <div className="my-2 text-gray-300">
                  ↓
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Frame
                </p>

                <p className="mt-1 text-lg font-bold text-blue-600">
                  {frame}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {translationResult && (
        <div
          className={`rounded-2xl border p-5 ${
            translationResult.success
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          {translationResult.success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  <FaCheckCircle className="text-green-600" />
                </div>

                <h3 className="font-semibold text-green-800">
                  Address Translation Successful
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Page", translationResult.pageNumber],
                  ["Offset", translationResult.offset],
                  ["Frame", translationResult.frameNumber],
                  [
                    "Physical Address",
                    translationResult.physicalAddress,
                  ],
                ].map(([title, value]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-green-100 bg-white p-4"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {title}
                    </span>

                    <p
                      className={`mt-1 text-2xl font-bold ${
                        title === "Physical Address"
                          ? "text-green-700"
                          : "text-gray-800"
                      }`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-red-700">
              <FaExclamationTriangle className="mt-1 shrink-0" />

              <p className="text-sm leading-6">
                {translationResult.message}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderSegmentation = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <FaLayerGroup className="text-blue-600" />
          </div>

          <h3 className="font-semibold text-gray-800">
            Segmentation
          </h3>
        </div>

        <p className="text-sm leading-6 text-gray-600">
          Segmentation divides a program into logical segments such
          as code, data, and stack. Each segment can have a different
          size and base address.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            segment: "Code",
            base: 1000,
            limit: 400,
          },
          {
            segment: "Data",
            base: 2000,
            limit: 300,
          },
          {
            segment: "Stack",
            base: 3000,
            limit: 250,
          },
        ].map((segment) => (
          <div
            key={segment.segment}
            className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 transition hover:bg-white hover:shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-gray-800">
                {segment.segment} Segment
              </h3>

              <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                Segment
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
                <span className="text-gray-500">
                  Base
                </span>

                <strong className="text-gray-800">
                  {segment.base}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
                <span className="text-gray-500">
                  Limit
                </span>

                <strong className="text-gray-800">
                  {segment.limit}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <FaMemory className="mt-1 shrink-0 text-blue-600" />

          <p className="text-sm leading-6 text-blue-700">
            Unlike paging, segmentation follows the logical structure
            of a program and uses variable-sized segments.
          </p>
        </div>
      </div>
    </div>
  )

  const renderTopic = () => {
    if (activeTopic === "Overview") {
      return renderOverview()
    }

    if (activeTopic === "Address Binding") {
      return renderAddressBinding()
    }

    if (activeTopic === "Contiguous Allocation") {
      return renderContiguousAllocation()
    }

    if (activeTopic === "Paging") {
      return renderPaging()
    }

    return renderSegmentation()
  }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50/70 p-4 md:p-6">
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 md:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                  <FaMemory className="text-2xl" />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      Operating Systems
                    </span>

                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Memory Module
                    </span>

                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      Enterprise Connected
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                    Memory Management
                  </h1>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500 md:text-base">
                    Explore memory allocation, fragmentation, paging,
                    address translation, segmentation, and enterprise
                    workload memory simulation.
                  </p>
                </div>
              </div>

              <div className="hidden shrink-0 rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 sm:block">
                <div className="flex items-center gap-2">
                  <FaDatabase className="text-blue-500" />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Simulation
                    </p>

                    <p className="text-sm font-semibold text-gray-700">
                      Interactive
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2 px-1">
            <FaLayerGroup className="text-sm text-blue-600" />

            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Memory Topics
            </span>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                    activeTopic === topic
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/60 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <FaMemory className="text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Current Topic
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 md:text-2xl">
                  {activeTopic}
                </h2>

                <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-600">
                  Interactive concepts and simulations for operating-system
                  memory management.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-7">
            {renderTopic()}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <FaHistory className="text-gray-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Activity Log
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your memory-management simulation actions appear here.
                </p>
              </div>
            </div>

            <button
              onClick={() => setLogs([])}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <FaRedo className="text-xs" />
              Clear Log
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-8 text-center">
              <FaHistory className="mx-auto mb-3 text-2xl text-gray-300" />

              <p className="text-sm font-medium text-gray-400">
                No activity yet. Try one of the simulations above.
              </p>
            </div>
          ) : (
            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-5 text-gray-600 transition hover:bg-white hover:shadow-sm"
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <FaMemory className="text-blue-600" />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-blue-900">
                Educational Simulation
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                These simulations demonstrate memory-management
                concepts using virtual data. Enterprise Tasks and
                Documents are converted into simulated workloads for
                educational purposes. They do not modify the actual
                memory of your computer or operating system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoryManagement