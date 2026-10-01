import { useState } from "react"
import {
  FaInfoCircle,
  FaPlay,
  FaRedo,
  FaLock,
  FaExclamationTriangle,
  FaCodeBranch,
  FaDatabase,
  FaLayerGroup,
  FaShieldAlt,
  FaBolt,
} from "react-icons/fa"

function Concurrency() {
  const [counter, setCounter] = useState(0)
  const [raceResult, setRaceResult] = useState(null)
  const [isCriticalSectionLocked, setIsCriticalSectionLocked] =
    useState(false)
  const [activity, setActivity] = useState([])

  const addActivity = (message) => {
    setActivity((prev) => [
      ...prev.slice(-5),
      {
        id: Date.now() + Math.random(),
        message,
      },
    ])
  }

  const runWithoutSynchronization = () => {
    const oldValue = counter
    const newValue = oldValue + 1

    setCounter(newValue)
    setRaceResult("Race Condition")
    addActivity(
      "Thread 1 and Thread 2 accessed the shared counter without synchronization."
    )
  }

  const runWithSynchronization = () => {
    if (isCriticalSectionLocked) {
      addActivity(
        "Critical section is already locked. Another thread must wait."
      )
      return
    }

    setIsCriticalSectionLocked(true)

    const newValue = counter + 1
    setCounter(newValue)
    setRaceResult("Safe Execution")

    addActivity(
      "Thread entered the critical section, updated the shared resource, and released the lock."
    )

    setTimeout(() => {
      setIsCriticalSectionLocked(false)
    }, 700)
  }

  const resetSimulation = () => {
    setCounter(0)
    setRaceResult(null)
    setIsCriticalSectionLocked(false)
    setActivity([])
  }

  const simulateThread = (threadName) => {
    addActivity(
      `${threadName} is executing concurrently and accessing a shared resource.`
    )
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
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                Concurrency
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 md:text-base">
                Interactive simulation of concurrency, race conditions,
                critical sections and shared resources.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FaCodeBranch className="text-2xl" />
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
                What is Concurrency?
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-700">
                Concurrency is the ability of an operating system
                to manage multiple processes or threads so that
                their execution progresses during overlapping
                periods of time. The operating system switches
                between tasks and manages shared resources.
              </p>
            </div>
          </div>
        </div>

        {/* Concurrency vs Parallelism */}
        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">

          <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaCodeBranch />
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                Concurrency
              </h2>
            </div>

            <ul className="space-y-3 text-sm leading-6 text-gray-600">
              <li>• Multiple tasks make progress during overlapping time periods.</li>
              <li>• Tasks may share CPU time.</li>
              <li>• The CPU can switch between processes or threads.</li>
              <li>• Proper resource management is important.</li>
            </ul>
          </div>

          <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FaPlay />
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                Parallelism
              </h2>
            </div>

            <ul className="space-y-3 text-sm leading-6 text-gray-600">
              <li>• Multiple tasks execute at the same time.</li>
              <li>• Usually requires multiple CPU cores.</li>
              <li>• Tasks can physically execute simultaneously.</li>
              <li>• Parallelism can improve execution performance.</li>
            </ul>
          </div>
        </div>

        {/* Concurrent Processes */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Process & Thread Concurrency
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Observe how processes and threads can make concurrent progress.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FaLayerGroup />
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">

            <ConcurrencyCard
              title="Process P1"
              description="Executing an application task."
              state="Running"
              color="green"
            />

            <ConcurrencyCard
              title="Process P2"
              description="Waiting for CPU execution."
              state="Ready"
              color="blue"
            />

            <ConcurrencyCard
              title="Thread T1"
              description="Accessing a shared resource."
              state="Running"
              color="purple"
            />

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              onClick={() => simulateThread("Thread T1")}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaPlay />
              Run Thread T1
            </button>

            <button
              onClick={() => simulateThread("Thread T2")}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <FaPlay />
              Run Thread T2
            </button>

          </div>
        </div>

        {/* Race Condition */}
        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm md:p-6">

          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FaExclamationTriangle />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Race Condition
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compare unsynchronized and synchronized access to shared data.
              </p>
            </div>
          </div>

          <p className="mb-5 text-sm leading-6 text-gray-600">
            A race condition occurs when multiple processes or
            threads access shared data concurrently and the final
            result depends on the order in which their operations
            are performed.
          </p>

          <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-3">

            {/* Counter */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Shared Counter
              </div>

              <div className="mt-3 text-5xl font-bold tabular-nums text-gray-800">
                {counter}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Current shared value
              </div>
            </div>

            {/* Without Synchronization */}
            <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <h3 className="font-semibold text-red-700">
                  Without Synchronization
                </h3>
              </div>

              <p className="text-sm leading-6 text-red-600">
                Multiple threads can read and update the same
                value at the same time, potentially causing an
                incorrect result.
              </p>

              <button
                onClick={runWithoutSynchronization}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <FaPlay />
                Simulate Race
              </button>
            </div>

            {/* With Synchronization */}
            <div className="rounded-2xl border border-green-100 bg-green-50/70 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <h3 className="font-semibold text-green-700">
                  With Synchronization
                </h3>
              </div>

              <p className="text-sm leading-6 text-green-600">
                A lock can ensure that only one thread enters
                the critical section at a time.
              </p>

              <button
                onClick={runWithSynchronization}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <FaLock />
                Use Lock
              </button>
            </div>

          </div>

          {raceResult && (
            <div
              className={`mt-5 flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${
                raceResult === "Race Condition"
                  ? "border-red-100 bg-red-50 text-red-700"
                  : "border-green-100 bg-green-50 text-green-700"
              }`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  raceResult === "Race Condition"
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              />

              <span>Result: {raceResult}</span>
            </div>
          )}

        </div>

        {/* Critical Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">

          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <FaLock />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Critical Section
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Understand the stages involved in protected resource access.
              </p>
            </div>
          </div>

          <p className="mb-5 text-sm leading-6 text-gray-600">
            A critical section is a part of a program where shared
            resources are accessed or modified. Only one process
            or thread should execute the critical section at a
            time when mutual exclusion is required.
          </p>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <SectionCard
              number="1"
              title="Entry Section"
              text="A thread requests permission to enter the critical section."
            />

            <SectionCard
              number="2"
              title="Critical Section"
              text="The thread accesses the shared resource."
            />

            <SectionCard
              number="3"
              title="Exit Section"
              text="The thread releases the resource or lock."
            />

            <SectionCard
              number="4"
              title="Remainder Section"
              text="The thread continues its other work."
            />

          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
            <div
              className={`h-3 w-3 shrink-0 rounded-full ${
                isCriticalSectionLocked
                  ? "bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                  : "bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.12)]"
              }`}
            />

            <span className="text-sm font-medium text-gray-700">
              Critical Section:
              {" "}
              {isCriticalSectionLocked
                ? "Locked — Thread is executing"
                : "Available"}
            </span>
          </div>

        </div>

        {/* Shared Resource */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">

          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaDatabase />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Shared Resource
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Common resources that may be accessed by concurrent tasks.
              </p>
            </div>
          </div>

          <p className="mb-5 text-sm leading-6 text-gray-600">
            Concurrent processes and threads may need to access
            common resources such as memory, files, databases,
            counters or shared variables. These resources must be
            managed carefully to avoid inconsistent results.
          </p>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <ResourceCard
              title="Shared Memory"
              text="Memory area accessed by multiple processes or threads."
            />

            <ResourceCard
              title="Shared File"
              text="A file that can be accessed by multiple tasks."
            />

            <ResourceCard
              title="Database"
              text="Multiple tasks may read or modify common database records."
            />

            <ResourceCard
              title="Shared Counter"
              text="A common variable that can be modified by multiple threads."
            />

          </div>

        </div>

        {/* Activity Log */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaBolt />
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Concurrency Activity
                </h2>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Observe simulated concurrent operations.
              </p>
            </div>

            <button
              onClick={resetSimulation}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <FaRedo />
              Reset
            </button>

          </div>

          {activity.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
              No activity yet. Use the simulation buttons above.
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

        {/* Important Concepts */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FaShieldAlt />
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Important Concurrency Concepts
            </h2>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">

            <ConceptCard
              title="Race Condition"
              text="Occurs when the result depends on the timing or order of concurrent operations."
            />

            <ConceptCard
              title="Critical Section"
              text="Part of a program that accesses shared resources and may require mutual exclusion."
            />

            <ConceptCard
              title="Shared Resource"
              text="A resource that can be accessed by multiple processes or threads."
            />

            <ConceptCard
              title="Mutual Exclusion"
              text="Ensures that only one thread or process accesses a protected critical section at a time."
            />

            <ConceptCard
              title="Concurrency"
              text="Multiple tasks make progress during overlapping periods of execution."
            />

            <ConceptCard
              title="Synchronization"
              text="Coordinates concurrent tasks to ensure correct and predictable access to shared resources."
            />

          </div>

        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 md:p-6">

          <h2 className="mb-3 text-xl font-semibold text-blue-800">
            Key Takeaway
          </h2>

          <p className="text-sm leading-6 text-blue-700">
            Concurrency allows multiple processes and threads to
            make progress at the same time. However, when they
            access shared resources, problems such as race
            conditions can occur. Critical sections and
            synchronization mechanisms help maintain correct
            execution.
          </p>

        </div>

      </div>
    </div>
  )
}

/* Components */

function ConcurrencyCard({
  title,
  description,
  state,
  color,
}) {
  const styles = {
    green:
      "border-green-100 bg-green-50 text-green-700 hover:border-green-200",
    blue:
      "border-blue-100 bg-blue-50 text-blue-700 hover:border-blue-200",
    purple:
      "border-purple-100 bg-purple-50 text-purple-700 hover:border-purple-200",
  }

  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${styles[color]}`}
    >
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6">
        {description}
      </p>

      <div className="mt-4">
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
          {state}
        </span>
      </div>
    </div>
  )
}

function SectionCard({
  number,
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/40">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
          {number}
        </span>

        <h3 className="font-semibold text-gray-800">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-5 text-gray-600">
        {text}
      </p>
    </div>
  )
}

function ResourceCard({
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:bg-white hover:shadow-sm">
      <h3 className="font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-gray-600">
        {text}
      </p>
    </div>
  )
}

function ConceptCard({
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/30">
      <h3 className="font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  )
}

export default Concurrency