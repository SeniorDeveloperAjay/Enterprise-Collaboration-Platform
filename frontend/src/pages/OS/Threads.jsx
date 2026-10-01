import { useEffect, useMemo, useState } from "react"
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaPlus,
  FaStop,
  FaInfoCircle,
  FaProjectDiagram,
  FaCodeBranch,
  FaTasks,
  FaSyncAlt,
  FaUser,
  FaLayerGroup,
} from "react-icons/fa"

const API_URL = "http://localhost:5000"

const initialThreads = [
  {
    tid: 1,
    name: "Main Thread",
    process: "P1",
    state: "Running",
    priority: 1,
    type: "User Level",
    source: "Manual",
  },
  {
    tid: 2,
    name: "Worker Thread",
    process: "P1",
    state: "Ready",
    priority: 2,
    type: "Kernel Level",
    source: "Manual",
  },
  {
    tid: 3,
    name: "I/O Thread",
    process: "P2",
    state: "Waiting",
    priority: 3,
    type: "User Level",
    source: "Manual",
  },
]

function Threads() {
  const [threads, setThreads] = useState(initialThreads)
  const [nextTid, setNextTid] = useState(4)

  const [tasks, setTasks] = useState([])
  const [taskLoading, setTaskLoading] = useState(false)
  const [taskMessage, setTaskMessage] = useState("")

  const [newThread, setNewThread] = useState({
    name: "",
    process: "P1",
    priority: 2,
    type: "User Level",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setTaskLoading(true)
      setTaskMessage("")

      const response = await fetch(`${API_URL}/api/tasks`)

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()

      setTasks(data.tasks || [])
      setTaskMessage(
        `${(data.tasks || []).length} enterprise task(s) available.`
      )
    } catch (error) {
      console.error("Task fetch error:", error)
      setTaskMessage(
        "Unable to load enterprise tasks. Make sure the backend is running."
      )
    } finally {
      setTaskLoading(false)
    }
  }

  const getNextProcess = (index) => {
    return `P${(index % 7) + 1}`
  }

  const getThreadPriority = (priority) => {
    const value = String(priority || "").toLowerCase()

    if (value === "high") {
      return 1
    }

    if (value === "medium") {
      return 2
    }

    if (value === "low") {
      return 3
    }

    return 2
  }

  const importTasksAsThreads = () => {
    if (tasks.length === 0) {
      setTaskMessage("No enterprise tasks are available to import.")
      return
    }

    const existingTaskIds = new Set(
      threads
        .filter((thread) => thread.source === "Enterprise Task")
        .map((thread) => thread.taskId)
    )

    const availableTasks = tasks.filter(
      (task) => !existingTaskIds.has(task.taskId)
    )

    if (availableTasks.length === 0) {
      setTaskMessage("All available enterprise tasks are already imported.")
      return
    }

    const importedThreads = availableTasks.map((task, index) => {
      const tid = nextTid + index

      return {
        tid,
        name: `Task Thread - ${task.title}`,
        process: getNextProcess(index),
        state: "Ready",
        priority: getThreadPriority(task.priority),
        type: "Kernel Level",
        source: "Enterprise Task",
        taskId: task.taskId,
        taskTitle: task.title,
        assignedTo: task.assignedTo,
        department: task.department,
        taskPriority: task.priority,
        taskStatus: task.status,
      }
    })

    setThreads([...threads, ...importedThreads])
    setNextTid(nextTid + importedThreads.length)

    setTaskMessage(
      `${importedThreads.length} enterprise task(s) imported as threads.`
    )
  }

  const createThread = () => {
    if (!newThread.name.trim()) {
      return
    }

    const thread = {
      tid: nextTid,
      name: newThread.name.trim(),
      process: newThread.process,
      state: "New",
      priority: Number(newThread.priority),
      type: newThread.type,
      source: "Manual",
    }

    setThreads([...threads, thread])
    setNextTid(nextTid + 1)

    setNewThread({
      name: "",
      process: "P1",
      priority: 2,
      type: "User Level",
    })
  }

  const changeState = (tid, state) => {
    setThreads(
      threads.map((thread) =>
        thread.tid === tid
          ? { ...thread, state }
          : thread
      )
    )
  }

  const terminateThread = (tid) => {
    changeState(tid, "Terminated")
  }

  const deleteThread = (tid) => {
    setThreads(
      threads.filter((thread) => thread.tid !== tid)
    )
  }

  const resetThreads = () => {
    setThreads(initialThreads)
    setNextTid(4)

    setNewThread({
      name: "",
      process: "P1",
      priority: 2,
      type: "User Level",
    })

    setTaskMessage("Thread simulation has been reset.")
  }

  const getStateStyle = (state) => {
    switch (state) {
      case "Running":
        return "bg-green-100 text-green-700"

      case "Ready":
        return "bg-blue-100 text-blue-700"

      case "Waiting":
        return "bg-yellow-100 text-yellow-700"

      case "New":
        return "bg-purple-100 text-purple-700"

      case "Terminated":
        return "bg-red-100 text-red-700"

      case "Blocked":
        return "bg-orange-100 text-orange-700"

      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const statistics = useMemo(() => {
    return {
      total: threads.length,
      running: threads.filter(
        (thread) => thread.state === "Running"
      ).length,
      ready: threads.filter(
        (thread) => thread.state === "Ready"
      ).length,
      waiting: threads.filter(
        (thread) => thread.state === "Waiting"
      ).length,
      taskThreads: threads.filter(
        (thread) => thread.source === "Enterprise Task"
      ).length,
    }
  }, [threads])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Threads
          </h1>

          <p className="mt-2 text-gray-500">
            Interactive simulation of threads, thread states,
            thread models and thread management.
          </p>
        </div>

        {/* Introduction */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <FaInfoCircle className="mt-1 text-blue-600" />

            <div>
              <h2 className="font-semibold text-blue-800">
                What is a Thread?
              </h2>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                A thread is the smallest unit of CPU execution
                within a process. Multiple threads can exist
                inside the same process and share resources such
                as code, data and files.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <StatCard
            title="Total Threads"
            value={statistics.total}
            icon={<FaCodeBranch />}
            iconStyle="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Running"
            value={statistics.running}
            icon={<FaPlay />}
            iconStyle="bg-green-50 text-green-600"
          />

          <StatCard
            title="Ready"
            value={statistics.ready}
            icon={<FaLayerGroup />}
            iconStyle="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            title="Waiting"
            value={statistics.waiting}
            icon={<FaPause />}
            iconStyle="bg-yellow-50 text-yellow-600"
          />

          <StatCard
            title="Task Threads"
            value={statistics.taskThreads}
            icon={<FaTasks />}
            iconStyle="bg-purple-50 text-purple-600"
          />

        </div>

        {/* Enterprise Task Integration */}
        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">

          <div className="flex flex-wrap items-start justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <FaTasks />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Enterprise Task Integration
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Convert enterprise tasks into simulated OS threads.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={fetchTasks}
                disabled={taskLoading}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaSyncAlt
                  className={taskLoading ? "animate-spin" : ""}
                />
                Refresh Tasks
              </button>

              <button
                onClick={importTasksAsThreads}
                disabled={tasks.length === 0}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaCodeBranch />
                Import as Threads
              </button>

            </div>
          </div>

          {/* Task Integration Stats */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

            <IntegrationCard
              title="Available Tasks"
              value={tasks.length}
              description="Tasks received from Enterprise Collaboration Platform."
            />

            <IntegrationCard
              title="Imported Threads"
              value={statistics.taskThreads}
              description="Enterprise tasks currently represented as threads."
            />

            <IntegrationCard
              title="Total Threads"
              value={threads.length}
              description="Manual and enterprise task threads."
            />

          </div>

          {taskMessage && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              {taskMessage}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">

                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="p-3">Task ID</th>
                    <th className="p-3">Task</th>
                    <th className="p-3">Assigned To</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task._id || task.taskId}
                      className="border-b last:border-0"
                    >
                      <td className="p-3 font-semibold text-purple-600">
                        {task.taskId}
                      </td>

                      <td className="p-3 font-medium text-gray-800">
                        {task.title}
                      </td>

                      <td className="p-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400" />
                          {task.assignedTo}
                        </div>
                      </td>

                      <td className="p-3 text-gray-600">
                        {task.department}
                      </td>

                      <td className="p-3">
                        <PriorityBadge
                          priority={task.priority}
                        />
                      </td>

                      <td className="p-3">
                        <StatusBadge
                          status={task.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {/* Process vs Thread */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <FaProjectDiagram className="text-blue-600" />

              <h2 className="text-xl font-semibold text-gray-800">
                Process
              </h2>
            </div>

            <ul className="space-y-2 text-sm leading-6 text-gray-600">
              <li>• A process is a program in execution.</li>
              <li>• Has its own address space.</li>
              <li>• Contains one or more threads.</li>
              <li>• Process creation is relatively expensive.</li>
              <li>• Processes communicate using IPC mechanisms.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <FaCodeBranch className="text-green-600" />

              <h2 className="text-xl font-semibold text-gray-800">
                Thread
              </h2>
            </div>

            <ul className="space-y-2 text-sm leading-6 text-gray-600">
              <li>• A thread is a unit of execution.</li>
              <li>• Threads share resources of their process.</li>
              <li>• Each thread has its own stack and registers.</li>
              <li>• Thread creation is generally lightweight.</li>
              <li>• Multiple threads can execute concurrently.</li>
            </ul>
          </div>

        </div>

        {/* Thread Lifecycle */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Thread Lifecycle
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

            <LifecycleCard
              title="New"
              description="Thread is being created."
              color="purple"
            />

            <LifecycleCard
              title="Ready"
              description="Thread is waiting for CPU."
              color="blue"
            />

            <LifecycleCard
              title="Running"
              description="Thread is currently executing."
              color="green"
            />

            <LifecycleCard
              title="Waiting"
              description="Thread waits for an event or resource."
              color="yellow"
            />

            <LifecycleCard
              title="Terminated"
              description="Thread has finished execution."
              color="red"
            />

          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-gray-500">

            <span className="rounded-lg bg-purple-50 px-3 py-2">
              New
            </span>

            <span>→</span>

            <span className="rounded-lg bg-blue-50 px-3 py-2">
              Ready
            </span>

            <span>→</span>

            <span className="rounded-lg bg-green-50 px-3 py-2">
              Running
            </span>

            <span>→</span>

            <span className="rounded-lg bg-yellow-50 px-3 py-2">
              Waiting
            </span>

            <span>→</span>

            <span className="rounded-lg bg-blue-50 px-3 py-2">
              Ready
            </span>

            <span>→</span>

            <span className="rounded-lg bg-red-50 px-3 py-2">
              Terminated
            </span>

          </div>
        </div>

        {/* Thread Models */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Thread Models
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <ModelCard
              title="Many-to-One"
              description="Many user-level threads are mapped to a single kernel thread."
              points={[
                "Simple implementation",
                "Fast thread management",
                "One blocking call can block all threads",
                "Cannot achieve true parallelism",
              ]}
            />

            <ModelCard
              title="One-to-One"
              description="Each user-level thread is mapped to one kernel thread."
              points={[
                "Better concurrency",
                "True parallel execution possible",
                "Higher system overhead",
                "Commonly supported by modern systems",
              ]}
            />

            <ModelCard
              title="Many-to-Many"
              description="Many user-level threads are multiplexed over multiple kernel threads."
              points={[
                "Flexible architecture",
                "Supports concurrency",
                "Can provide parallelism",
                "More complex implementation",
              ]}
            />

          </div>
        </div>

        {/* Create Thread */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Create New Thread
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <div>
              <label className="mb-2 block text-sm text-gray-600">
                Thread Name
              </label>

              <input
                type="text"
                value={newThread.name}
                onChange={(e) =>
                  setNewThread({
                    ...newThread,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Database Worker"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">
                Process
              </label>

              <select
                value={newThread.process}
                onChange={(e) =>
                  setNewThread({
                    ...newThread,
                    process: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
                <option value="P5">P5</option>
                <option value="P6">P6</option>
                <option value="P7">P7</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">
                Priority
              </label>

              <input
                type="number"
                min="1"
                value={newThread.priority}
                onChange={(e) =>
                  setNewThread({
                    ...newThread,
                    priority: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">
                Thread Type
              </label>

              <select
                value={newThread.type}
                onChange={(e) =>
                  setNewThread({
                    ...newThread,
                    type: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="User Level">
                  User Level
                </option>

                <option value="Kernel Level">
                  Kernel Level
                </option>
              </select>
            </div>

          </div>

          <button
            onClick={createThread}
            className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            <FaPlus />
            Create Thread
          </button>

        </div>

        {/* Thread Manager */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Thread Manager
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the simulated thread states.
              </p>
            </div>

            <button
              onClick={resetThreads}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <FaRedo />
              Reset
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1150px] border-collapse">

              <thead>
                <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">

                  <th className="p-3">
                    TID
                  </th>

                  <th className="p-3">
                    Thread Name
                  </th>

                  <th className="p-3">
                    Process
                  </th>

                  <th className="p-3">
                    Type
                  </th>

                  <th className="p-3">
                    Priority
                  </th>

                  <th className="p-3">
                    Source
                  </th>

                  <th className="p-3">
                    Task / Employee
                  </th>

                  <th className="p-3">
                    State
                  </th>

                  <th className="p-3">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {threads.map((thread) => (

                  <tr
                    key={thread.tid}
                    className="border-b last:border-0"
                  >

                    <td className="p-3 font-semibold text-blue-600">
                      T{thread.tid}
                    </td>

                    <td className="p-3 font-medium text-gray-800">
                      {thread.name}
                    </td>

                    <td className="p-3">
                      <span className="rounded-lg bg-gray-50 px-2 py-1 text-sm font-medium">
                        {thread.process}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {thread.type}
                      </span>
                    </td>

                    <td className="p-3">
                      {thread.priority}
                    </td>

                    <td className="p-3">

                      {thread.source === "Enterprise Task" ? (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          Enterprise Task
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          Manual
                        </span>
                      )}

                    </td>

                    <td className="p-3">

                      {thread.source === "Enterprise Task" ? (
                        <div className="max-w-[230px]">

                          <p className="truncate font-medium text-gray-800">
                            {thread.taskTitle}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <FaUser />
                            {thread.assignedTo}
                          </p>

                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          —
                        </span>
                      )}

                    </td>

                    <td className="p-3">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStateStyle(
                          thread.state
                        )}`}
                      >
                        {thread.state}
                      </span>

                    </td>

                    <td className="p-3">

                      <div className="flex flex-wrap gap-2">

                        <button
                          onClick={() =>
                            changeState(
                              thread.tid,
                              "Running"
                            )
                          }
                          disabled={
                            thread.state === "Terminated"
                          }
                          className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Run"
                        >
                          <FaPlay />
                        </button>

                        <button
                          onClick={() =>
                            changeState(
                              thread.tid,
                              "Waiting"
                            )
                          }
                          disabled={
                            thread.state === "Terminated"
                          }
                          className="rounded-lg bg-yellow-50 p-2 text-yellow-600 hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Wait"
                        >
                          <FaPause />
                        </button>

                        <button
                          onClick={() =>
                            changeState(
                              thread.tid,
                              "Ready"
                            )
                          }
                          disabled={
                            thread.state === "Terminated"
                          }
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Ready"
                        >
                          <FaPlay />
                        </button>

                        <button
                          onClick={() =>
                            terminateThread(thread.tid)
                          }
                          disabled={
                            thread.state === "Terminated"
                          }
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Terminate"
                        >
                          <FaStop />
                        </button>

                        <button
                          onClick={() =>
                            deleteThread(thread.tid)
                          }
                          className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {threads.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No threads available.
            </div>
          )}

        </div>

        {/* Thread Control Block */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Thread Control Block (TCB)
          </h2>

          <p className="mb-5 text-sm leading-6 text-gray-600">
            The Thread Control Block stores information required
            by the operating system to manage an individual
            thread.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <TCBCard
              title="Thread ID"
              description="Unique identifier assigned to the thread."
            />

            <TCBCard
              title="Thread State"
              description="Current state such as Ready, Running or Waiting."
            />

            <TCBCard
              title="Program Counter"
              description="Stores the address of the next instruction."
            />

            <TCBCard
              title="CPU Registers"
              description="Stores the thread's current register values."
            />

            <TCBCard
              title="Stack Pointer"
              description="Points to the current thread stack."
            />

            <TCBCard
              title="Priority"
              description="Scheduling priority associated with the thread."
            />

            <TCBCard
              title="Scheduling Information"
              description="Contains information used by the scheduler."
            />

            <TCBCard
              title="Process Association"
              description="Identifies the process to which the thread belongs."
            />

          </div>

        </div>

        {/* Advantages */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Advantages of Multithreading
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <Advantage
              title="Responsiveness"
              text="A program can remain responsive while another thread performs a long-running task."
            />

            <Advantage
              title="Resource Sharing"
              text="Threads within a process can share memory and other process resources."
            />

            <Advantage
              title="Economy"
              text="Creating and managing threads is generally less expensive than creating separate processes."
            />

            <Advantage
              title="Parallelism"
              text="Multiple threads can execute simultaneously on systems with multiple CPU cores."
            />

          </div>

        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Key Concepts
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <div className="rounded-xl bg-gray-50 p-4">
              <strong className="text-gray-800">
                Thread
              </strong>

              <p className="mt-1 text-sm text-gray-600">
                Smallest unit of CPU execution within a process.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <strong className="text-gray-800">
                User-Level Thread
              </strong>

              <p className="mt-1 text-sm text-gray-600">
                Managed primarily by a user-level thread library.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <strong className="text-gray-800">
                Kernel-Level Thread
              </strong>

              <p className="mt-1 text-sm text-gray-600">
                Managed directly by the operating system kernel.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <strong className="text-gray-800">
                Multithreading
              </strong>

              <p className="mt-1 text-sm text-gray-600">
                Multiple threads execute within the same process.
              </p>
            </div>

          </div>

        </div>

        {/* Educational Note */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">

          <div className="flex gap-3">

            <FaInfoCircle className="mt-1 text-amber-600" />

            <div>

              <h2 className="font-semibold text-amber-800">
                Simulation Note
              </h2>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                Threads and enterprise tasks shown on this page
                are simulated for operating-system learning.
                Changing a thread state does not create or control
                an actual operating-system thread.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

/* ---------------- Statistics ---------------- */

function StatCard({
  title,
  value,
  icon,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconStyle}`}>
          {icon}
        </div>

      </div>

    </div>
  )
}

/* ---------------- Integration Card ---------------- */

function IntegrationCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-gray-800">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>

    </div>
  )
}

/* ---------------- Priority Badge ---------------- */

function PriorityBadge({ priority }) {
  const value = String(priority || "").toLowerCase()

  if (value === "high") {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        High
      </span>
    )
  }

  if (value === "low") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Low
      </span>
    )
  }

  return (
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
      Medium
    </span>
  )
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }) {
  const value = String(status || "").toLowerCase()

  if (value === "completed") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Completed
      </span>
    )
  }

  if (value === "in progress") {
    return (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        In Progress
      </span>
    )
  }

  return (
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
      {status || "Pending"}
    </span>
  )
}

/* ---------------- Lifecycle Card ---------------- */

function LifecycleCard({
  title,
  description,
  color,
}) {
  const styles = {
    purple:
      "border-purple-100 bg-purple-50 text-purple-700",

    blue:
      "border-blue-100 bg-blue-50 text-blue-700",

    green:
      "border-green-100 bg-green-50 text-green-700",

    yellow:
      "border-yellow-100 bg-yellow-50 text-yellow-700",

    red:
      "border-red-100 bg-red-50 text-red-700",
  }

  return (
    <div
      className={`rounded-xl border p-4 ${styles[color]}`}
    >
      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5">
        {description}
      </p>
    </div>
  )
}

/* ---------------- Model Card ---------------- */

function ModelCard({
  title,
  description,
  points,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">

      <h3 className="text-lg font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>

      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        {points.map((point, index) => (
          <li key={index}>
            • {point}
          </li>
        ))}
      </ul>

    </div>
  )
}

/* ---------------- TCB Card ---------------- */

function TCBCard({
  title,
  description,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <h3 className="font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-gray-600">
        {description}
      </p>

    </div>
  )
}

/* ---------------- Advantage ---------------- */

function Advantage({
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

      <h3 className="font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-gray-600">
        {text}
      </p>

    </div>
  )
}

export default Threads