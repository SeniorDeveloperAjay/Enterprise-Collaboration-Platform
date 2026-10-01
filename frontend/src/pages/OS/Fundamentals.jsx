import { useState } from "react"
import {
  FaDesktop,
  FaCogs,
  FaLayerGroup,
  FaMemory,
  FaServer,
  FaTerminal,
  FaMicrochip,
  FaFolderOpen,
  FaShieldAlt,
  FaKeyboard,
  FaClock,
  FaExchangeAlt,
  FaCheckCircle,
} from "react-icons/fa"

function Fundamentals() {
  const [selectedTopic, setSelectedTopic] = useState("Operating System")

  const topics = [
    {
      title: "Operating System",
      description:
        "An operating system manages computer hardware and provides services for application programs.",
      icon: <FaDesktop />,
      details:
        "An operating system is system software that acts as an interface between users, application programs and computer hardware. It manages system resources and provides an environment in which programs can execute.",
    },
    {
      title: "OS Functions",
      description:
        "The operating system manages processes, memory, files, devices and other system resources.",
      icon: <FaCogs />,
      details:
        "Major operating system functions include process management, memory management, file management, device management, security and protection, and providing user interfaces.",
    },
    {
      title: "OS Architecture",
      description:
        "Operating systems can be organized using approaches such as simple, monolithic, microkernel and layered architectures.",
      icon: <FaLayerGroup />,
      details:
        "OS architecture describes how different operating system components are organized and interact. Common approaches include simple architecture, monolithic architecture, microkernel architecture and layered architecture.",
    },
    {
      title: "Kernel & User Space",
      description:
        "The kernel operates with privileged access while user applications normally execute in user space.",
      icon: <FaServer />,
      details:
        "The kernel is the core part of an operating system and manages privileged system resources. User space provides an environment where normal application programs execute with restricted access.",
    },
    {
      title: "Types of Operating Systems",
      description:
        "Operating systems include batch, multiprogramming, multitasking, real-time and multiprocessor systems.",
      icon: <FaMemory />,
      details:
        "Operating systems can be classified according to how they manage jobs, processes and hardware resources. Examples include batch systems, multiprogramming systems, multitasking systems, real-time systems and multiprocessor systems.",
    },
    {
      title: "System Calls",
      description:
        "System calls provide an interface through which programs can request services from the operating system.",
      icon: <FaTerminal />,
      details:
        "System calls allow application programs to request services from the operating system kernel. They provide a controlled interface between user programs and operating system services.",
    },
  ]

  const services = [
    {
      title: "Process Management",
      description:
        "Creates, schedules and terminates processes while managing CPU execution.",
      icon: <FaMicrochip />,
    },
    {
      title: "Memory Management",
      description:
        "Manages main memory and allocates memory space to running processes.",
      icon: <FaMemory />,
    },
    {
      title: "File Management",
      description:
        "Organizes files and directories and manages storage-related operations.",
      icon: <FaFolderOpen />,
    },
    {
      title: "Device Management",
      description:
        "Controls input/output devices and coordinates communication with hardware.",
      icon: <FaKeyboard />,
    },
    {
      title: "Security & Protection",
      description:
        "Controls access to system resources and protects programs and data.",
      icon: <FaShieldAlt />,
    },
    {
      title: "User Interface",
      description:
        "Provides ways for users to interact with the operating system.",
      icon: <FaDesktop />,
    },
  ]

  const architectureTypes = [
    {
      title: "Simple Architecture",
      description:
        "A basic organization where operating system components have limited structural separation.",
    },
    {
      title: "Monolithic Architecture",
      description:
        "Major operating system services operate together within a large kernel.",
    },
    {
      title: "Microkernel Architecture",
      description:
        "Only essential services remain in the kernel while other services can operate outside it.",
    },
    {
      title: "Layered Architecture",
      description:
        "The operating system is organized into layers, with each layer providing services to the layer above it.",
    },
  ]

  const osTypes = [
    {
      title: "Batch OS",
      description:
        "Jobs are collected and processed in batches with limited direct interaction.",
      icon: <FaClock />,
    },
    {
      title: "Multiprogramming OS",
      description:
        "Multiple programs are kept in memory so CPU utilization can be improved.",
      icon: <FaMicrochip />,
    },
    {
      title: "Multitasking OS",
      description:
        "Allows multiple tasks to share CPU execution through scheduling.",
      icon: <FaExchangeAlt />,
    },
    {
      title: "Real-Time OS",
      description:
        "Designed to respond to events within specified timing requirements.",
      icon: <FaClock />,
    },
    {
      title: "Multiprocessor OS",
      description:
        "Supports systems containing multiple processors working together.",
      icon: <FaMicrochip />,
    },
  ]

  const selectedTopicDetails =
    topics.find((topic) => topic.title === selectedTopic)?.details

  return (
    <div className="min-h-full w-full min-w-0 overflow-x-hidden bg-gray-50/70">
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-7 px-3 py-4 sm:px-5 md:px-6 lg:px-8">

        {/* Page Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-600">
                  OS MANAGEMENT
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  UNIT 1
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
                Operating System Fundamentals
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                Explore the fundamental concepts, architecture, services and
                responsibilities of an operating system.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-2xl bg-blue-50 p-4 text-blue-600 sm:flex">
              <FaDesktop className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="h-1 bg-blue-600" />

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600 sm:h-12 sm:w-12">
                <FaDesktop />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
                  What is an Operating System?
                </h2>

                <p className="mt-2 text-sm leading-7 text-gray-600 sm:text-base">
                  An operating system is system software that acts as an
                  interface between users, application programs and computer
                  hardware. It manages system resources and provides an
                  environment in which programs can execute.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Concepts */}
        <section>
          <div className="mb-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Core Concepts
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select a concept to explore its role in an operating system.
                </p>
              </div>

              <span className="text-xs font-medium text-gray-400">
                {topics.length} concepts
              </span>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topics.map((topic) => {
              const isSelected = selectedTopic === topic.title

              return (
                <button
                  key={topic.title}
                  type="button"
                  onClick={() => setSelectedTopic(topic.title)}
                  aria-pressed={isSelected}
                  className={`group min-w-0 rounded-2xl border bg-white p-5 text-left transition duration-200 sm:p-6 ${
                    isSelected
                      ? "border-blue-500 shadow-md ring-1 ring-blue-100"
                      : "border-gray-200 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-lg transition ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                    }`}
                  >
                    {topic.icon}
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`min-w-0 text-base font-semibold sm:text-lg ${
                        isSelected ? "text-blue-700" : "text-gray-800"
                      }`}
                    >
                      {topic.title}
                    </h3>

                    {isSelected && (
                      <FaCheckCircle className="mt-1 shrink-0 text-sm text-blue-600" />
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {topic.description}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Selected Topic Details */}
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 shadow-sm">
          <div className="flex items-start gap-3 p-5 sm:p-6">
            <FaCheckCircle className="mt-1 shrink-0 text-blue-600" />

            <div className="min-w-0">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                Selected Concept
              </div>

              <h2 className="text-lg font-semibold text-blue-800 sm:text-xl">
                {selectedTopic}
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-700 sm:text-base">
                {selectedTopicDetails}
              </p>
            </div>
          </div>
        </section>

        {/* OS Services */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Major Operating System Services
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
              The operating system provides several services for managing
              computer resources and supporting application programs.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-blue-600 transition group-hover:bg-blue-50">
                  {service.icon}
                </div>

                <h3 className="font-semibold text-gray-800">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Overview */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              OS Architecture
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Different architectural approaches organize operating system
              components in different ways.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            {architectureTypes.map((architecture, index) => (
              <div
                key={architecture.title}
                className="group min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-blue-600 shadow-sm">
                    {index + 1}
                  </span>

                  <h3 className="min-w-0 font-semibold text-gray-800">
                    {architecture.title}
                  </h3>
                </div>

                <p className="text-sm leading-6 text-gray-500">
                  {architecture.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* User Mode vs Kernel Mode */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              User Mode vs Kernel Mode
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Operating systems separate normal application execution from
              privileged kernel operations.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <FaDesktop />
                </div>

                <h3 className="font-semibold text-gray-800">
                  User Mode
                </h3>
              </div>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                <li>• Normal application programs execute here.</li>
                <li>• Access to system resources is restricted.</li>
                <li>
                  • Programs request protected services through system calls.
                </li>
              </ul>
            </div>

            <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <FaServer />
                </div>

                <h3 className="font-semibold text-blue-800">
                  Kernel Mode
                </h3>
              </div>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
                <li>• The operating system kernel executes here.</li>
                <li>• Privileged access to system resources is available.</li>
                <li>
                  • Hardware and critical system operations are managed here.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Types of Operating Systems */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Types of Operating Systems
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
              Common operating system types based on their processing and
              resource-management characteristics.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {osTypes.map((type) => (
              <div
                key={type.title}
                className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                  {type.icon}
                </div>

                <h3 className="font-semibold text-gray-800">
                  {type.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* System Calls */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600 sm:h-12 sm:w-12">
                <FaTerminal />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-gray-800">
                  System Calls
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                  System calls provide an interface through which application
                  programs can request services from the operating system.
                </p>
              </div>
            </div>

            {/* System Call Flow */}
            <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
              <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
                <FaDesktop className="mx-auto mb-3 text-xl text-blue-600" />

                <h3 className="font-semibold text-gray-800">
                  Application
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Program requests an operating system service.
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
                <FaTerminal className="mx-auto mb-3 text-xl text-blue-600" />

                <h3 className="font-semibold text-blue-800">
                  System Call
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Controlled interface to request the service.
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
                <FaServer className="mx-auto mb-3 text-xl text-blue-600" />

                <h3 className="font-semibold text-gray-800">
                  Kernel
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Kernel performs the requested protected operation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Basic System Structure */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Basic System Structure
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
              A simplified view of how users and applications interact with
              computer hardware through the operating system.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
            <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center transition hover:border-blue-100 hover:shadow-sm">
              <FaDesktop className="mx-auto mb-3 text-xl text-blue-600" />

              <p className="font-semibold text-gray-800">
                Users & Applications
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Programs and users request system services.
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-blue-100 bg-blue-50 p-5 text-center transition hover:shadow-sm">
              <FaServer className="mx-auto mb-3 text-xl text-blue-600" />

              <p className="font-semibold text-blue-700">
                Operating System
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Manages resources and provides system services.
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center transition hover:border-blue-100 hover:shadow-sm">
              <FaMicrochip className="mx-auto mb-3 text-xl text-blue-600" />

              <p className="font-semibold text-gray-800">
                Hardware
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                CPU, memory, storage and I/O devices.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Fundamentals