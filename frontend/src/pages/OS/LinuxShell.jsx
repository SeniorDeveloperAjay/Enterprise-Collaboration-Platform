import { useState } from "react"
import {
  FaLinux,
  FaFolder,
  FaTerminal,
  FaUserShield,
  FaCogs,
  FaCheckCircle,
} from "react-icons/fa"

function LinuxShell() {
  const [command, setCommand] = useState("")
  const [terminalOutput, setTerminalOutput] = useState([
    "Welcome to the Enterprise OS Linux Shell Simulator.",
    "Type 'help' to see supported commands.",
  ])

  const commands = [
    {
      command: "pwd",
      description: "Display the current working directory",
    },
    {
      command: "ls",
      description: "List files and directories",
    },
    {
      command: "cd",
      description: "Change the current directory",
    },
    {
      command: "mkdir",
      description: "Create a new directory",
    },
    {
      command: "touch",
      description: "Create a new file",
    },
    {
      command: "whoami",
      description: "Display the current user",
    },
    {
      command: "ps",
      description: "Display running processes",
    },
    {
      command: "clear",
      description: "Clear the terminal",
    },
    {
      command: "help",
      description: "Display supported commands",
    },
  ]

  const handleCommand = (e) => {
    e.preventDefault()

    const input = command.trim()

    if (!input) {
      return
    }

    const parts = input.split(" ")
    const baseCommand = parts[0]
    const argument = parts.slice(1).join(" ")

    let output = ""

    switch (baseCommand) {
      case "pwd":
        output = "/home/ajay"
        break

      case "ls":
        output = `Documents
Downloads
Projects
notes.txt
report.pdf`
        break

      case "cd":
        if (!argument) {
          output = "Usage: cd <directory>"
        } else {
          output = `Changed directory to '${argument}'`
        }
        break

      case "mkdir":
        if (!argument) {
          output = "Usage: mkdir <directory>"
        } else {
          output = `Directory '${argument}' created successfully.`
        }
        break

      case "touch":
        if (!argument) {
          output = "Usage: touch <filename>"
        } else {
          output = `File '${argument}' created successfully.`
        }
        break

      case "whoami":
        output = "ajay"
        break

      case "ps":
        output = `PID     PROCESS
101     systemd
245     bash
312     chrome
401     vscode`
        break

      case "help":
        output = `Supported commands:

pwd       - Show current directory
ls        - List files and directories
cd        - Change directory
mkdir     - Create directory
touch     - Create file
whoami    - Show current user
ps        - Show running processes
clear     - Clear terminal
help      - Show available commands`
        break

      case "clear":
        setTerminalOutput([])
        setCommand("")
        return

      default:
        output = `Command not found: ${baseCommand}
Type 'help' to see supported commands.`
    }

    setTerminalOutput((previous) => [
      ...previous,
      `$ ${input}`,
      ...output.split("\n"),
    ])

    setCommand("")
  }

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
                Linux & Shell
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                Explore Linux architecture, commands, shell concepts and basic
                system administration through an interactive learning
                environment.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-2xl bg-gray-900 p-4 text-green-400 sm:flex">
              <FaLinux className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Linux Introduction */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-1 bg-blue-600" />

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-lg text-green-400 sm:h-12 sm:w-12">
                <FaLinux />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
                  Linux Operating System
                </h2>

                <p className="mt-2 text-sm leading-7 text-gray-600 sm:text-base">
                  Linux is an open-source operating system based on the Unix
                  operating system family. It provides a kernel, system
                  utilities, shells and other software components that allow
                  users and applications to interact with computer hardware.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Linux Architecture */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Linux Architecture
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              A simplified view of the major layers involved in a Linux
              system.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center transition hover:border-blue-200 hover:shadow-sm sm:p-6">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <FaLinux />
              </div>

              <p className="font-semibold text-gray-800">
                User Applications
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Editors, browsers, development tools and other applications.
              </p>
            </div>

            <div className="py-2 text-center text-lg font-semibold text-gray-400">
              ↓
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center transition hover:shadow-sm sm:p-6">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <FaTerminal />
              </div>

              <p className="font-semibold text-blue-700">
                Shell & System Utilities
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Provides command-line interaction and system utilities.
              </p>
            </div>

            <div className="py-2 text-center text-lg font-semibold text-blue-400">
              ↓
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-100 p-5 text-center transition hover:shadow-sm sm:p-6">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                <FaCogs />
              </div>

              <p className="font-semibold text-blue-800">
                Linux Kernel
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Manages processes, memory, devices, files and other resources.
              </p>
            </div>

            <div className="py-2 text-center text-lg font-semibold text-gray-400">
              ↓
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center transition hover:border-blue-200 hover:shadow-sm sm:p-6">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <FaLinux />
              </div>

              <p className="font-semibold text-gray-800">
                Hardware
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                CPU, memory, storage and input/output devices.
              </p>
            </div>
          </div>
        </section>

        {/* Linux File System */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Linux File System
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Common Linux directories and their basic purpose.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                name: "/home",
                description:
                  "Contains personal directories and files belonging to users.",
              },
              {
                name: "/etc",
                description:
                  "Contains many system configuration files.",
              },
              {
                name: "/var",
                description:
                  "Contains variable data such as logs and other changing files.",
              },
              {
                name: "/bin",
                description:
                  "Contains essential executable programs and commands.",
              },
              {
                name: "/tmp",
                description:
                  "Used for temporary files created by applications and processes.",
              },
              {
                name: "/dev",
                description:
                  "Provides interfaces for many devices available to the system.",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                  <FaFolder />
                </div>

                <h3 className="font-semibold text-gray-800">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Terminal */}
        <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-lg">
          {/* Terminal Header */}
          <div className="flex flex-col gap-3 border-b border-gray-700 bg-gray-900 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                <FaTerminal className="text-green-400" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  Linux Shell Simulator
                </p>

                <p className="text-xs text-gray-400">
                  Interactive command demonstration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Simulator Ready
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-4 sm:p-5">
            <div className="min-h-[280px] max-h-[400px] overflow-y-auto rounded-xl border border-gray-800 bg-black/30 p-4 font-mono text-xs sm:text-sm">
              {terminalOutput.length === 0 ? (
                <div className="text-gray-500">
                  Terminal cleared. Type a command to continue.
                </div>
              ) : (
                terminalOutput.map((line, index) => (
                  <div
                    key={index}
                    className={
                      line.startsWith("$")
                        ? "mb-1 break-words text-green-400"
                        : "whitespace-pre-line break-words text-gray-300"
                    }
                  >
                    {line}
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleCommand}
              className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20">
                <span className="shrink-0 font-mono text-sm text-green-400">
                  $
                </span>

                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Type a Linux command..."
                  aria-label="Linux shell command"
                  className="min-w-0 flex-1 bg-transparent font-mono text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="min-h-10 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
              >
                Run Command
              </button>
            </form>
          </div>
        </section>

        {/* Supported Commands */}
        <section>
          <div className="mb-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Essential Linux Commands
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Commands supported by the interactive Linux shell simulator.
                </p>
              </div>

              <span className="text-xs font-medium text-gray-400">
                {commands.length} commands
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {commands.map((item, index) => (
              <div
                key={item.command}
                className={`flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-6 ${
                  index !== commands.length - 1
                    ? "border-b border-gray-100"
                    : ""
                } hover:bg-gray-50`}
              >
                <div className="w-full shrink-0 sm:w-28">
                  <code className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-600">
                    {item.command}
                  </code>
                </div>

                <p className="min-w-0 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Shell Concepts */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600 sm:h-12 sm:w-12">
              <FaTerminal />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-gray-800">
                Shell & System Administration
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                A shell provides a command-line interface through which users
                can interact with the operating system. System administrators
                use shell commands and utilities to manage files, processes,
                users, permissions and system resources.
              </p>
            </div>
          </div>

          <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
            <div className="group min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-blue-100 hover:bg-white hover:shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <FaUserShield />
              </div>

              <h3 className="font-semibold text-gray-800">
                Users & Permissions
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Linux uses users, groups and permissions to control access to
                system resources.
              </p>
            </div>

            <div className="group min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-blue-100 hover:bg-white hover:shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <FaCogs />
              </div>

              <h3 className="font-semibold text-gray-800">
                Process Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Administrators can inspect and manage processes running on the
                system.
              </p>
            </div>

            <div className="group min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-blue-100 hover:bg-white hover:shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <FaFolder />
              </div>

              <h3 className="font-semibold text-gray-800">
                File Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Shell commands provide convenient ways to create, remove,
                organize and inspect files and directories.
              </p>
            </div>
          </div>
        </section>

        {/* Learning Note */}
        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
          <FaCheckCircle className="mt-1 shrink-0 text-blue-600" />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-blue-800">
              Interactive Learning Environment
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              The terminal above is an educational simulator. Commands
              demonstrate Linux shell concepts without modifying the actual
              computer's files or operating system.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LinuxShell