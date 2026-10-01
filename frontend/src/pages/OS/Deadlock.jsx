import { useState } from "react"
import {
  FaLock,
  FaProjectDiagram,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaRedo,
  FaPlay,
  FaDatabase,
  FaBalanceScale,
  FaSearch,
  FaHistory,
  FaArrowRight,
  FaServer,
  FaMemory,
  FaFileAlt,
  FaUsers,
  FaTasks,
  FaExchangeAlt,
  FaTimesCircle,
} from "react-icons/fa"

function Deadlock() {
  const [activeTopic, setActiveTopic] = useState("Concept")

  const [processes, setProcesses] = useState([
    {
      id: "P1",
      allocation: [1, 0, 1],
      maximum: [2, 1, 1],
    },
    {
      id: "P2",
      allocation: [1, 1, 0],
      maximum: [1, 2, 2],
    },
    {
      id: "P3",
      allocation: [0, 1, 1],
      maximum: [1, 1, 2],
    },
  ])

  const [available, setAvailable] = useState([1, 1, 1])
  const [requestProcess, setRequestProcess] = useState("P1")
  const [request, setRequest] = useState([0, 0, 0])
  const [safeSequence, setSafeSequence] = useState([])
  const [bankerMessage, setBankerMessage] = useState(
    "Click Check Safe State to run the Banker's Algorithm."
  )

  const [logs, setLogs] = useState([])

  const topics = [
    "Concept",
    "RAG",
    "Prevention",
    "Avoidance",
    "Banker's Algorithm",
    "Detection",
    "Recovery",
  ]

  const topicInfo = {
    Concept: {
      title: "Deadlock Concept",
      description:
        "A deadlock occurs when two or more processes are permanently waiting for resources held by each other.",
    },
    RAG: {
      title: "Resource Allocation Graph",
      description:
        "A Resource Allocation Graph represents processes and resources and helps visualize possible deadlocks.",
    },
    Prevention: {
      title: "Deadlock Prevention",
      description:
        "Deadlock prevention works by ensuring that at least one of the four necessary deadlock conditions cannot occur.",
    },
    Avoidance: {
      title: "Deadlock Avoidance",
      description:
        "Deadlock avoidance checks resource requests before allocation and ensures that the system remains in a safe state.",
    },
    "Banker's Algorithm": {
      title: "Banker's Algorithm",
      description:
        "The Banker's Algorithm checks whether resource allocation can leave the system in a safe state.",
    },
    Detection: {
      title: "Deadlock Detection",
      description:
        "Deadlock detection allows deadlocks to occur and periodically checks whether processes are deadlocked.",
    },
    Recovery: {
      title: "Deadlock Recovery",
      description:
        "After detecting a deadlock, the operating system can recover by terminating processes or preempting resources.",
    },
  }

  /*
   * Enterprise resource layer
   *
   * These are simulated shared resources used by the OS module.
   * They are intentionally local because the current platform does
   * not have a backend Resource collection/API.
   */
  const resources = [
    {
      id: "R1",
      name: "Compute Resources",
      description: "CPU / processing capacity",
      icon: FaServer,
      color: "blue",
    },
    {
      id: "R2",
      name: "Memory Resources",
      description: "RAM / memory allocation",
      icon: FaMemory,
      color: "purple",
    },
    {
      id: "R3",
      name: "File Resources",
      description: "Shared file / storage access",
      icon: FaFileAlt,
      color: "green",
    },
  ]

  const conditions = [
    {
      title: "Mutual Exclusion",
      description:
        "At least one resource must be held in a non-shareable mode.",
    },
    {
      title: "Hold and Wait",
      description:
        "A process holds one or more resources while waiting for additional resources.",
    },
    {
      title: "No Preemption",
      description:
        "A resource cannot be forcibly taken away from the process holding it.",
    },
    {
      title: "Circular Wait",
      description:
        "A circular chain of processes exists where each process waits for a resource held by another process.",
    },
  ]

  const addLog = (message) => {
    setLogs((previous) => [
      `${new Date().toLocaleTimeString()} - ${message}`,
      ...previous,
    ])
  }

  const calculateNeed = (process) => {
    return process.maximum.map(
      (maximumValue, index) => maximumValue - process.allocation[index]
    )
  }

  const getTotalResources = () => {
    return available.map((availableValue, resourceIndex) => {
      return (
        availableValue +
        processes.reduce(
          (total, process) => total + process.allocation[resourceIndex],
          0
        )
      )
    })
  }

  const getAllocatedResources = () => {
    return processes.reduce(
      (totals, process) =>
        totals.map(
          (value, index) => value + process.allocation[index]
        ),
      [0, 0, 0]
    )
  }

  const getResourceUtilization = (resourceIndex) => {
    const totals = getTotalResources()
    const allocated = getAllocatedResources()

    if (totals[resourceIndex] === 0) return 0

    return Math.round(
      (allocated[resourceIndex] / totals[resourceIndex]) * 100
    )
  }

  const checkSafeState = () => {
    let work = [...available]
    const finish = processes.map(() => false)
    const sequence = []

    let found = true

    while (found) {
      found = false

      for (let i = 0; i < processes.length; i++) {
        if (finish[i]) continue

        const need = calculateNeed(processes[i])

        const canRun = need.every(
          (needValue, index) => needValue <= work[index]
        )

        if (canRun) {
          work = work.map(
            (value, index) => value + processes[i].allocation[index]
          )

          finish[i] = true
          sequence.push(processes[i].id)
          found = true
        }
      }
    }

    const safe = finish.every(Boolean)

    if (safe) {
      setSafeSequence(sequence)
      setBankerMessage(
        `System is in a SAFE state. Safe sequence: ${sequence.join(" → ")}`
      )
      addLog(`Safe state confirmed. Sequence: ${sequence.join(" → ")}`)
    } else {
      setSafeSequence([])
      setBankerMessage("System is in an UNSAFE state.")
      addLog("Unsafe state detected.")
    }
  }

  const handleRequest = () => {
    const process = processes.find(
      (currentProcess) => currentProcess.id === requestProcess
    )

    if (!process) return

    const need = calculateNeed(process)

    const exceedsNeed = request.some(
      (value, index) => value > need[index]
    )

    if (exceedsNeed) {
      setBankerMessage(
        `Request denied: ${requestProcess} is requesting more than its remaining need.`
      )
      addLog(`Request denied for ${requestProcess}: exceeds remaining need.`)
      return
    }

    const exceedsAvailable = request.some(
      (value, index) => value > available[index]
    )

    if (exceedsAvailable) {
      setBankerMessage(
        `Request cannot be granted now because sufficient resources are not available.`
      )
      addLog(
        `Request delayed for ${requestProcess}: insufficient resources.`
      )
      return
    }

    const newProcesses = processes.map((currentProcess) => {
      if (currentProcess.id !== requestProcess) {
        return currentProcess
      }

      return {
        ...currentProcess,
        allocation: currentProcess.allocation.map(
          (value, index) => value + request[index]
        ),
      }
    })

    const newAvailable = available.map(
      (value, index) => value - request[index]
    )

    let work = [...newAvailable]
    const finish = newProcesses.map(() => false)
    const sequence = []

    let found = true

    while (found) {
      found = false

      for (let i = 0; i < newProcesses.length; i++) {
        if (finish[i]) continue

        const newNeed = newProcesses[i].maximum.map(
          (maximumValue, index) =>
            maximumValue - newProcesses[i].allocation[index]
        )

        const canRun = newNeed.every(
          (needValue, index) => needValue <= work[index]
        )

        if (canRun) {
          work = work.map(
            (value, index) =>
              value + newProcesses[i].allocation[index]
          )

          finish[i] = true
          sequence.push(newProcesses[i].id)
          found = true
        }
      }
    }

    const safe = finish.every(Boolean)

    if (safe) {
      setProcesses(newProcesses)
      setAvailable(newAvailable)
      setSafeSequence(sequence)
      setBankerMessage(
        `Request granted. System remains SAFE. Sequence: ${sequence.join(
          " → "
        )}`
      )
      addLog(
        `Resource request granted to ${requestProcess}: [${request.join(
          ", "
        )}].`
      )
    } else {
      setBankerMessage(
        `Request denied because it would make the system UNSAFE.`
      )
      addLog(
        `Request denied for ${requestProcess}: unsafe state would result.`
      )
    }
  }

  const resetSimulation = () => {
    setProcesses([
      {
        id: "P1",
        allocation: [1, 0, 1],
        maximum: [2, 1, 1],
      },
      {
        id: "P2",
        allocation: [1, 1, 0],
        maximum: [1, 2, 2],
      },
      {
        id: "P3",
        allocation: [0, 1, 1],
        maximum: [1, 1, 2],
      },
    ])

    setAvailable([1, 1, 1])
    setRequestProcess("P1")
    setRequest([0, 0, 0])
    setSafeSequence([])
    setBankerMessage(
      "Click Check Safe State to run the Banker's Algorithm."
    )
    setLogs([])
  }

  const renderResourcePool = () => {
    const totals = getTotalResources()
    const allocated = getAllocatedResources()

    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FaServer className="text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Enterprise Resource Layer
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Shared Resource Pool
            </h3>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
              The deadlock simulator models shared enterprise resources
              that can be allocated to processes and requested during
              execution.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
            <FaDatabase />
            Simulated Resource Registry
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            const utilization = getResourceUtilization(index)

            return (
              <div
                key={resource.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        index === 0
                          ? "bg-blue-100 text-blue-600"
                          : index === 1
                          ? "bg-purple-100 text-purple-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      <Icon />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        {resource.id}
                      </p>

                      <h4 className="truncate font-semibold text-gray-800">
                        {resource.name}
                      </h4>
                    </div>
                  </div>

                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                    {totals[index]} units
                  </span>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  {resource.description}
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-500">
                      Allocated
                    </span>

                    <span className="font-bold text-gray-700">
                      {allocated[index]} / {totals[index]}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-purple-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${utilization}%` }}
                    />
                  </div>

                  <p className="mt-2 text-right text-xs font-semibold text-gray-400">
                    {utilization}% utilization
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
            <div className="flex items-center gap-3">
              <FaUsers className="text-blue-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Processes
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {processes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
            <div className="flex items-center gap-3">
              <FaTasks className="text-purple-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Allocated Units
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {allocated.reduce((sum, value) => sum + value, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
            <div className="flex items-center gap-3">
              <FaExchangeAlt className="text-green-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Available Units
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {available.reduce((sum, value) => sum + value, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTopicContent = () => {
    if (activeTopic === "Concept") {
      return (
        <div className="space-y-6">
          {renderResourcePool()}

          <div className="border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {conditions.map((condition, index) => (
                <div
                  key={condition.title}
                  className="group rounded-2xl border border-gray-200 bg-gray-50/70 p-5 transition duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800">
                        {condition.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {condition.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <FaExclamationTriangle className="text-red-500" />
                </div>

                <div>
                  <h3 className="font-semibold text-red-700">
                    Important
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    A deadlock occurs only when all four necessary
                    conditions exist at the same time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeTopic === "RAG") {
      return (
        <div className="space-y-6">
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            A Resource Allocation Graph (RAG) contains two types of
            nodes: processes and resources.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50/70 p-6">
            <div className="flex min-w-[620px] items-center justify-center gap-5 py-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-blue-500 bg-blue-100 font-bold text-blue-700 shadow-sm">
                P1
              </div>

              <FaArrowRight className="shrink-0 text-2xl text-gray-400" />

              <div className="flex h-24 w-24 shrink-0 items-center justify-center border-4 border-green-500 bg-green-100 font-bold text-green-700 shadow-sm">
                R1
              </div>

              <FaArrowRight className="shrink-0 text-2xl text-gray-400" />

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-blue-500 bg-blue-100 font-bold text-blue-700 shadow-sm">
                P2
              </div>

              <FaArrowRight className="shrink-0 text-2xl text-gray-400" />

              <div className="flex h-24 w-24 shrink-0 items-center justify-center border-4 border-green-500 bg-green-100 font-bold text-green-700 shadow-sm">
                R2
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <h3 className="font-semibold text-gray-800">
                  Process Node
                </h3>
              </div>

              <p className="text-sm leading-6 text-gray-600">
                Usually represented by a circle.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500" />
                <h3 className="font-semibold text-gray-800">
                  Resource Node
                </h3>
              </div>

              <p className="text-sm leading-6 text-gray-600">
                Usually represented by a rectangle.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <FaDatabase className="mt-1 shrink-0 text-blue-600" />

              <div>
                <h3 className="font-semibold text-blue-900">
                  Enterprise Resource Connection
                </h3>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  In this platform, R1, R2, and R3 represent shared
                  compute, memory, and file resources used by the
                  simulated enterprise processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeTopic === "Prevention") {
      return (
        <div className="space-y-4">
          {[
            "Remove mutual exclusion where possible by making resources shareable.",
            "Prevent hold and wait by requiring processes to request all resources together.",
            "Allow resource preemption when appropriate.",
            "Impose an ordering on resource requests to prevent circular wait.",
          ].map((item, index) => (
            <div
              key={item}
              className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-5 transition hover:bg-white hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                {index + 1}
              </div>

              <p className="self-center text-sm leading-6 text-gray-700 sm:text-base">
                {item}
              </p>
            </div>
          ))}
        </div>
      )
    }

    if (activeTopic === "Avoidance") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <FaCheckCircle className="text-green-600" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Safe State
              </h3>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              A state is safe when the system can allocate resources to
              all processes in some order without causing deadlock.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
                <FaShieldAlt className="text-yellow-600" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Unsafe State
              </h3>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              An unsafe state means the system cannot guarantee that
              all processes can complete without deadlock.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <FaShieldAlt className="mt-1 shrink-0 text-blue-600" />

              <p className="text-sm leading-6 text-blue-700">
                The Banker's Algorithm is a classic deadlock-avoidance
                technique.
              </p>
            </div>
          </div>
        </div>
      )
    }

    if (activeTopic === "Banker's Algorithm") {
      return (
        <div className="space-y-6">
          {/* Enterprise Resource Pool */}
          {renderResourcePool()}

          {/* Available Resources */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <FaDatabase className="text-blue-600" />

              <h3 className="font-semibold text-gray-800">
                Available Resources
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {available.map((value, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-center"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {resources[index].id} —{" "}
                    {resources[index].name}
                  </p>

                  <p className="mt-1 text-3xl font-bold text-blue-600">
                    {value}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    available units
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Banker Table */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <FaBalanceScale className="text-blue-600" />

              <h3 className="font-semibold text-gray-800">
                Process Resource Allocation & Need Matrix
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b border-gray-200 p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Process
                    </th>

                    <th className="border-b border-gray-200 p-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Allocation
                    </th>

                    <th className="border-b border-gray-200 p-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Maximum
                    </th>

                    <th className="border-b border-gray-200 p-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Need
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {processes.map((process, index) => {
                    const need = calculateNeed(process)

                    return (
                      <tr
                        key={process.id}
                        className={
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50/50"
                        }
                      >
                        <td className="border-b border-gray-100 p-4">
                          <span className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
                            <FaProjectDiagram className="text-xs" />
                            {process.id}
                          </span>
                        </td>

                        <td className="border-b border-gray-100 p-4 text-center font-mono text-sm text-gray-700">
                          [{process.allocation.join(", ")}]
                        </td>

                        <td className="border-b border-gray-100 p-4 text-center font-mono text-sm text-gray-700">
                          [{process.maximum.join(", ")}]
                        </td>

                        <td className="border-b border-gray-100 p-4 text-center font-mono text-sm font-semibold text-gray-800">
                          [{need.join(", ")}]
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={checkSafeState}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaPlay />
              Check Safe State
            </button>

            <button
              onClick={resetSimulation}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <FaRedo />
              Reset
            </button>
          </div>

          {/* Banker Status */}
          <div
            className={`rounded-2xl border p-5 ${
              safeSequence.length > 0
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  safeSequence.length > 0
                    ? "bg-green-100"
                    : "bg-blue-100"
                }`}
              >
                {safeSequence.length > 0 ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaShieldAlt className="text-blue-600" />
                )}
              </div>

              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold leading-6 ${
                    safeSequence.length > 0
                      ? "text-green-800"
                      : "text-gray-700"
                  }`}
                >
                  {bankerMessage}
                </p>

                {safeSequence.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {safeSequence.map((processId, index) => (
                      <div
                        key={`${processId}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
                          {processId}
                        </span>

                        {index < safeSequence.length - 1 && (
                          <FaArrowRight className="text-xs text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resource Request */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <FaDatabase className="text-green-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Enterprise Resource Request
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Submit a simulated request for shared enterprise
                  resources and verify whether the resulting state
                  remains safe.
                </p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              {resources.map((resource, index) => {
                const Icon = resource.icon

                return (
                  <div
                    key={resource.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/70 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="text-gray-500" />

                      <span className="text-xs font-semibold text-gray-600">
                        {resource.id}: {resource.name}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Process
                </label>

                <select
                  value={requestProcess}
                  onChange={(event) =>
                    setRequestProcess(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {processes.map((process) => (
                    <option key={process.id} value={process.id}>
                      {process.id}
                    </option>
                  ))}
                </select>
              </div>

              {request.map((value, index) => (
                <div key={index}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {resources[index].id} Request
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(event) => {
                      const newRequest = [...request]

                      newRequest[index] =
                        Math.max(
                          0,
                          Number(event.target.value) || 0
                        )

                      setRequest(newRequest)
                    }}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    {resources[index].name}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleRequest}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <FaCheckCircle />
              Submit Resource Request
            </button>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <div className="flex items-start gap-3">
              <FaBalanceScale className="mt-1 shrink-0 text-purple-600" />

              <div>
                <h3 className="font-semibold text-purple-900">
                  Resource-Aware Banker's Workflow
                </h3>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  The resource pool feeds the allocation model. A
                  process can request compute, memory, or file resources,
                  and the Banker's Algorithm checks whether granting the
                  request keeps the enterprise resource state safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeTopic === "Detection") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <FaSearch className="text-blue-600" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Detection Approach
              </h3>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              The system periodically examines resource allocation and
              outstanding requests to determine whether a deadlock
              exists.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              "Track allocations",
              "Track outstanding requests",
              "Identify circular waiting",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 text-center transition hover:bg-white hover:shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <FaProjectDiagram className="text-blue-600" />
                </div>

                <p className="text-sm font-semibold text-gray-700">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <FaDatabase className="mt-1 shrink-0 text-blue-600" />

              <p className="text-sm leading-6 text-blue-700">
                Detection operates on the same simulated enterprise
                resource allocations represented by R1, R2, and R3.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <FaTimesCircle className="text-red-600" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Process Termination
              </h3>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              One or more processes can be terminated to release the
              resources involved in the deadlock.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
                <FaLock className="text-yellow-600" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Resource Preemption
              </h3>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              Resources can be taken from selected processes and
              reassigned when the system permits it.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="mt-1 shrink-0 text-yellow-600" />

            <p className="text-sm leading-6 text-yellow-800">
              Recovery methods should be selected carefully because
              terminating or preempting resources can affect process
              progress.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50/70 p-4 md:p-6">
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        {/* Header */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gradient-to-r from-red-50 via-white to-blue-50 p-6 md:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm">
                  <FaLock className="text-2xl" />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
                      Operating Systems
                    </span>

                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Deadlock Module
                    </span>

                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      Resource Aware
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                    Deadlock
                  </h1>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500 md:text-base">
                    Learn and simulate deadlock prevention, avoidance,
                    detection, and recovery using shared enterprise
                    resource allocation.
                  </p>
                </div>
              </div>

              <div className="hidden shrink-0 rounded-2xl border border-red-100 bg-white/80 px-4 py-3 sm:block">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-red-500" />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Resource Simulation
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

        {/* Topic Navigation */}
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2 px-1">
            <FaProjectDiagram className="text-sm text-blue-600" />

            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Module Topics
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

        {/* Topic Content */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/60 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <FaProjectDiagram className="text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Current Topic
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 md:text-2xl">
                  {topicInfo[activeTopic].title}
                </h2>

                <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-600">
                  {topicInfo[activeTopic].description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-7">
            {renderTopicContent()}
          </div>
        </div>

        {/* Activity Log */}
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
                  Resource allocation and simulation actions are
                  recorded here.
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
                No activity yet.
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

        {/* Educational Note */}
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <FaShieldAlt className="text-blue-600" />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-blue-900">
                Educational Simulation
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                This module demonstrates operating-system deadlock
                concepts using simulated enterprise resources. It does
                not create or control real operating-system processes,
                CPU resources, memory, or files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Deadlock