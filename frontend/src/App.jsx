import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";
import Fundamentals from "./pages/OS/Fundamentals";
import LinuxShell from "./pages/OS/LinuxShell";
import ProcessManagement from "./pages/OS/ProcessManagement";
import CPUScheduling from "./pages/OS/CPUScheduling";
import Threads from "./pages/OS/Threads";
import Concurrency from "./pages/OS/Concurrency";
import Synchronization from "./pages/OS/Synchronization";
import Deadlock from "./pages/OS/Deadlock";
import MemoryManagement from "./pages/OS/MemoryManagement";
import VirtualMemory from "./pages/OS/VirtualMemory";
import FileManagement from "./pages/OS/FileManagement";
import DiskScheduling from "./pages/OS/DiskScheduling";
import ModernOS from "./pages/OS/ModernOS";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Teams from "./pages/Teams";
import Tasks from "./pages/Tasks";
import Messages from "./pages/Messages";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Home Page */}
        <Route path="/" element={<Home />} />

        {/* Main Application Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/os/linux-shell" element={<LinuxShell />} />
            <Route path="/os/processes" element={<ProcessManagement />} />
            <Route path="/os/scheduling" element={<CPUScheduling />} />
            <Route path="/os/threads" element={<Threads />} />
            <Route path="/os/concurrency" element={<Concurrency />} />
            <Route path="/os/synchronization" element={<Synchronization />} />
            <Route path="/os/deadlock" element={<Deadlock />} />
            <Route path="/os/memory" element={<MemoryManagement />} />
            <Route path="/os/virtual-memory" element={<VirtualMemory />} />
            <Route path="/os/files" element={<FileManagement />} />
            <Route path="/os/disk-scheduling" element={<DiskScheduling />} />
            <Route path="/os/modern-os" element={<ModernOS />} />

            <Route path="/os/fundamentals" element={<Fundamentals />} />
          </Route>
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
