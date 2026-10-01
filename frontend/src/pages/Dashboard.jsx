import { useEffect, useState } from "react";
import {
  checkBackend,
  getEmployees,
  getTeams,
  getTasks,
  getNotifications,
} from "../services/api";

import {
  FaUsers,
  FaUserFriends,
  FaTasks,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaProjectDiagram,
  FaMicrochip,
  FaArrowRight,
  FaServer,
  FaChartLine,
  FaCalendarAlt,
  FaLayerGroup,
  FaRocket,
} from "react-icons/fa";

function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  const [employeeCount, setEmployeeCount] = useState(null);
  const [teamCount, setTeamCount] = useState(null);
  const [pendingTaskCount, setPendingTaskCount] = useState(null);
  const [notificationCount, setNotificationCount] = useState(null);

  const [dataError, setDataError] = useState("");

  useEffect(() => {
    // Check backend connection
    checkBackend()
      .then((data) => {
        setBackendStatus(data.message);
      })
      .catch(() => {
        setBackendStatus("Backend connection failed");
      });

    // Load dashboard data
    Promise.all([getEmployees(), getTeams(), getTasks(), getNotifications()])
      .then(([employeeData, teamData, taskData, notificationData]) => {
        const employees = employeeData.employees || [];
        const teams = teamData.teams || [];
        const tasks = taskData.tasks || [];
        const notifications = notificationData.notifications || [];

        // Total employees
        setEmployeeCount(employees.length);

        // Active teams
        const activeTeams = teams.filter(
          (team) => String(team.status || "").toLowerCase() === "active",
        );

        setTeamCount(activeTeams.length);

        // Pending tasks
        const pendingTasks = tasks.filter(
          (task) => String(task.status || "").toLowerCase() === "pending",
        );

        setPendingTaskCount(pendingTasks.length);

        // Unread notifications
        const unreadNotifications = notifications.filter(
          (notification) =>
            String(notification.status || "").toLowerCase() === "unread",
        );

        setNotificationCount(unreadNotifications.length);

        setDataError("");
      })
      .catch((error) => {
        console.error("Dashboard data loading error:", error);

        setDataError(
          "Some dashboard data could not be loaded. Please check the backend.",
        );
      });
  }, []);

  const displayCount = (count) => {
    return count === null ? "..." : count;
  };

  const stats = [
    {
      title: "Employees",
      value: displayCount(employeeCount),
      icon: <FaUsers />,
      description: "Total employees",
      color: "blue",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    {
      title: "Active Teams",
      value: displayCount(teamCount),
      icon: <FaUserFriends />,
      description: "Teams currently active",
      color: "purple",
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700",
    },
    {
      title: "Pending Tasks",
      value: displayCount(pendingTaskCount),
      icon: <FaTasks />,
      description: "Tasks awaiting completion",
      color: "orange",
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
      valueColor: "text-orange-700",
    },
    {
      title: "Notifications",
      value: displayCount(notificationCount),
      icon: <FaBell />,
      description: "Unread notifications",
      color: "green",
      bg: "bg-green-50",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },
  ];

  const osModules = [
    {
      name: "Fundamentals",
      description: "OS basics, architecture and system calls",
      path: "/os/fundamentals",
      icon: <FaMicrochip />,
    },
    {
      name: "Linux & Shell",
      description: "Linux architecture, commands and shell",
      path: "/os/linux-shell",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Process Management",
      description: "Processes, states, PCB and scheduling",
      path: "/os/processes",
      icon: <FaUsers />,
    },
    {
      name: "CPU Scheduling",
      description: "FCFS, SJF, Priority, RR and MLQ",
      path: "/os/scheduling",
      icon: <FaClock />,
    },
    {
      name: "Threads",
      description: "Thread models, lifecycle and TCB",
      path: "/os/threads",
      icon: <FaUsers />,
    },
    {
      name: "Concurrency",
      description: "Race conditions and critical sections",
      path: "/os/concurrency",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Synchronization",
      description: "Peterson, Bakery, Semaphores and Monitors",
      path: "/os/synchronization",
      icon: <FaCheckCircle />,
    },
    {
      name: "Deadlock",
      description: "Prevention, avoidance and Banker's Algorithm",
      path: "/os/deadlock",
      icon: <FaTasks />,
    },
    {
      name: "Memory Management",
      description: "Allocation, paging and segmentation",
      path: "/os/memory",
      icon: <FaMicrochip />,
    },
    {
      name: "Virtual Memory",
      description: "Demand paging and page replacement",
      path: "/os/virtual-memory",
      icon: <FaMicrochip />,
    },
    {
      name: "File Management",
      description: "Files, directories and file operations",
      path: "/os/files",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Disk Scheduling",
      description: "FCFS, SSTF, SCAN, C-SCAN and LOOK",
      path: "/os/disk-scheduling",
      icon: <FaClock />,
    },
    {
      name: "Modern OS",
      description: "Virtualization, GPU and modern paging",
      path: "/os/modern-os",
      icon: <FaMicrochip />,
    },
  ];

  const quickAccess = [
    {
      title: "Employees",
      description: "Manage employee records",
      path: "/employees",
      icon: <FaUsers />,
    },
    {
      title: "Teams",
      description: "Manage organizational teams",
      path: "/teams",
      icon: <FaUserFriends />,
    },
    {
      title: "Tasks",
      description: "Track and manage tasks",
      path: "/tasks",
      icon: <FaTasks />,
    },
    {
      title: "Notifications",
      description: "View platform notifications",
      path: "/notifications",
      icon: <FaBell />,
    },
  ];

  const recentTasks = [
    {
      title: "Complete OS Project Documentation",
      department: "Computer Science",
      status: "In Progress",
      icon: <FaProjectDiagram />,
    },
    {
      title: "Review CPU Scheduling Module",
      department: "Computer Science",
      status: "Pending",
      icon: <FaClock />,
    },
    {
      title: "Update Employee Records",
      department: "HR",
      status: "Completed",
      icon: <FaCheckCircle />,
    },
    {
      title: "Prepare Team Presentation",
      department: "Management",
      status: "Pending",
      icon: <FaCalendarAlt />,
    },
  ];

  return (
    <div className="space-y-8 pb-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Enterprise Workspace
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-1">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor collaboration activities and operating system modules.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm w-fit">
          <FaChartLine className="text-blue-600" />
          <span className="text-sm font-medium text-gray-600">
            Platform Overview
          </span>
        </div>
      </div>

      {/* Backend / System Health */}
      <div className="bg-gradient-to-r from-white to-blue-50 border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
              <FaServer />
            </div>

            <div>
              <p className="text-sm text-gray-500">Backend Status</p>

              <p className="font-semibold text-gray-800 mt-1">
                {backendStatus}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-2 w-fit">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
            <span className="text-sm font-semibold text-green-700">
              System Connected
            </span>
          </div>
        </div>
      </div>

      {/* Data Error */}
      {dataError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
          {dataError}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h2
                  className={`text-3xl md:text-4xl font-bold ${stat.valueColor} mt-2`}
                >
                  {stat.value}
                </h2>

                <p className="text-xs md:text-sm text-gray-400 mt-2">
                  {stat.description}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.iconColor} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Work */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <FaTasks />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">Pending Work</h2>

              <p className="text-sm text-gray-500">Current task workload</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-orange-50/60 border border-orange-100 rounded-xl p-4">
            <div>
              <p className="text-sm text-gray-500">Pending Tasks</p>

              <p className="text-xs text-gray-400 mt-1">Awaiting completion</p>
            </div>

            <span className="text-3xl font-bold text-orange-600">
              {displayCount(pendingTaskCount)}
            </span>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <FaCheckCircle />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                System Overview
              </h2>

              <p className="text-sm text-gray-500">Current platform status</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-600 text-sm">Backend</span>

              <span className="text-green-600 font-semibold text-sm">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-600 text-sm">OS Modules</span>

              <span className="text-blue-600 font-semibold text-sm">13</span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
              <span className="text-gray-600 text-sm">Platform</span>

              <span className="text-gray-800 font-semibold text-sm text-right">
                Enterprise Collaboration
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Operating System Modules */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaMicrochip />
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                Operating System Modules
              </h2>
            </div>

            <p className="text-gray-500 mt-2">
              Interactive modules covering the complete OS syllabus
            </p>
          </div>

          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit">
            13 Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {osModules.map((module) => (
            <a
              key={module.name}
              href={module.path}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 no-underline"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  {module.icon}
                </div>

                <FaArrowRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>

              <h3 className="font-bold text-gray-800 mt-4">{module.name}</h3>

              <p className="text-sm text-gray-500 mt-2 leading-5">
                {module.description}
              </p>

              <div className="mt-4 text-sm font-semibold text-blue-600">
                Open Module
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FaRocket />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Quick Access</h2>
          </div>

          <p className="text-gray-500 mt-2">
            Quickly access collaboration features
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickAccess.map((item) => (
            <a
              key={item.title}
              href={item.path}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 no-underline"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                  {item.icon}
                </div>

                <FaArrowRight className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>

              <h3 className="font-bold text-gray-800 mt-4">{item.title}</h3>

              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <FaTasks />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                Recent Activity
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Recent enterprise activities and task updates
            </p>
          </div>

          <a
            href="/tasks"
            className="text-blue-600 text-sm font-semibold no-underline hover:text-blue-700 flex items-center gap-1"
          >
            View All
            <FaArrowRight className="text-xs" />
          </a>
        </div>

        <div className="space-y-3">
          {recentTasks.map((task, index) => (
            <div
              key={index}
              className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-white text-blue-600 border border-gray-100 flex items-center justify-center flex-shrink-0">
                {task.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{task.title}</h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {task.department}
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="text-xs text-gray-400">Task Activity</span>
                </div>
              </div>

              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold w-fit ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Note */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-lg">
            <FaMicrochip />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-800">Project Overview</h2>

              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                OS + Collaboration
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2 leading-6">
              The Operating System modules in this platform are interactive
              educational simulations. They demonstrate important OS concepts
              such as process management, CPU scheduling, synchronization,
              deadlocks, memory management, virtual memory, file management,
              disk scheduling and modern operating systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
