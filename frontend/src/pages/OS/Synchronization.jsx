import { useEffect, useState } from "react"
import {
  FaInfoCircle,
  FaLock,
  FaPlay,
  FaRedo,
  FaPlus,
  FaMinus,
  FaUsers,
  FaUtensils,
  FaBook,
  FaCut,
  FaShieldAlt,
  FaCodeBranch,
  FaLayerGroup,
  FaTasks,
  FaFileAlt,
  FaSyncAlt,
} from "react-icons/fa"

function Synchronization() {
  const [strictTurn, setStrictTurn] = useState(1)

  const [peterson, setPeterson] = useState({
    turn: 0,
    flag0: false,
    flag1: false,
    active: null,
  })

  const [bakery, setBakery] = useState([
    { id: 1, choosing: false, number: 0, state: "Ready" },
    { id: 2, choosing: false, number: 0, state: "Ready" },
    { id: 3, choosing: false, number: 0, state: "Ready" },
  ])

  const [lock, setLock] = useState(false)
  const [binarySemaphore, setBinarySemaphore] = useState(1)
  const [countingSemaphore, setCountingSemaphore] = useState(3)
  const [buffer, setBuffer] = useState([])
  const [nextItem, setNextItem] = useState(1)

  const [philosophers, setPhilosophers] = useState([
    "Thinking",
    "Thinking",
    "Thinking",
    "Thinking",
    "Thinking",
  ])

  const [readers, setReaders] = useState(0)
  const [writerActive, setWriterActive] = useState(false)
  const [waitingCustomers, setWaitingCustomers] = useState(0)
  const [barberState, setBarberState] = useState("Sleeping")
  const [activity, setActivity] = useState([])

  /* =========================================================
     COLLABORATION INTEGRATION
     ========================================================= */

  const [collaborationResources, setCollaborationResources] =
    useState([])

  const [selectedResource, setSelectedResource] = useState(null)

  const [resourceReaders, setResourceReaders] = useState(0)
  const [resourceWriter, setResourceWriter] = useState(false)

  const [resourceMessage, setResourceMessage] = useState(
    "Select a collaboration resource to simulate synchronized access."
  )

  const [resourceLoading, setResourceLoading] = useState(true)

  /* =========================================================
     ACTIVITY LOG
     ========================================================= */

  const addActivity = (message) => {
    setActivity((prev) => [
      ...prev.slice(-7),
      {
        id: Date.now() + Math.random(),
        message,
      },
    ])
  }

  /* =========================================================
     LOAD COLLABORATION DATA
     ========================================================= */

  useEffect(() => {
    const loadCollaborationResources = async () => {
      setResourceLoading(true)

      try {
        const [tasksResponse, documentsResponse] =
          await Promise.all([
            fetch("https://enterprise-collaboration-backend.onrender.com000/api/tasks"),
            fetch("https://enterprise-collaboration-backend.onrender.com/api/documents"),
          ])

        const resources = []

        if (tasksResponse.ok) {
          const taskData = await tasksResponse.json()

          const tasks = Array.isArray(taskData)
            ? taskData
            : taskData.tasks || []

          tasks.slice(0, 5).forEach((task) => {
            resources.push({
              id: `task-${task.taskId || task._id}`,
              type: "Task",
              name:
                task.title ||
                task.taskId ||
                "Enterprise Task",
              owner:
                task.assignedTo ||
                task.department ||
                "Collaboration Team",
              status: task.status || "Pending",
              icon: "task",
            })
          })
        }

        if (documentsResponse.ok) {
          const documentData =
            await documentsResponse.json()

          const documents = Array.isArray(documentData)
            ? documentData
            : documentData.documents || []

          documents.slice(0, 5).forEach((document) => {
            resources.push({
              id: `document-${
                document.documentId || document._id
              }`,
              type: "Document",
              name:
                document.title ||
                document.documentId ||
                "Shared Document",
              owner:
                document.uploadedBy ||
                document.department ||
                "Collaboration Team",
              status: document.status || "Available",
              icon: "document",
            })
          })
        }

        setCollaborationResources(resources)

        if (resources.length > 0) {
          setSelectedResource(resources[0])
        } else {
          setSelectedResource(null)
        }
      } catch (error) {
        console.error(
          "Failed to load collaboration resources:",
          error
        )

        setCollaborationResources([])
        setSelectedResource(null)
      } finally {
        setResourceLoading(false)
      }
    }

    loadCollaborationResources()
  }, [])

  /* =========================================================
     COLLABORATION RESOURCE SYNCHRONIZATION
     ========================================================= */

  const selectCollaborationResource = (resource) => {
    setSelectedResource(resource)

    setResourceReaders(0)
    setResourceWriter(false)

    setResourceMessage(
      `${resource.type} "${resource.name}" selected for synchronized access.`
    )

    addActivity(
      `Selected ${resource.type.toLowerCase()} "${resource.name}" as a shared collaboration resource.`
    )
  }

  const acquireResourceRead = () => {
    if (!selectedResource) {
      setResourceMessage(
        "Select a collaboration resource first."
      )
      return
    }

    if (resourceWriter) {
      setResourceMessage(
        "Read request blocked because a writer currently owns the resource."
      )

      addActivity(
        `Reader blocked from "${selectedResource.name}" because a writer is active.`
      )

      return
    }

    const newReaderCount = resourceReaders + 1

    setResourceReaders(newReaderCount)

    setResourceMessage(
      `${newReaderCount} reader(s) currently accessing the resource.`
    )

    addActivity(
      `Reader entered "${selectedResource.name}". Active readers: ${newReaderCount}.`
    )
  }

  const releaseResourceRead = () => {
    if (resourceReaders === 0) {
      setResourceMessage("No active readers to release.")
      return
    }

    const newReaderCount = resourceReaders - 1

    setResourceReaders(newReaderCount)

    setResourceMessage(
      `${newReaderCount} reader(s) currently accessing the resource.`
    )

    addActivity(
      `Reader left "${selectedResource.name}". Active readers: ${newReaderCount}.`
    )
  }

  const acquireResourceWrite = () => {
    if (!selectedResource) {
      setResourceMessage(
        "Select a collaboration resource first."
      )
      return
    }

    if (resourceWriter || resourceReaders > 0) {
      setResourceMessage(
        "Write request blocked because the resource is currently being accessed."
      )

      addActivity(
        `Writer blocked from "${selectedResource.name}" because readers or another writer are active.`
      )

      return
    }

    setResourceWriter(true)

    setResourceMessage(
      `Writer acquired exclusive access to "${selectedResource.name}".`
    )

    addActivity(
      `Writer acquired exclusive access to "${selectedResource.name}".`
    )
  }

  const releaseResourceWrite = () => {
    if (!resourceWriter) {
      setResourceMessage("No active writer to release.")
      return
    }

    setResourceWriter(false)

    setResourceMessage(
      `Writer released "${selectedResource.name}".`
    )

    addActivity(
      `Writer released "${selectedResource.name}".`
    )
  }

  const resetCollaborationSync = () => {
    setResourceReaders(0)
    setResourceWriter(false)

    setResourceMessage(
      selectedResource
        ? `"${selectedResource.name}" synchronization state has been reset.`
        : "Collaboration synchronization state has been reset."
    )

    addActivity(
      "Collaboration synchronization state was reset."
    )
  }

  /* =========================================================
     RESET ALL
     ========================================================= */

  const resetAll = () => {
    setStrictTurn(1)

    setPeterson({
      turn: 0,
      flag0: false,
      flag1: false,
      active: null,
    })

    setBakery([
      { id: 1, choosing: false, number: 0, state: "Ready" },
      { id: 2, choosing: false, number: 0, state: "Ready" },
      { id: 3, choosing: false, number: 0, state: "Ready" },
    ])

    setLock(false)
    setBinarySemaphore(1)
    setCountingSemaphore(3)
    setBuffer([])
    setNextItem(1)

    setPhilosophers([
      "Thinking",
      "Thinking",
      "Thinking",
      "Thinking",
      "Thinking",
    ])

    setReaders(0)
    setWriterActive(false)
    setWaitingCustomers(0)
    setBarberState("Sleeping")

    setResourceReaders(0)
    setResourceWriter(false)

    setResourceMessage(
      selectedResource
        ? `Select an operation for "${selectedResource.name}".`
        : "Select a collaboration resource."
    )

    setActivity([])
  }

  /* =========================================================
     STRICT ALTERNATION
     ========================================================= */

  const runStrictAlternation = (process) => {
    if (process !== strictTurn) {
      addActivity(
        `P${process} must wait because it is P${strictTurn}'s turn.`
      )
      return
    }

    addActivity(
      `P${process} entered the critical section using strict alternation.`
    )

    setStrictTurn(process === 1 ? 2 : 1)
  }

  /* =========================================================
     PETERSON
     ========================================================= */

  const enterPeterson = (process) => {
    if (process === 0) {
      if (peterson.active !== null) {
        addActivity(
          "P0 must wait because the critical section is occupied."
        )
        return
      }

      setPeterson({
        turn: 1,
        flag0: true,
        flag1: peterson.flag1,
        active: 0,
      })

      addActivity(
        "P0 entered the critical section using Peterson's Algorithm."
      )
    } else {
      if (peterson.active !== null) {
        addActivity(
          "P1 must wait because the critical section is occupied."
        )
        return
      }

      setPeterson({
        turn: 0,
        flag0: peterson.flag0,
        flag1: true,
        active: 1,
      })

      addActivity(
        "P1 entered the critical section using Peterson's Algorithm."
      )
    }
  }

  const leavePeterson = () => {
    if (peterson.active === null) {
      return
    }

    const process = peterson.active

    setPeterson({
      turn: peterson.turn,
      flag0: false,
      flag1: false,
      active: null,
    })

    addActivity(`P${process} left the critical section.`)
  }

  /* =========================================================
     LAMPORT BAKERY
     ========================================================= */

  const chooseBakeryNumber = (id) => {
    const highest = Math.max(
      0,
      ...bakery.map((process) => process.number)
    )

    setBakery(
      bakery.map((process) =>
        process.id === id
          ? {
              ...process,
              choosing: false,
              number: highest + 1,
              state: "Waiting",
            }
          : process
      )
    )

    addActivity(
      `P${id} selected bakery ticket number ${highest + 1}.`
    )
  }

  const enterBakery = (id) => {
    const process = bakery.find((item) => item.id === id)

    if (!process || process.number === 0) {
      addActivity(`P${id} must first take a bakery ticket.`)
      return
    }

    const active = bakery.find(
      (item) => item.state === "Critical Section"
    )

    if (active) {
      addActivity(
        `P${id} must wait because P${active.id} is in the critical section.`
      )
      return
    }

    setBakery(
      bakery.map((item) =>
        item.id === id
          ? { ...item, state: "Critical Section" }
          : item
      )
    )

    addActivity(
      `P${id} entered the critical section using ticket ${process.number}.`
    )
  }

  const leaveBakery = (id) => {
    setBakery(
      bakery.map((item) =>
        item.id === id
          ? {
              ...item,
              number: 0,
              state: "Ready",
            }
          : item
      )
    )

    addActivity(`P${id} left the critical section.`)
  }

  /* =========================================================
     TEST AND SET
     ========================================================= */

  const testAndSet = (process) => {
    if (lock) {
      addActivity(
        `P${process} found the lock busy and must wait.`
      )
      return
    }

    setLock(true)

    addActivity(
      `P${process} acquired the Test-and-Set lock.`
    )
  }

  const releaseLock = () => {
    setLock(false)
    addActivity("Test-and-Set lock released.")
  }

  /* =========================================================
     BINARY SEMAPHORE
     ========================================================= */

  const binaryWait = () => {
    if (binarySemaphore === 0) {
      addActivity(
        "Binary semaphore is unavailable. Process must wait."
      )
      return
    }

    setBinarySemaphore(0)
    addActivity("wait() executed. Binary semaphore acquired.")
  }

  const binarySignal = () => {
    setBinarySemaphore(1)
    addActivity("signal() executed. Binary semaphore released.")
  }

  /* =========================================================
     COUNTING SEMAPHORE
     ========================================================= */

  const countingWait = () => {
    if (countingSemaphore === 0) {
      addActivity(
        "Counting semaphore has no available permits."
      )
      return
    }

    setCountingSemaphore(countingSemaphore - 1)

    addActivity(
      `wait() executed. Available permits: ${
        countingSemaphore - 1
      }.`
    )
  }

  const countingSignal = () => {
    setCountingSemaphore(countingSemaphore + 1)

    addActivity(
      `signal() executed. Available permits: ${
        countingSemaphore + 1
      }.`
    )
  }

  /* =========================================================
     PRODUCER CONSUMER
     ========================================================= */

  const produceItem = () => {
    if (buffer.length >= 5) {
      addActivity("Buffer is full. Producer must wait.")
      return
    }

    const item = `Item ${nextItem}`

    setBuffer([...buffer, item])
    setNextItem(nextItem + 1)

    addActivity(`${item} produced and added to the buffer.`)
  }

  const consumeItem = () => {
    if (buffer.length === 0) {
      addActivity("Buffer is empty. Consumer must wait.")
      return
    }

    const item = buffer[0]

    setBuffer(buffer.slice(1))

    addActivity(`${item} consumed from the buffer.`)
  }

  /* =========================================================
     DINING PHILOSOPHERS
     ========================================================= */

  const philosopherAction = (index) => {
    const current = philosophers[index]

    if (current === "Thinking") {
      const updated = [...philosophers]
      updated[index] = "Hungry"
      setPhilosophers(updated)

      addActivity(
        `Philosopher ${index + 1} became hungry.`
      )
    } else if (current === "Hungry") {
      const updated = [...philosophers]
      updated[index] = "Eating"
      setPhilosophers(updated)

      addActivity(
        `Philosopher ${index + 1} acquired forks and is eating.`
      )
    } else {
      const updated = [...philosophers]
      updated[index] = "Thinking"
      setPhilosophers(updated)

      addActivity(
        `Philosopher ${index + 1} released forks and is thinking.`
      )
    }
  }

  /* =========================================================
     READERS WRITERS
     ========================================================= */

  const startReader = () => {
    if (writerActive) {
      addActivity(
        "Reader must wait because a writer is active."
      )
      return
    }

    setReaders(readers + 1)
    addActivity(
      `Reader entered. Active readers: ${readers + 1}.`
    )
  }

  const stopReader = () => {
    if (readers === 0) {
      return
    }

    setReaders(readers - 1)
    addActivity(
      `Reader left. Active readers: ${readers - 1}.`
    )
  }

  const startWriter = () => {
    if (writerActive || readers > 0) {
      addActivity(
        "Writer must wait because readers or another writer are active."
      )
      return
    }

    setWriterActive(true)
    addActivity("Writer entered the shared resource.")
  }

  const stopWriter = () => {
    setWriterActive(false)
    addActivity("Writer left the shared resource.")
  }

  /* =========================================================
     SLEEPING BARBER
     ========================================================= */

  const addCustomer = () => {
    if (waitingCustomers >= 5) {
      addActivity(
        "Waiting room is full. New customer must leave."
      )
      return
    }

    if (barberState === "Sleeping") {
      setBarberState("Cutting Hair")
      addActivity(
        "Customer arrived and woke the sleeping barber."
      )
      return
    }

    setWaitingCustomers(waitingCustomers + 1)

    addActivity(
      `Customer joined the waiting room. Waiting customers: ${
        waitingCustomers + 1
      }.`
    )
  }

  const serveCustomer = () => {
    if (waitingCustomers === 0) {
      setBarberState("Sleeping")
      addActivity(
        "No customers are waiting. Barber is sleeping."
      )
      return
    }

    setWaitingCustomers(waitingCustomers - 1)
    setBarberState("Cutting Hair")

    addActivity("Barber took the next waiting customer.")
  }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50/70 p-4 md:p-6">
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">

        {/* Header */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  OS Management
                </span>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                  Unit 3
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                  Collaboration Integrated
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                Synchronization
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 md:text-base">
                Interactive demonstrations of synchronization
                algorithms and classic synchronization problems,
                connected with shared enterprise collaboration
                resources.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FaShieldAlt className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaInfoCircle />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-blue-800">
                What is Synchronization?
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-700">
                Synchronization coordinates concurrent processes
                and threads so that shared resources are accessed
                safely and in the correct order. It helps prevent
                race conditions and maintains data consistency.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            COLLABORATION INTEGRATION
            ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <FaSyncAlt />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
                      Enterprise Integration
                    </span>

                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                      Synchronization ↔ Collaboration
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800">
                    Shared Collaboration Resource
                  </h2>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
                    Use real collaboration tasks and documents as
                    shared resources. Multiple readers may access a
                    resource together, while a writer requires
                    exclusive access.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetCollaborationSync}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                <FaRedo />
                Reset Resource
              </button>
            </div>
          </div>

          <div className="space-y-5 p-5 md:p-6">

            {/* Resource List */}
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Collaboration Resources
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Select a Task or Document to use as the
                    synchronized shared resource.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  {collaborationResources.length} resource
                  {collaborationResources.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              {resourceLoading ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  Loading collaboration resources...
                </div>
              ) : collaborationResources.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                  <FaLayerGroup className="mx-auto text-2xl text-gray-400" />

                  <p className="mt-2 text-sm font-semibold text-gray-600">
                    No collaboration resources found
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Create Tasks or Documents in the collaboration
                    platform and refresh the page.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {collaborationResources.map((resource) => {
                    const selected =
                      selectedResource?.id === resource.id

                    return (
                      <button
                        type="button"
                        key={resource.id}
                        onClick={() =>
                          selectCollaborationResource(resource)
                        }
                        className={`min-w-0 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${
                          selected
                            ? "border-green-300 bg-green-50 shadow-sm"
                            : "border-gray-200 bg-gray-50 hover:border-green-200 hover:bg-green-50/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              resource.icon === "task"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-purple-50 text-purple-600"
                            }`}
                          >
                            {resource.icon === "task" ? (
                              <FaTasks />
                            ) : (
                              <FaFileAlt />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                {resource.type}
                              </span>

                              {selected && (
                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                                  Selected
                                </span>
                              )}
                            </div>

                            <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                              {resource.name}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-500">
                              Owner: {resource.owner}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600">
                            {resource.status}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Resource Synchronization */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">

              <AlgorithmCard
                title="Selected Resource"
                value={
                  selectedResource
                    ? selectedResource.type
                    : "None"
                }
                accent="green"
              />

              <AlgorithmCard
                title="Active Readers"
                value={resourceReaders}
                accent="blue"
              />

              <AlgorithmCard
                title="Writer"
                value={
                  resourceWriter
                    ? "Exclusive"
                    : "Inactive"
                }
                accent={
                  resourceWriter ? "red" : "gray"
                }
              />

              <AlgorithmCard
                title="Access State"
                value={
                  resourceWriter
                    ? "Write Locked"
                    : resourceReaders > 0
                    ? "Read Shared"
                    : "Available"
                }
                accent={
                  resourceWriter
                    ? "red"
                    : resourceReaders > 0
                    ? "blue"
                    : "green"
                }
              />
            </div>

            {/* Selected Resource Details */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 lg:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                    {selectedResource?.icon === "document" ? (
                      <FaFileAlt />
                    ) : (
                      <FaTasks />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Shared Resource
                    </p>

                    <h3 className="mt-1 break-words text-lg font-semibold text-gray-800">
                      {selectedResource
                        ? selectedResource.name
                        : "No resource selected"}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {selectedResource
                        ? `${selectedResource.type} from the Enterprise Collaboration Platform is being used as the shared synchronization resource.`
                        : "Select a Task or Document above to begin the synchronization demonstration."}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-4 rounded-xl border p-4 text-sm ${
                    resourceWriter
                      ? "border-red-100 bg-red-50 text-red-700"
                      : resourceReaders > 0
                      ? "border-blue-100 bg-blue-50 text-blue-700"
                      : "border-green-100 bg-green-50 text-green-700"
                  }`}
                >
                  <span className="font-semibold">
                    Synchronization status:
                  </span>{" "}
                  {resourceMessage}
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="font-semibold text-gray-800">
                  Access Controls
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Demonstrate shared read access and exclusive
                  write access.
                </p>

                <div className="mt-4 space-y-2">
                  <SmallButton
                    onClick={acquireResourceRead}
                    color="blue"
                  >
                    <FaBook />
                    Reader Enter
                  </SmallButton>

                  <SmallButton
                    onClick={releaseResourceRead}
                    color="neutral"
                  >
                    Reader Leave
                  </SmallButton>

                  <SmallButton
                    onClick={acquireResourceWrite}
                    color="purple"
                  >
                    <FaLock />
                    Writer Enter
                  </SmallButton>

                  <SmallButton
                    onClick={releaseResourceWrite}
                    color="red"
                  >
                    Writer Leave
                  </SmallButton>
                </div>
              </div>
            </div>

            {/* Educational Mapping */}
            <div className="rounded-xl border border-green-100 bg-green-50/60 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <FaShieldAlt />
                </div>

                <div>
                  <h3 className="font-semibold text-green-800">
                    OS Concept → Enterprise Scenario
                  </h3>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <ConceptMapping
                      title="Shared Resource"
                      text="Enterprise Tasks and Documents"
                    />

                    <ConceptMapping
                      title="Readers"
                      text="Employees viewing shared information"
                    />

                    <ConceptMapping
                      title="Writer"
                      text="Employee modifying shared information"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Section Requirements */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaLock />
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Critical-Section Requirements
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RequirementCard
              title="Mutual Exclusion"
              text="Only one process can execute the critical section at a time."
            />

            <RequirementCard
              title="Progress"
              text="If no process is inside the critical section, a waiting process should be able to enter."
            />

            <RequirementCard
              title="Bounded Waiting"
              text="A process should not wait indefinitely to enter the critical section."
            />
          </div>
        </div>

        {/* Strict Alternation */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaUsers />}
            iconClass="bg-blue-50 text-blue-600"
            title="Strict Alternation"
            subtitle="Control access using a shared turn variable."
          />

          <p className="mb-5 text-sm leading-6 text-gray-600">
            Strict alternation uses a shared turn variable. Each
            process waits for its turn before entering the critical
            section.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AlgorithmCard
              title="Turn"
              value={`P${strictTurn}`}
              accent="blue"
            />

            <AlgorithmCard
              title="Process P1"
              value={
                strictTurn === 1
                  ? "Can Enter"
                  : "Waiting"
              }
              accent={
                strictTurn === 1 ? "green" : "gray"
              }
            />

            <AlgorithmCard
              title="Process P2"
              value={
                strictTurn === 2
                  ? "Can Enter"
                  : "Waiting"
              }
              accent={
                strictTurn === 2 ? "green" : "gray"
              }
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <ActionButton
              onClick={() => runStrictAlternation(1)}
              color="blue"
            >
              <FaPlay />
              P1 Enter
            </ActionButton>

            <ActionButton
              onClick={() => runStrictAlternation(2)}
              color="green"
            >
              <FaPlay />
              P2 Enter
            </ActionButton>
          </div>
        </div>

        {/* Peterson */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaCodeBranch />}
            iconClass="bg-purple-50 text-purple-600"
            title="Peterson's Algorithm"
            subtitle="Software-based mutual exclusion for two processes."
          />

          <p className="mb-5 text-sm leading-6 text-gray-600">
            Peterson's Algorithm is a software-based solution
            for mutual exclusion between two processes. It uses
            two flag variables and a turn variable.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AlgorithmCard
              title="P0 Flag"
              value={peterson.flag0 ? "True" : "False"}
              accent={
                peterson.flag0 ? "green" : "gray"
              }
            />

            <AlgorithmCard
              title="P1 Flag"
              value={peterson.flag1 ? "True" : "False"}
              accent={
                peterson.flag1 ? "green" : "gray"
              }
            />

            <AlgorithmCard
              title="Turn"
              value={`P${peterson.turn}`}
              accent="blue"
            />

            <AlgorithmCard
              title="Critical Section"
              value={
                peterson.active === null
                  ? "Free"
                  : `P${peterson.active}`
              }
              accent={
                peterson.active === null
                  ? "green"
                  : "orange"
              }
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <ActionButton
              onClick={() => enterPeterson(0)}
              color="blue"
            >
              P0 Enter
            </ActionButton>

            <ActionButton
              onClick={() => enterPeterson(1)}
              color="green"
            >
              P1 Enter
            </ActionButton>

            <ActionButton
              onClick={leavePeterson}
              color="neutral"
            >
              Leave Critical Section
            </ActionButton>
          </div>
        </div>

        {/* Bakery */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaLayerGroup />}
            iconClass="bg-indigo-50 text-indigo-600"
            title="Lamport's Bakery Algorithm"
            subtitle="Ticket-based mutual exclusion for multiple processes."
          />

          <p className="mb-5 text-sm leading-6 text-gray-600">
            The Bakery Algorithm assigns ticket numbers to
            processes. The process with the smallest ticket gets
            priority to enter the critical section.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="p-4">Process</th>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {bakery.map((process) => (
                  <tr
                    key={process.id}
                    className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50/70"
                  >
                    <td className="p-4 font-semibold text-gray-800">
                      P{process.id}
                    </td>

                    <td className="p-4 font-semibold text-gray-700">
                      {process.number}
                    </td>

                    <td className="p-4">
                      <StatusBadge state={process.state} />
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <SmallButton
                          onClick={() =>
                            chooseBakeryNumber(process.id)
                          }
                          color="blue"
                        >
                          Get Ticket
                        </SmallButton>

                        <SmallButton
                          onClick={() =>
                            enterBakery(process.id)
                          }
                          color="green"
                        >
                          Enter
                        </SmallButton>

                        <SmallButton
                          onClick={() =>
                            leaveBakery(process.id)
                          }
                          color="red"
                        >
                          Leave
                        </SmallButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test and Set */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaLock />}
            iconClass="bg-yellow-50 text-yellow-600"
            title="Test-and-Set"
            subtitle="Atomic hardware support for mutual exclusion."
          />

          <p className="mb-5 text-sm leading-6 text-gray-600">
            Test-and-Set is an atomic hardware instruction that
            can be used to implement mutual exclusion.
          </p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AlgorithmCard
              title="Lock Status"
              value={lock ? "Locked" : "Available"}
              accent={lock ? "red" : "green"}
            />

            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-4">
              <ActionButton
                onClick={() => testAndSet(1)}
                color="blue"
              >
                P1 Test-and-Set
              </ActionButton>

              <ActionButton
                onClick={() => testAndSet(2)}
                color="green"
              >
                P2 Test-and-Set
              </ActionButton>

              <ActionButton
                onClick={releaseLock}
                color="neutral"
              >
                Release
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Semaphores */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaShieldAlt />}
            iconClass="bg-green-50 text-green-600"
            title="Semaphores"
            subtitle="Control access to shared resources using permits."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SemaphoreCard
              title="Binary Semaphore"
              description="A binary semaphore has values 0 and 1 and can be used to control access to a critical section."
              value={binarySemaphore}
              valueColor="blue"
              onWait={binaryWait}
              onSignal={binarySignal}
            />

            <SemaphoreCard
              title="Counting Semaphore"
              description="A counting semaphore can represent multiple available instances of a resource."
              value={countingSemaphore}
              valueColor="purple"
              onWait={countingWait}
              onSignal={countingSignal}
            />
          </div>
        </div>

        {/* Monitors */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaShieldAlt />}
            iconClass="bg-purple-50 text-purple-600"
            title="Monitors"
            subtitle="A high-level construct for synchronized shared-data access."
          />

          <p className="text-sm leading-6 text-gray-600">
            A monitor is a high-level synchronization construct
            that encapsulates shared data and the operations that
            access it. Only one process or thread can execute a
            monitor procedure at a time.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <MonitorCard
              title="Shared Data"
              text="Data protected inside the monitor."
            />

            <MonitorCard
              title="Monitor Procedure"
              text="Operations that safely access shared data."
            />

            <MonitorCard
              title="Condition Variable"
              text="Allows processes to wait for a required condition."
            />
          </div>
        </div>

        {/* Producer Consumer */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaLayerGroup />}
            iconClass="bg-blue-50 text-blue-600"
            title="Producer-Consumer / Bounded Buffer"
            subtitle="Interactive bounded-buffer synchronization simulation."
          />

          <p className="mb-5 text-sm leading-6 text-gray-600">
            The producer adds items to a limited buffer while the
            consumer removes them. The producer must wait when
            the buffer is full, and the consumer must wait when it
            is empty.
          </p>

          <div className="mb-5 flex flex-wrap gap-3">
            <ActionButton
              onClick={produceItem}
              color="blue"
            >
              Produce Item
            </ActionButton>

            <ActionButton
              onClick={consumeItem}
              color="green"
            >
              Consume Item
            </ActionButton>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`flex min-h-20 items-center justify-center rounded-xl border p-3 text-center text-sm font-semibold transition-all ${
                  buffer[index]
                    ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-dashed border-gray-300 bg-gray-50 text-gray-400"
                }`}
              >
                {buffer[index] || "Empty"}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Buffer size: {buffer.length} / 5
            </p>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              Capacity: 5
            </span>
          </div>
        </div>

        {/* Dining Philosophers */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaUtensils />}
            iconClass="bg-orange-50 text-orange-600"
            title="Dining Philosophers"
            subtitle="Explore shared-resource access between competing philosophers."
          />

          <p className="mb-5 text-sm leading-6 text-gray-600">
            Five philosophers share five forks. Each philosopher
            alternates between thinking, becoming hungry and
            eating. The problem demonstrates resource sharing
            and possible deadlock.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {philosophers.map((state, index) => (
              <button
                key={index}
                type="button"
                onClick={() => philosopherAction(index)}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <FaUtensils />
                  </div>

                  <span className="font-semibold text-gray-800">
                    P{index + 1}
                  </span>
                </div>

                <div className="mt-3 rounded-full bg-white px-3 py-1.5 text-center text-xs font-semibold text-gray-600 shadow-sm">
                  {state}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Readers Writers */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaBook />}
            iconClass="bg-purple-50 text-purple-600"
            title="Readers-Writers Problem"
            subtitle="Coordinate shared-resource access between readers and writers."
          />

          <p className="mb-5 text-sm leading-6 text-gray-600">
            Multiple readers may access shared data at the same
            time, but a writer requires exclusive access.
          </p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AlgorithmCard
              title="Active Readers"
              value={readers}
              accent="blue"
            />

            <AlgorithmCard
              title="Writer"
              value={
                writerActive
                  ? "Active"
                  : "Inactive"
              }
              accent={
                writerActive ? "purple" : "gray"
              }
            />

            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 p-4">
              <SmallButton
                onClick={startReader}
                color="blue"
              >
                Start Reader
              </SmallButton>

              <SmallButton
                onClick={stopReader}
                color="neutral"
              >
                Stop Reader
              </SmallButton>

              <SmallButton
                onClick={startWriter}
                color="purple"
              >
                Start Writer
              </SmallButton>

              <SmallButton
                onClick={stopWriter}
                color="neutral"
              >
                Stop Writer
              </SmallButton>
            </div>
          </div>
        </div>

        {/* Sleeping Barber */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <SectionHeading
            icon={<FaCut />}
            iconClass="bg-blue-50 text-blue-600"
            title="Sleeping Barber Problem"
            subtitle="Simulate customers, waiting chairs, and barber activity."
          />

          <p className="mb-5 text-sm leading-6 text-gray-600">
            A barber sleeps when there are no customers. When a
            customer arrives, the barber serves the customer. A
            limited number of waiting chairs creates a
            synchronization problem.
          </p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AlgorithmCard
              title="Barber"
              value={barberState}
              accent={
                barberState === "Sleeping"
                  ? "gray"
                  : "blue"
              }
            />

            <AlgorithmCard
              title="Waiting Customers"
              value={waitingCustomers}
              accent="orange"
            />

            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 p-4">
              <SmallButton
                onClick={addCustomer}
                color="blue"
              >
                Add Customer
              </SmallButton>

              <SmallButton
                onClick={serveCustomer}
                color="green"
              >
                Serve Customer
              </SmallButton>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FaPlay />
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Synchronization Activity
                </h2>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Observe the simulated synchronization operations,
                including collaboration resource access.
              </p>
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <FaRedo />
              Reset All
            </button>
          </div>

          {activity.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
              No activity yet. Use the controls above.
            </div>
          ) : (
            <div className="space-y-2">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm leading-6 text-gray-600 transition-colors hover:bg-gray-100"
                >
                  {item.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaInfoCircle />
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-blue-800">
                Key Takeaway
              </h2>

              <p className="text-sm leading-6 text-blue-700">
                Synchronization provides mechanisms for safely
                coordinating concurrent processes and threads.
                Algorithms such as Peterson's Algorithm, Lamport's
                Bakery Algorithm, Test-and-Set and semaphores help
                control access to shared resources and prevent
                incorrect concurrent execution. In the enterprise
                platform, Tasks and Documents can act as shared
                collaboration resources where synchronized reader
                and writer access helps demonstrate these operating
                system concepts in a practical scenario.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

/* =========================================================
   REUSABLE COMPONENTS
   ========================================================= */

function SectionHeading({
  icon,
  iconClass,
  title,
  subtitle,
}) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-gray-800">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

function RequirementCard({ title, text }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:bg-blue-50/30 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FaLock />
        </div>

        <h3 className="font-semibold text-gray-800">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  )
}

function AlgorithmCard({
  title,
  value,
  accent = "gray",
}) {
  const accents = {
    blue: "border-blue-100 bg-blue-50/60 text-blue-700",
    green: "border-green-100 bg-green-50/60 text-green-700",
    purple: "border-purple-100 bg-purple-50/60 text-purple-700",
    red: "border-red-100 bg-red-50/60 text-red-700",
    orange: "border-orange-100 bg-orange-50/60 text-orange-700",
    gray: "border-gray-100 bg-gray-50 text-gray-700",
  }

  return (
    <div
      className={`min-w-0 rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${
        accents[accent]
      }`}
    >
      <div className="break-words text-xs font-semibold uppercase tracking-wide opacity-70">
        {title}
      </div>

      <div className="mt-2 break-words text-2xl font-bold">
        {value}
      </div>
    </div>
  )
}

function StatusBadge({ state }) {
  const styles = {
    Ready: "bg-gray-100 text-gray-600",
    Waiting: "bg-yellow-50 text-yellow-700",
    "Critical Section":
      "bg-green-50 text-green-700",
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[state] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {state}
    </span>
  )
}

function ActionButton({
  children,
  onClick,
  color = "blue",
}) {
  const styles = {
    blue:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    green:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    purple:
      "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
    neutral:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        styles[color]
      }`}
    >
      {children}
    </button>
  )
}

function SmallButton({
  children,
  onClick,
  color = "blue",
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-300",
    green:
      "bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-300",
    red:
      "bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-300",
    purple:
      "bg-purple-50 text-purple-700 hover:bg-purple-100 focus:ring-purple-300",
    neutral:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        styles[color]
      }`}
    >
      {children}
    </button>
  )
}

function SemaphoreCard({
  title,
  description,
  value,
  valueColor,
  onWait,
  onSignal,
}) {
  const valueStyles = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
      <h3 className="text-lg font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>

      <div
        className={`mt-4 inline-flex min-w-16 items-center justify-center rounded-xl px-4 py-2 text-3xl font-bold ${
          valueStyles[valueColor]
        }`}
      >
        {value}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton
          onClick={onWait}
          color="blue"
        >
          <FaMinus />
          wait()
        </ActionButton>

        <ActionButton
          onClick={onSignal}
          color="green"
        >
          <FaPlus />
          signal()
        </ActionButton>
      </div>
    </div>
  )
}

function MonitorCard({ title, text }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-100 hover:bg-purple-50/30 hover:shadow-sm">
      <h3 className="font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  )
}

function ConceptMapping({ title, text }) {
  return (
    <div className="rounded-xl border border-green-100 bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-green-700">
        {title}
      </p>

      <p className="mt-1 text-sm leading-5 text-gray-600">
        {text}
      </p>
    </div>
  )
}

export default Synchronization