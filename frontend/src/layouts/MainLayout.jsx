import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserFriends,
  FaTasks,
  FaComments,
  FaFileAlt,
  FaBell,
  FaMicrochip,
  FaChevronDown,
} from "react-icons/fa";

function MainLayout() {
  const [osOpen, setOsOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const osModules = [
    { name: "Fundamentals", path: "/os/fundamentals" },
    { name: "Linux & Shell", path: "/os/linux-shell" },
    { name: "Process Management", path: "/os/processes" },
    { name: "CPU Scheduling", path: "/os/scheduling" },
    { name: "Threads", path: "/os/threads" },
    { name: "Concurrency", path: "/os/concurrency" },
    { name: "Synchronization", path: "/os/synchronization" },
    { name: "Deadlock", path: "/os/deadlock" },
    { name: "Memory Management", path: "/os/memory" },
    { name: "Virtual Memory", path: "/os/virtual-memory" },
    { name: "File Management", path: "/os/files" },
    { name: "Disk Scheduling", path: "/os/disk-scheduling" },
    { name: "Modern OS", path: "/os/modern-os" },
  ];

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Employees",
      path: "/employees",
      icon: <FaUsers />,
    },
    {
      name: "Teams",
      path: "/teams",
      icon: <FaUserFriends />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <FaTasks />,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: <FaComments />,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: <FaFileAlt />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <FaBell />,
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gray-100">

      {/* Top Navbar */}
      <nav className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-6">

        <h1 className="text-xl font-bold text-blue-600">
          Enterprise Collaboration Platform
        </h1>

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FaUsers />
          </div>

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.role || "Employee"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="ml-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-4rem)] min-h-0">

        {/* Sidebar */}
        <aside className="w-64 shrink-0 h-full overflow-y-auto bg-white border-r border-gray-200 p-4">

          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <span className="text-base">
                  {item.icon}
                </span>

                {item.name}
              </NavLink>
            ))}

          </div>

          {/* OS Management */}
          <div className="mt-8">

            <button
              onClick={() => setOsOpen(!osOpen)}
              className="w-full flex items-center justify-between px-3 mb-3"
            >

              <div className="flex items-center gap-2">

                <FaMicrochip className="text-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  OS Management
                </p>

              </div>

              <FaChevronDown
                className={`text-xs text-gray-400 transition-transform ${
                  osOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {osOpen && (
              <div className="space-y-1">

                {osModules.map((module) => (
                  <NavLink
                    key={module.path}
                    to={module.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm transition ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                      }`
                    }
                  >
                    {module.name}
                  </NavLink>
                ))}

              </div>
            )}

          </div>

        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default MainLayout;