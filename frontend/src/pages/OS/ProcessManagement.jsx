import { useEffect, useMemo, useState } from "react"
import {
  FaMicrochip,
  FaProjectDiagram,
  FaClock,
  FaListOl,
  FaPlay,
  FaStop,
  FaSyncAlt,
  FaTasks,
  FaSearch,
  FaLink,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimes,
} from "react-icons/fa"

const API_URL = "http://localhost:5000"

const initialProcesses = [
  {
    pid: 101,
    name: "Chrome",
    state: "Running",
    priority: 5,
    burstTime: 8,
    source: "System",
  },
  {
    pid: 102,
    name: "VS Code",
    state: "Ready",
    priority: 3,
    burstTime: 6,
    source: "System",
  },
  {
    pid: 103,
    name: "Terminal",
    state: "Waiting",
    priority: 4,
    burstTime: 4,
    source: "System",
  },
]

function ProcessManagement() {
  const [processes, setProcesses] = useState(initialProcesses)

  const [processName, setProcessName] = useState("")
  const [burstTime, setBurstTime] = useState("")
  const [priority, setPriority] = useState("5")
  const [nextPid, setNextPid] = useState(104)

  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [taskError, setTaskError] = useState("")

  const [search, setSearch] = useState("")
  const [selectedProcess, setSelectedProcess] = useState(null)

  // Fetch enterprise tasks
  const fetchTasks = async () => {
    setTasksLoading(true)
    setTaskError("")

    try {
      const response = await fetch(`${API_URL}/api/tasks`)

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()

      setTasks(data.tasks || [])
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
      setTaskError(error.message || "Unable to load tasks")
    } finally {
      setTasksLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Create manual process
  const createProcess = (event) => {
    event.preventDefault()

    if (!processName.trim() || !burstTime) {
      return
    }

    const newProcess = {
      pid: nextPid,
      name: processName.trim(),
      state: "Ready",
      priority: Number(priority),
      burstTime: Number(burstTime),
      source: "Manual",
    }

    setProcesses((previous) => [...previous, newProcess])
    setNextPid((previous) => previous + 1)

    setProcessName("")
    setBurstTime("")
    setPriority("5")
  }

  // Import enterprise tasks as simulated processes
  const importTasksAsProcesses = () => {
    if (tasks.length === 0) {
      return
    }

    const existingTaskIds = processes
      .filter((process) => process.taskId)
      .map((process) => process.taskId)

    const newTasks = tasks.filter(
      (task) => !existingTaskIds.includes(task.taskId),
    )

    if (newTasks.length === 0) {
      return
    }

    const importedProcesses = newTasks.map((task, index) => {
      const taskPriority = String(task.priority || "Medium").toLowerCase()

      let numericPriority = 5

      if (taskPriority === "high") {
        numericPriority = 2
      } else if (taskPriority === "medium") {
        numericPriority = 5
      } else if (taskPriority === "low") {
        numericPriority = 8
      }

      const calculatedBurstTime =
        taskPriority === "high"
          ? 4
          : taskPriority === "medium"
            ? 6
            : 8

      return {
        pid: nextPid + index,
        name: task.title || `Task ${task.taskId}`,
        state: "Ready",
        priority: numericPriority,
        burstTime: calculatedBurstTime,
        source: "Enterprise Task",
        taskId: task.taskId,
        assignedTo: task.assignedTo || "Unassigned",
        department: task.department || "N/A",
        taskPriority: task.priority || "Medium",
        taskStatus: task.status || "Pending",
      }
    })

    setProcesses((previous) => [
      ...previous,
      ...importedProcesses,
    ])

    setNextPid((previous) => previous + importedProcesses.length)
  }

  // Change process state
  const changeState = (pid, newState) => {
    setProcesses((previous) =>
      previous.map((process) =>
        process.pid === pid
          ? { ...process, state: newState }
          : process,
      ),
    )
  }

  // Terminate process
  const terminateProcess = (pid) => {
    setProcesses((previous) =>
      previous.map((process) =>
        process.pid === pid
          ? { ...process, state: "Terminated" }
          : process,
      ),
    )
  }

  // Reset simulation
  const resetProcesses = () => {
    setProcesses(initialProcesses)
    setNextPid(104)
    setProcessName("")
    setBurstTime("")
    setPriority("5")
    setSelectedProcess(null)
  }

  // State styling
  const getStateClass = (state) => {
    if (state === "Running") {
      return "bg-green-100 text-green-700"
    }

    if (state === "Ready") {
      return "bg-blue-100 text-blue-700"
    }

    if (state === "Waiting") {
      return "bg-yellow-100 text-yellow-700"
    }

    if (state === "Terminated") {
      return "bg-gray-100 text-gray-600"
    }

    return "bg-gray-100 text-gray-700"
  }

  const getPriorityClass = (priority) => {
    if (priority <= 3) {
      return "bg-red-50 text-red-700"
    }

    if (priority <= 6) {
      return "bg-yellow-50 text-yellow-700"
    }

    return "bg-green-50 text-green-700"
  }

  // Statistics
  const runningProcesses = processes.filter(
    (process) => process.state === "Running",
  ).length

  const readyProcesses = processes.filter(
    (process) => process.state === "Ready",
  ).length

  const waitingProcesses = processes.filter(
    (process) => process.state === "Waiting",
  ).length

  const terminatedProcesses = processes.filter(
    (process) => process.state === "Terminated",
  ).length

  // Search
  const filteredProcesses = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return processes
    }

    return processes.filter((process) =>
      `${process.pid} ${process.name} ${process.state} ${
        process.taskId || ""
      } ${process.assignedTo || ""} ${process.department || ""}`
        .toLowerCase()
        .includes(value),
    )
  }, [processes, search])

  const importedTaskCount = processes.filter(
    (process) => process.source === "Enterprise Task",
  ).length

  return (
    <div className="space-y-8 pb-8">

      {/* Page Header */}
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
          OS MANAGEMENT / UNIT 2
        </p>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Process Management
            </h1>

            <p className="mt-2 max-w-3xl leading-7 text-slate-500">
              Explore processes, process states, PCB concepts,
              scheduling and context switching through an interactive
              process manager connected with enterprise tasks.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700">
            <FaLink />
            Task Integration Enabled
          </div>
        </div>
      </div>

      {/* Integration Explanation */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <FaTasks />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-800">
              Enterprise Tasks as Processes
            </h2>

            <p className="mt-2 leading-7 text-slate-600">
              In this educational integration, tasks from the
              collaboration platform can be represented as simulated
              processes. Task priority is mapped to process priority,
              while the process manager demonstrates states such as
              Ready, Running and Waiting.
            </p>

            <p className="mt-2 text-sm font-medium text-blue-700">
              This is a simulation and does not create or control
              real operating-system processes.
            </p>
          </div>
        </div>
      </div>

      {/* Process Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Processes
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {processes.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FaMicrochip />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Running
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {runningProcesses}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <FaPlay />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Ready
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {readyProcesses}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FaListOl />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Waiting
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {waitingProcesses}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <FaHourglassHalf />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Task Processes
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-800">
                {importedTaskCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <FaTasks />
            </div>
          </div>
        </div>

      </div>

      {/* Process Introduction */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
            <FaMicrochip />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              What is a Process?
            </h2>

            <p className="mt-2 leading-7 text-slate-600">
              A process is a program in execution. It contains the
              program code, current execution state, allocated
              resources and other information required by the
              operating system to manage its execution.
            </p>
          </div>
        </div>
      </div>

      {/* Process States */}
      <div>
        <h2 className="mb-1 text-xl font-semibold text-slate-800">
          Process States
        </h2>

        <p className="mb-4 text-sm text-slate-500">
          A process moves through different states during its
          lifetime.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
            <FaPlay className="mx-auto mb-3 text-xl text-blue-600" />

            <h3 className="font-semibold text-blue-800">
              New
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Process is being created.
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
            <FaListOl className="mx-auto mb-3 text-xl text-blue-600" />

            <h3 className="font-semibold text-blue-800">
              Ready
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Process is waiting for CPU allocation.
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-green-50 p-5 text-center">
            <FaMicrochip className="mx-auto mb-3 text-xl text-green-600" />

            <h3 className="font-semibold text-green-800">
              Running
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Process is currently executing.
            </p>
          </div>

          <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-5 text-center">
            <FaClock className="mx-auto mb-3 text-xl text-yellow-600" />

            <h3 className="font-semibold text-yellow-800">
              Waiting
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Process is waiting for an event or resource.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
            <FaStop className="mx-auto mb-3 text-xl text-slate-600" />

            <h3 className="font-semibold text-slate-800">
              Terminated
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Process has completed execution.
            </p>
          </div>

        </div>
      </div>

      {/* Process State Flow */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Process State Transition
        </h2>

        <p className="mb-6 mt-2 text-sm text-slate-500">
          A simplified representation of common process state
          transitions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">

          <span className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-700">
            New
          </span>

          <span className="text-xl text-slate-400">
            →
          </span>

          <span className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 font-semibold text-blue-700">
            Ready
          </span>

          <span className="text-xl text-slate-400">
            →
          </span>

          <span className="rounded-xl border border-green-100 bg-green-50 px-5 py-3 font-semibold text-green-700">
            Running
          </span>

          <span className="text-xl text-slate-400">
            →
          </span>

          <span className="rounded-xl border border-yellow-100 bg-yellow-50 px-5 py-3 font-semibold text-yellow-700">
            Waiting
          </span>

          <span className="text-xl text-slate-400">
            →
          </span>

          <span className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 font-semibold text-blue-700">
            Ready
          </span>

          <span className="text-xl text-slate-400">
            →
          </span>

          <span className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-700">
            Terminated
          </span>

        </div>
      </div>

      {/* PCB */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
            <FaProjectDiagram />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Process Control Block (PCB)
            </h2>

            <p className="mt-2 leading-6 text-slate-500">
              The Process Control Block is a data structure maintained
              by the operating system to store important information
              about a process.
            </p>
          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {[
            [
              "Process ID",
              "Unique identifier assigned to the process.",
            ],
            [
              "Process State",
              "Current state such as ready, running or waiting.",
            ],
            [
              "Program Counter",
              "Indicates the next instruction to be executed.",
            ],
            [
              "CPU Registers",
              "Stores processor-related information for the process.",
            ],
            [
              "Scheduling Information",
              "Contains information used by the scheduler.",
            ],
            [
              "Memory Information",
              "Contains information about memory allocated to the process.",
            ],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <h3 className="font-semibold text-slate-800">
                {title}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* Enterprise Task Integration */}
      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-purple-600 shadow-sm">
              <FaTasks />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-purple-800">
                Integrate Enterprise Tasks
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                Load tasks from the Enterprise Collaboration Platform
                and represent them as simulated OS processes.
              </p>

              {tasks.length > 0 && (
                <p className="mt-2 text-sm font-medium text-purple-700">
                  {tasks.length} task{tasks.length !== 1 ? "s" : ""} available
                  from the collaboration platform.
                </p>
              )}

              {taskError && (
                <p className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <FaExclamationTriangle />
                  {taskError}
                </p>
              )}
            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={fetchTasks}
              disabled={tasksLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSyncAlt
                className={tasksLoading ? "animate-spin" : ""}
              />
              Refresh Tasks
            </button>

            <button
              onClick={importTasksAsProcesses}
              disabled={tasksLoading || tasks.length === 0}
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaLink />
              Import as Processes
            </button>

          </div>

        </div>
      </div>

      {/* Interactive Process Manager */}
      <div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Interactive Process Manager
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage simulated processes. This simulation
            does not create real processes on your computer.
          </p>
        </div>

        {/* Create Process */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-800">
              Create New Process
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manually create a process for the OS scheduling
              simulations.
            </p>
          </div>

          <form
            onSubmit={createProcess}
            className="grid grid-cols-1 gap-4 md:grid-cols-4"
          >

            <input
              type="text"
              value={processName}
              onChange={(event) =>
                setProcessName(event.target.value)
              }
              placeholder="Process name"
              className="rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

            <input
              type="number"
              min="1"
              value={burstTime}
              onChange={(event) =>
                setBurstTime(event.target.value)
              }
              placeholder="Burst time"
              className="rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="1">Priority 1</option>
              <option value="2">Priority 2</option>
              <option value="3">Priority 3</option>
              <option value="4">Priority 4</option>
              <option value="5">Priority 5</option>
              <option value="6">Priority 6</option>
              <option value="7">Priority 7</option>
              <option value="8">Priority 8</option>
              <option value="9">Priority 9</option>
              <option value="10">Priority 10</option>
            </select>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <FaPlusIcon />
              Create Process
            </button>

          </form>
        </div>

        {/* Process Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h3 className="font-semibold text-slate-800">
                Process Table
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Simulated process control information
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search processes..."
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
                />
              </div>

              <button
                onClick={resetProcesses}
                className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <FaSyncAlt />
                Reset
              </button>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-sm">

              <thead className="bg-slate-50">

                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-slate-700">
                    PID
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-700">
                    Process
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-700">
                    Source
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-700">
                    State
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-700">
                    Priority
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-700">
                    Burst
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredProcesses.map((process) => (
                  <tr
                    key={process.pid}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {process.pid}
                    </td>

                    <td className="px-5 py-4">

                      <button
                        onClick={() => setSelectedProcess(process)}
                        className="text-left"
                      >
                        <p className="font-semibold text-slate-800 hover:text-blue-600">
                          {process.name}
                        </p>

                        {process.taskId && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            Task: {process.taskId}
                          </p>
                        )}
                      </button>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          process.source === "Enterprise Task"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {process.source}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStateClass(
                          process.state,
                        )}`}
                      >
                        {process.state}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClass(
                          process.priority,
                        )}`}
                      >
                        {process.priority}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {process.burstTime}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex flex-wrap gap-2">

                        <button
                          onClick={() =>
                            changeState(process.pid, "Running")
                          }
                          disabled={process.state === "Terminated"}
                          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Run
                        </button>

                        <button
                          onClick={() =>
                            changeState(process.pid, "Waiting")
                          }
                          disabled={process.state === "Terminated"}
                          className="rounded-md bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Wait
                        </button>

                        <button
                          onClick={() =>
                            changeState(process.pid, "Ready")
                          }
                          disabled={process.state === "Terminated"}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Ready
                        </button>

                        <button
                          onClick={() =>
                            terminateProcess(process.pid)
                          }
                          disabled={process.state === "Terminated"}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Terminate
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

                {filteredProcesses.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      <FaMicrochip className="mx-auto text-2xl text-slate-300" />

                      <p className="mt-3 font-medium">
                        No processes found.
                      </p>

                      <p className="mt-1 text-xs">
                        Try a different search term.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </div>
      </div>

      {/* Process Details Modal */}
      {selectedProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-100 p-6">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Process Control Block
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {selectedProcess.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProcess(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <FaTimes />
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4 p-6">

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Process ID
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {selectedProcess.pid}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  State
                </p>

                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getStateClass(
                    selectedProcess.state,
                  )}`}
                >
                  {selectedProcess.state}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Priority
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {selectedProcess.priority}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Burst Time
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {selectedProcess.burstTime}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Source
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {selectedProcess.source}
                </p>
              </div>

              {selectedProcess.taskId && (
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-xs text-purple-500">
                    Enterprise Task
                  </p>

                  <p className="mt-1 font-semibold text-purple-800">
                    {selectedProcess.taskId}
                  </p>
                </div>
              )}

              {selectedProcess.assignedTo && (
                <div className="col-span-2 rounded-lg bg-slate-50 p-4">
                  <p className="flex items-center gap-2 text-xs text-slate-400">
                    <FaUser />
                    Assigned To
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedProcess.assignedTo}
                  </p>
                </div>
              )}

            </div>

            <div className="flex justify-end border-t border-slate-100 p-6">

              <button
                onClick={() => setSelectedProcess(null)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Scheduler Information */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

        <div className="flex items-start gap-4">

          <FaListOl className="mt-1 text-xl text-blue-600" />

          <div>
            <h2 className="text-xl font-semibold text-blue-800">
              Process Scheduling
            </h2>

            <p className="mt-2 leading-6 text-slate-700">
              When multiple processes are ready to execute, the
              operating system uses a CPU scheduling algorithm to
              decide which process should receive CPU time. The
              processes created or imported here can later be used
              by the CPU Scheduling module for scheduling
              demonstrations.
            </p>

          </div>

        </div>
      </div>

    </div>
  )
}

// Small helper component for the create button
function FaPlusIcon() {
  return <span className="text-base">+</span>
}

export default ProcessManagement