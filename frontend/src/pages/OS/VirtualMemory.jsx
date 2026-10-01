import { useState } from "react"
import {
  FaMemory,
  FaPlay,
  FaRedo,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaLayerGroup,
  FaChartBar,
} from "react-icons/fa"

function VirtualMemory() {
  const [activeTab, setActiveTab] = useState("overview")

  // Page replacement states
  const [referenceString, setReferenceString] = useState(
    "1, 2, 3, 1, 4, 5, 2, 1, 6, 2"
  )
  const [frameCount, setFrameCount] = useState(3)
  const [algorithm, setAlgorithm] = useState("FIFO")
  const [simulation, setSimulation] = useState([])
  const [pageFaults, setPageFaults] = useState(0)
  const [pageHits, setPageHits] = useState(0)

  // Belady's anomaly
  const [beladyReference, setBeladyReference] = useState(
    "1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5"
  )
  const [beladyResults, setBeladyResults] = useState(null)

  // Thrashing
  const [thrashingLevel, setThrashingLevel] = useState(35)

  const tabs = [
    { id: "overview", name: "Overview", icon: <FaMemory /> },
    { id: "demand", name: "Demand Paging", icon: <FaExchangeAlt /> },
    { id: "replacement", name: "Page Replacement", icon: <FaLayerGroup /> },
    { id: "belady", name: "Belady's Anomaly", icon: <FaChartBar /> },
    { id: "thrashing", name: "Thrashing", icon: <FaExclamationTriangle /> },
  ]

  const parseReferenceString = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map(Number)
      .filter((item) => !Number.isNaN(item))
  }

  // FIFO Algorithm
  const runFIFO = (pages, frames) => {
    let memory = []
    let pointer = 0
    let faults = 0
    let hits = 0
    const steps = []

    pages.forEach((page) => {
      let isHit = memory.includes(page)

      if (isHit) {
        hits++
      } else {
        faults++

        if (memory.length < frames) {
          memory.push(page)
        } else {
          memory[pointer] = page
          pointer = (pointer + 1) % frames
        }
      }

      steps.push({
        page,
        frames: [...memory],
        result: isHit ? "Hit" : "Fault",
      })
    })

    return { steps, faults, hits }
  }

  // LRU Algorithm
  const runLRU = (pages, frames) => {
    let memory = []
    let faults = 0
    let hits = 0
    const steps = []
    let recent = []

    pages.forEach((page) => {
      let isHit = memory.includes(page)

      if (isHit) {
        hits++
        recent = recent.filter((item) => item !== page)
        recent.push(page)
      } else {
        faults++

        if (memory.length < frames) {
          memory.push(page)
        } else {
          const leastRecent = recent.shift()
          const index = memory.indexOf(leastRecent)

          if (index !== -1) {
            memory[index] = page
          }
        }

        recent = recent.filter((item) => item !== page)
        recent.push(page)
      }

      steps.push({
        page,
        frames: [...memory],
        result: isHit ? "Hit" : "Fault",
      })
    })

    return { steps, faults, hits }
  }

  // Optimal Algorithm
  const runOptimal = (pages, frames) => {
    let memory = []
    let faults = 0
    let hits = 0
    const steps = []

    pages.forEach((page, index) => {
      let isHit = memory.includes(page)

      if (isHit) {
        hits++
      } else {
        faults++

        if (memory.length < frames) {
          memory.push(page)
        } else {
          let farthestIndex = -1
          let replacementIndex = 0

          memory.forEach((framePage, frameIndex) => {
            const nextUse = pages.indexOf(framePage, index + 1)

            if (nextUse === -1) {
              replacementIndex = frameIndex
              farthestIndex = Infinity
            } else if (nextUse > farthestIndex) {
              farthestIndex = nextUse
              replacementIndex = frameIndex
            }
          })

          memory[replacementIndex] = page
        }
      }

      steps.push({
        page,
        frames: [...memory],
        result: isHit ? "Hit" : "Fault",
      })
    })

    return { steps, faults, hits }
  }

  const runSimulation = () => {
    const pages = parseReferenceString(referenceString)

    if (pages.length === 0 || frameCount < 1) {
      return
    }

    let result

    if (algorithm === "FIFO") {
      result = runFIFO(pages, frameCount)
    } else if (algorithm === "LRU") {
      result = runLRU(pages, frameCount)
    } else {
      result = runOptimal(pages, frameCount)
    }

    setSimulation(result.steps)
    setPageFaults(result.faults)
    setPageHits(result.hits)
  }

  const resetSimulation = () => {
    setReferenceString("1, 2, 3, 1, 4, 5, 2, 1, 6, 2")
    setFrameCount(3)
    setAlgorithm("FIFO")
    setSimulation([])
    setPageFaults(0)
    setPageHits(0)
  }

  const runBeladySimulation = () => {
    const pages = parseReferenceString(beladyReference)

    if (pages.length === 0) {
      return
    }

    const fifo3 = runFIFO(pages, 3)
    const fifo4 = runFIFO(pages, 4)

    setBeladyResults({
      frames3: fifo3.faults,
      frames4: fifo4.faults,
      difference: fifo4.faults - fifo3.faults,
    })
  }

  const resetBelady = () => {
    setBeladyReference("1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5")
    setBeladyResults(null)
  }

  const totalReferences = simulation.length
  const hitRate =
    totalReferences > 0
      ? ((pageHits / totalReferences) * 100).toFixed(1)
      : "0.0"

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50/70">
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-50 blur-2xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="shrink-0 rounded-2xl bg-blue-100 p-3.5 text-blue-600 shadow-sm">
                  <FaMemory size={25} />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                      Operating Systems
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                      Memory Management
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Virtual Memory
                  </h1>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                    Demand paging, page replacement and memory virtualization
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                <FaPlay className="text-xs" />
                Interactive OS Simulation
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Virtual Memory",
                  text: "Uses secondary storage to provide a larger logical memory space.",
                },
                {
                  title: "Demand Paging",
                  text: "Loads pages into physical memory only when they are required.",
                },
                {
                  title: "Page Replacement",
                  text: "Selects a page to remove when no free frame is available.",
                },
                {
                  title: "Page Fault",
                  text: "Occurs when a required page is not currently in physical memory.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 h-1 w-10 rounded-full bg-blue-500" />

                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Why Virtual Memory?
                </h2>

                <ul className="space-y-3 text-sm leading-6 text-gray-600">
                  <li>• Allows programs larger than physical RAM to execute.</li>
                  <li>• Provides better memory utilization.</li>
                  <li>• Supports process isolation and protection.</li>
                  <li>• Uses paging or segmentation techniques.</li>
                  <li>• Moves required information between disk and RAM.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Virtual Memory Flow
                </h2>

                <div className="flex flex-col items-center gap-2 text-sm">
                  <div className="w-full rounded-xl border border-blue-100 bg-blue-50 p-4 text-center font-semibold text-blue-700">
                    CPU generates logical address
                  </div>

                  <div className="text-gray-400">↓</div>

                  <div className="w-full rounded-xl border border-purple-100 bg-purple-50 p-4 text-center font-semibold text-purple-700">
                    Page Table Lookup
                  </div>

                  <div className="text-gray-400">↓</div>

                  <div className="w-full rounded-xl border border-green-100 bg-green-50 p-4 text-center font-semibold text-green-700">
                    Page found in memory?
                  </div>

                  <div className="text-gray-400">↓</div>

                  <div className="w-full rounded-xl border border-orange-100 bg-orange-50 p-4 text-center font-semibold text-orange-700">
                    Page Fault → Load Page → Continue Execution
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-800">
              <strong>Educational note:</strong> This page demonstrates
              virtual-memory concepts using simulations. It does not modify
              the actual memory of your computer.
            </div>
          </div>
        )}

        {/* Demand Paging */}
        {activeTab === "demand" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <FaExchangeAlt />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Demand Paging
                </h2>
              </div>

              <p className="leading-7 text-gray-600">
                In demand paging, a page is brought into physical memory only
                when the process actually needs it. If the page is not
                available in RAM, a page fault occurs and the operating system
                loads the required page from secondary storage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 w-fit rounded-xl bg-blue-50 p-3 text-blue-600">
                  <FaMemory />
                </div>

                <h3 className="font-semibold text-gray-900">
                  1. CPU Request
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  CPU generates a logical address belonging to a virtual page.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 w-fit rounded-xl bg-orange-50 p-3 text-orange-600">
                  <FaExclamationTriangle />
                </div>

                <h3 className="font-semibold text-gray-900">
                  2. Page Fault
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  If the page is absent from RAM, the operating system detects
                  a page fault.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 w-fit rounded-xl bg-green-50 p-3 text-green-600">
                  <FaCheckCircle />
                </div>

                <h3 className="font-semibold text-gray-900">
                  3. Page Loaded
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  The required page is loaded into a free frame and execution
                  continues.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Demand Paging Flow
              </h2>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                {[
                  "Logical Address",
                  "Page Table",
                  "Page Present?",
                  "Page Fault",
                  "Load Page",
                ].map((item, index) => (
                  <div key={item} className="flex min-w-0 items-center gap-2">
                    <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700">
                      {item}
                    </div>

                    {index < 4 && (
                      <span className="hidden shrink-0 text-gray-400 md:block">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Page Replacement */}
        {activeTab === "replacement" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <FaLayerGroup />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Page Replacement Simulation
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Compare FIFO, LRU and Optimal page replacement algorithms.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Reference String
                  </label>

                  <input
                    type="text"
                    value={referenceString}
                    onChange={(e) => setReferenceString(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder="1, 2, 3, 1, 4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Number of Frames
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={frameCount}
                    onChange={(e) =>
                      setFrameCount(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Algorithm
                  </label>

                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="FIFO">FIFO</option>
                    <option value="LRU">LRU</option>
                    <option value="Optimal">Optimal</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={runSimulation}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaPlay />
                  Run Simulation
                </button>

                <button
                  onClick={resetSimulation}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <FaRedo />
                  Reset
                </button>
              </div>
            </div>

            {/* Results */}
            {simulation.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Page Faults
                    </p>

                    <p className="mt-2 text-3xl font-bold text-orange-600">
                      {pageFaults}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Page Hits
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                      {pageHits}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Hit Rate
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-600">
                      {hitRate}%
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-100 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="font-bold text-gray-900">
                        Simulation Steps — {algorithm}
                      </h2>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {simulation.length} References
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Step
                          </th>

                          <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Page
                          </th>

                          {Array.from(
                            { length: frameCount },
                            (_, index) => (
                              <th
                                key={index}
                                className="px-4 py-3 text-left font-semibold text-gray-600"
                              >
                                Frame {index + 1}
                              </th>
                            )
                          )}

                          <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Result
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {simulation.map((step, index) => (
                          <tr
                            key={index}
                            className="border-t border-gray-100 transition hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-gray-600">
                              {index + 1}
                            </td>

                            <td className="px-4 py-3 font-semibold text-gray-900">
                              {step.page}
                            </td>

                            {Array.from(
                              { length: frameCount },
                              (_, frameIndex) => (
                                <td
                                  key={frameIndex}
                                  className="px-4 py-3 text-gray-600"
                                >
                                  {step.frames[frameIndex] ?? "-"}
                                </td>
                              )
                            )}

                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  step.result === "Hit"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {step.result}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Belady's Anomaly */}
        {activeTab === "belady" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <FaChartBar />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Belady's Anomaly
                </h2>
              </div>

              <p className="leading-7 text-gray-600">
                Belady's anomaly is a situation where increasing the number
                of available page frames can unexpectedly increase the number
                of page faults. It is associated with some page replacement
                algorithms such as FIFO.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reference String
              </label>

              <input
                type="text"
                value={beladyReference}
                onChange={(e) => setBeladyReference(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={runBeladySimulation}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaPlay />
                  Check FIFO
                </button>

                <button
                  onClick={resetBelady}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <FaRedo />
                  Reset
                </button>
              </div>
            </div>

            {beladyResults && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    3 Frames
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {beladyResults.frames3}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Page faults
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    4 Frames
                  </p>

                  <p className="mt-2 text-3xl font-bold text-purple-600">
                    {beladyResults.frames4}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Page faults
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-6 shadow-sm ${
                    beladyResults.difference > 0
                      ? "border-orange-200 bg-orange-50"
                      : "border-green-200 bg-green-50"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-600">
                    Difference in Faults
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {beladyResults.difference}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {beladyResults.difference > 0
                      ? "Belady's anomaly observed."
                      : "No anomaly observed for this reference string."}
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm leading-6 text-yellow-800">
              <strong>Important:</strong> Belady's anomaly is demonstrated
              here using FIFO page replacement. Not every reference string
              produces the anomaly.
            </div>
          </div>
        )}

        {/* Thrashing */}
        {activeTab === "thrashing" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                  <FaExclamationTriangle />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Thrashing
                </h2>
              </div>

              <p className="leading-7 text-gray-600">
                Thrashing occurs when a system spends a very large amount of
                time handling page faults and swapping pages instead of
                performing useful computation.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    Thrashing Level Simulation
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Increase memory pressure to observe the effect.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-orange-50 px-4 py-2 text-xl font-bold text-orange-600">
                  {thrashingLevel}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={thrashingLevel}
                onChange={(e) =>
                  setThrashingLevel(Number(e.target.value))
                }
                className="w-full cursor-pointer accent-orange-500"
              />

              <div className="mt-4 h-7 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-200"
                  style={{ width: `${thrashingLevel}%` }}
                />
              </div>

              <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
                <p className="font-semibold text-gray-900">
                  System Status
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {thrashingLevel < 30 &&
                    "Normal memory activity. Most CPU time can be used for useful work."}

                  {thrashingLevel >= 30 &&
                    thrashingLevel < 70 &&
                    "Increasing memory pressure. Page-fault activity is becoming significant."}

                  {thrashingLevel >= 70 &&
                    "High memory pressure. The system is experiencing severe thrashing."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 h-1 w-9 rounded-full bg-red-400" />

                <h3 className="font-semibold text-gray-900">
                  Causes
                </h3>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  <li>• Too many active processes</li>
                  <li>• Insufficient physical memory</li>
                  <li>• Excessive page faults</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 h-1 w-9 rounded-full bg-orange-400" />

                <h3 className="font-semibold text-gray-900">
                  Effects
                </h3>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  <li>• Low CPU utilization</li>
                  <li>• High disk activity</li>
                  <li>• Poor system performance</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 h-1 w-9 rounded-full bg-green-400" />

                <h3 className="font-semibold text-gray-900">
                  Prevention
                </h3>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  <li>• Working-set model</li>
                  <li>• Page-fault frequency control</li>
                  <li>• Better memory allocation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Virtual Memory Module • Enterprise Collaboration Platform
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-400">
            Educational simulation — no actual operating-system memory is
            modified.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VirtualMemory