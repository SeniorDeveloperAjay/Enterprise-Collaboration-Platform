import { useState } from "react"
import {
  FaDesktop,
  FaServer,
  FaMicrochip,
  FaMemory,
  FaPlay,
  FaRedo,
  FaCheckCircle,
  FaCloud,
  FaWindows,
  FaChartLine,
  FaLayerGroup,
  FaCogs,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa"

function ModernOS() {
  const [activeTab, setActiveTab] = useState("overview")

  // Virtual Machine Simulation
  const [vmRunning, setVmRunning] = useState(false)
  const [vmCpu, setVmCpu] = useState(25)
  const [vmMemory, setVmMemory] = useState(2048)

  // CPU / GPU Simulation
  const [workload, setWorkload] = useState(50)
  const [computeMode, setComputeMode] = useState("CPU")
  const [computeResult, setComputeResult] = useState(null)

  // Windows Paging Simulation
  const [pageNumber, setPageNumber] = useState(2)
  const [frameNumber, setFrameNumber] = useState(5)
  const [offset, setOffset] = useState(40)
  const [pagingResult, setPagingResult] = useState(null)

  const [activityLog, setActivityLog] = useState([])

  // ---------------- VM SIMULATION ----------------

  const toggleVM = () => {
    const newState = !vmRunning

    setVmRunning(newState)

    setActivityLog((prev) => [
      newState
        ? "Virtual machine started."
        : "Virtual machine stopped.",
      ...prev,
    ])
  }

  const resetVM = () => {
    setVmRunning(false)
    setVmCpu(25)
    setVmMemory(2048)

    setActivityLog((prev) => [
      "Virtual machine simulation reset.",
      ...prev,
    ])
  }

  // ---------------- CPU / GPU SIMULATION ----------------

  const runComputeSimulation = () => {
    const workloadValue = Number(workload)

    let estimatedTime

    if (computeMode === "CPU") {
      estimatedTime = Math.max(
        1,
        Math.round(workloadValue * 0.8)
      )
    } else {
      estimatedTime = Math.max(
        1,
        Math.round(workloadValue * 0.25)
      )
    }

    setComputeResult({
      mode: computeMode,
      workload: workloadValue,
      estimatedTime,
    })

    setActivityLog((prev) => [
      `${computeMode} computation completed for ${workloadValue}% workload.`,
      ...prev,
    ])
  }

  // ---------------- PAGING SIMULATION ----------------

  const translateAddress = () => {
    const page = Number(pageNumber)
    const frame = Number(frameNumber)
    const off = Number(offset)

    const physicalAddress = frame * 100 + off

    setPagingResult({
      page,
      frame,
      offset: off,
      physicalAddress,
    })

    setActivityLog((prev) => [
      `Virtual page ${page} translated to frame ${frame}.`,
      ...prev,
    ])
  }

  const resetPaging = () => {
    setPageNumber(2)
    setFrameNumber(5)
    setOffset(40)
    setPagingResult(null)
  }

  const clearLog = () => {
    setActivityLog([])
  }

  const tabs = [
    {
      id: "overview",
      name: "Overview",
      icon: FaLayerGroup,
    },
    {
      id: "virtualization",
      name: "Virtualization",
      icon: FaCloud,
    },
    {
      id: "compute",
      name: "CPU & GPU",
      icon: FaMicrochip,
    },
    {
      id: "paging",
      name: "Windows Paging",
      icon: FaWindows,
    },
  ]

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50/70">
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl" />

          <div className="relative p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                <FaRocket />
                Modern OS
              </span>

              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                Advanced Concepts
              </span>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h1 className="break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Modern Operating Systems
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                  Explore virtualization, hypervisors, CPU/GPU computing
                  and modern memory-management concepts through
                  interactive educational simulations.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
                  <FaCogs />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Module
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    Modern OS Concepts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TABS ================= */}

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* ================= OVERVIEW ================= */}

        {activeTab === "overview" && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaCloud />
                </div>

                <h3 className="font-bold text-gray-900">
                  Virtualization
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Allows multiple virtual systems to run on the same
                  physical hardware.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <FaServer />
                </div>

                <h3 className="font-bold text-gray-900">
                  Hypervisor
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Software or firmware that manages virtual machines.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaMicrochip />
                </div>

                <h3 className="font-bold text-gray-900">
                  GPU Computing
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  GPUs can execute many parallel computations.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <FaMemory />
                </div>

                <h3 className="font-bold text-gray-900">
                  Modern Paging
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Modern operating systems use virtual memory and paging.
                </p>
              </div>

            </div>

            {/* ARCHITECTURE */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaLayerGroup />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Modern OS Architecture
                  </h2>

                  <p className="text-sm text-gray-500">
                    High-level relationship between software and hardware
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center font-semibold text-blue-700">
                  Applications
                </div>

                <div className="text-center text-lg font-bold text-gray-300">
                  ↓
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-center font-semibold text-green-700">
                  Operating System Services
                </div>

                <div className="text-center text-lg font-bold text-gray-300">
                  ↓
                </div>

                <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 text-center font-semibold text-purple-700">
                  Kernel
                </div>

                <div className="text-center text-lg font-bold text-gray-300">
                  ↓
                </div>

                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-center font-semibold text-orange-700">
                  Hardware
                </div>
              </div>
            </div>

            {/* MODERN CONCEPTS */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FaCogs />
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Key Modern OS Features
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "Virtualization",
                    "Multi-core CPU support",
                    "GPU acceleration",
                    "Virtual memory",
                    "Security and isolation",
                    "Containerization",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-700"
                    >
                      <FaCheckCircle className="shrink-0 text-green-500" />
                      <span className="break-words">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <FaDesktop />
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Example Systems
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <FaWindows className="text-blue-600" />
                    <span className="font-medium text-gray-700">
                      Windows
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <FaDesktop className="text-gray-600" />
                    <span className="font-medium text-gray-700">
                      Linux
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <FaDesktop className="text-gray-600" />
                    <span className="font-medium text-gray-700">
                      macOS
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= VIRTUALIZATION ================= */}

        {activeTab === "virtualization" && (
          <div className="space-y-6">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaCloud />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">
                    Virtual Machine Simulation
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    A virtual machine provides an isolated software
                    environment that behaves like a separate computer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <FaServer />
                  </div>

                  <h3 className="font-bold text-gray-900">
                    Host Machine
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Physical computer running the virtualization software.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                    <FaCloud />
                  </div>

                  <h3 className="font-bold text-gray-900">
                    Hypervisor
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Allocates hardware resources to virtual machines.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                    <FaDesktop />
                  </div>

                  <h3 className="font-bold text-gray-900">
                    Guest VM
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Virtual operating system running inside the host.
                  </p>
                </div>

              </div>
            </div>

            {/* VM CONTROLS */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Interactive Simulation
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    Virtual Machine Controls
                  </h2>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                    vmRunning
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      vmRunning ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {vmRunning ? "Running" : "Stopped"}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Virtual CPU Usage
                    </label>

                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {vmCpu}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vmCpu}
                    onChange={(e) => setVmCpu(e.target.value)}
                    className="w-full accent-blue-600"
                  />

                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Virtual Memory
                    </label>

                    <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                      {vmMemory} MB
                    </span>
                  </div>

                  <input
                    type="range"
                    min="512"
                    max="8192"
                    step="512"
                    value={vmMemory}
                    onChange={(e) => setVmMemory(e.target.value)}
                    className="w-full accent-purple-600"
                  />

                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>512 MB</span>
                    <span>8192 MB</span>
                  </div>
                </div>

              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={toggleVM}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    vmRunning
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  }`}
                >
                  <FaPlay />
                  {vmRunning ? "Stop VM" : "Start VM"}
                </button>

                <button
                  onClick={resetVM}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <FaRedo />
                  Reset
                </button>
              </div>
            </div>

            {/* VM TYPES */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FaServer />
                  </div>

                  <h3 className="font-bold text-gray-900">
                    Type 1 Hypervisor
                  </h3>
                </div>

                <p className="text-sm leading-6 text-gray-500">
                  Runs directly on physical hardware.
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Example: VMware ESXi, Microsoft Hyper-V.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <FaDesktop />
                  </div>

                  <h3 className="font-bold text-gray-900">
                    Type 2 Hypervisor
                  </h3>
                </div>

                <p className="text-sm leading-6 text-gray-500">
                  Runs as an application on a host operating system.
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Example: VirtualBox, VMware Workstation.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ================= CPU / GPU ================= */}

        {activeTab === "compute" && (
          <div className="space-y-6">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaMicrochip />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    CPU vs GPU Computing
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    CPUs are designed for general-purpose sequential and
                    parallel workloads, while GPUs contain many processing
                    units optimized for highly parallel computations.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">
                  <FaMicrochip />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  CPU
                </h3>

                <ul className="mt-4 space-y-2">
                  {[
                    "General-purpose processing",
                    "Complex control operations",
                    "Fewer powerful cores",
                    "Good for sequential workloads",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <FaCheckCircle className="shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl text-green-600">
                  <FaChartLine />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  GPU
                </h3>

                <ul className="mt-4 space-y-2">
                  {[
                    "Highly parallel processing",
                    "Many processing units",
                    "Useful for graphics and AI",
                    "High throughput workloads",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <FaCheckCircle className="shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* COMPUTE SIMULATION */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Interactive Simulation
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Compute Workload Simulation
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Workload
                    </label>

                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {workload}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={workload}
                    onChange={(e) => setWorkload(e.target.value)}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Compute Device
                  </label>

                  <select
                    value={computeMode}
                    onChange={(e) => setComputeMode(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="CPU">CPU</option>
                    <option value="GPU">GPU</option>
                  </select>
                </div>

              </div>

              <button
                onClick={runComputeSimulation}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaPlay />
                Run Computation
              </button>

              {computeResult && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-green-200 bg-green-50">
                  <div className="border-b border-green-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-600" />

                      <h3 className="font-bold text-green-800">
                        Simulation Result
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                        Device
                      </p>

                      <p className="mt-1 font-bold text-green-800">
                        {computeResult.mode}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                        Workload
                      </p>

                      <p className="mt-1 font-bold text-green-800">
                        {computeResult.workload}%
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                        Computation Units
                      </p>

                      <p className="mt-1 font-bold text-green-800">
                        {computeResult.estimatedTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CUDA */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaChartLine />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  CUDA and GPU Computing
                </h2>
              </div>

              <p className="text-sm leading-7 text-gray-500">
                CUDA is a parallel computing platform and programming
                model used to utilize NVIDIA GPUs for general-purpose
                computing. A large workload can be divided into many
                smaller tasks that execute in parallel on GPU processing
                resources.
              </p>

              <div className="mt-5 overflow-x-auto rounded-xl border border-purple-100 bg-purple-50 p-4">
                <p className="min-w-max text-sm font-semibold text-purple-700">
                  Application → CUDA Program → GPU Kernels → Parallel Threads → Result
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ================= WINDOWS PAGING ================= */}

        {activeTab === "paging" && (
          <div className="space-y-6">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaWindows />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Windows Paging Concepts
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    Modern Windows systems use virtual memory and paging
                    to provide processes with isolated virtual address spaces.
                    Pages can be mapped to physical memory frames and may also
                    be backed by secondary storage when necessary.
                  </p>
                </div>
              </div>
            </div>

            {/* PAGING SIMULATION */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Interactive Simulation
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Virtual-to-Physical Address Translation
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Page Number
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Frame Number
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={frameNumber}
                    onChange={(e) => setFrameNumber(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Offset
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={offset}
                    onChange={(e) => setOffset(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={translateAddress}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaPlay />
                  Translate Address
                </button>

                <button
                  onClick={resetPaging}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <FaRedo />
                  Reset
                </button>
              </div>

              {pagingResult && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-blue-200 bg-blue-50">
                  <div className="border-b border-blue-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-600" />

                      <h3 className="font-bold text-blue-800">
                        Translation Result
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-xl bg-white/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Page
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-800">
                        {pagingResult.page}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Frame
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-800">
                        {pagingResult.frame}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Offset
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-800">
                        {pagingResult.offset}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Physical Address
                      </p>

                      <p className="mt-1 break-words text-xl font-bold text-blue-800">
                        {pagingResult.physicalAddress}
                      </p>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* PAGING FLOW */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Paging Flow
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Simplified educational view of address translation
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    Step 1
                  </p>

                  <p className="mt-1 font-semibold text-blue-800">
                    Virtual Address
                  </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-green-600">
                    Step 2
                  </p>

                  <p className="mt-1 font-semibold text-green-800">
                    Page Number
                  </p>
                </div>

                <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                    Step 3
                  </p>

                  <p className="mt-1 font-semibold text-purple-800">
                    Page Table
                  </p>
                </div>

                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                    Step 4
                  </p>

                  <p className="mt-1 font-semibold text-orange-800">
                    Physical Frame
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= ACTIVITY LOG ================= */}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Simulation History
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Activity Log
              </h2>
            </div>

            <button
              onClick={clearLog}
              className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              <FaRedo />
              Clear Log
            </button>
          </div>

          <div className="mt-5">

            {activityLog.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <FaChartLine className="mx-auto mb-2 text-xl text-gray-300" />

                <p className="text-sm font-medium text-gray-500">
                  No activity yet.
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Run one of the simulations to generate activity.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {activityLog.map((log, index) => (
                  <div
                    key={index}
                    className="flex min-w-0 items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    <FaCheckCircle className="mt-0.5 shrink-0 text-green-500" />

                    <span className="min-w-0 break-words text-sm text-gray-700">
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* ================= EDUCATIONAL NOTE ================= */}

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <FaShieldAlt />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-blue-900">
                Educational Simulation
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-700">
                These demonstrations are educational simulations. They do not
                create actual virtual machines, execute CUDA programs, or
                modify the Windows memory manager on your computer.
              </p>
            </div>
          </div>

        </section>

      </div>
    </div>
  )
}

export default ModernOS