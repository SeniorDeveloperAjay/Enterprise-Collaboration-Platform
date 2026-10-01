const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Enterprise Collaboration Platform Backend is Running!",
  });
});
const User = require("./User");
const Employee = require("./Employee");
const Team = require("./Team");
const Task = require("./Task");
const Message = require("./Message");
const Document = require("./Document");
const Notification = require("./Notification");

app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});
app.post("/api/employees", async (req, res) => {
  try {
    const { employeeId, name, email, department, position } = req.body;

    const employee = new Employee({
      employeeId,
      name,
      email,
      department,
      position,
    });

    await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create employee",
      error: error.message,
    });
  }
});
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.json({
      employees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
});
app.put("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { employeeId, name, email, department, position, status } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        employeeId,
        name,
        email,
        department,
        position,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update employee",
      error: error.message,
    });
  }
});
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json({
      message: "Employee deleted successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    });
  }
});
// ==================== TEAM ROUTES ====================

app.post("/api/teams", async (req, res) => {
  try {
    const { teamId, name, department, description, leader } = req.body;

    const team = new Team({
      teamId,
      name,
      department,
      description,
      leader,
    });

    await team.save();

    res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create team",
      error: error.message,
    });
  }
});
app.get("/api/teams", async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });

    res.json({
      teams,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch teams",
      error: error.message,
    });
  }
});
app.put("/api/teams/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { teamId, name, department, description, leader, status } = req.body;

    const team = await Team.findByIdAndUpdate(
      id,
      {
        teamId,
        name,
        department,
        description,
        leader,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    res.json({
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update team",
      error: error.message,
    });
  }
});
app.delete("/api/teams/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    res.json({
      message: "Team deleted successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete team",
      error: error.message,
    });
  }
});
// Create Task
app.post("/api/tasks", async (req, res) => {
  try {
    const {
      taskId,
      title,
      description,
      assignedTo,
      department,
      priority,
      status,
      dueDate,
    } = req.body;

    const task = new Task({
      taskId,
      title,
      description,
      assignedTo,
      department,
      priority,
      status,
      dueDate,
    });

    await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});
// Get All Tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});
// Update Task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      taskId,
      title,
      description,
      assignedTo,
      department,
      priority,
      status,
      dueDate,
    } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      {
        taskId,
        title,
        description,
        assignedTo,
        department,
        priority,
        status,
        dueDate,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});
// Delete Task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});
// ================= MESSAGE ROUTES =================

// Create Message
app.post("/api/messages", async (req, res) => {
  try {
    const { messageId, sender, recipient, subject, content, status } = req.body;

    const message = new Message({
      messageId,
      sender,
      recipient,
      subject,
      content,
      status,
    });

    await message.save();

    res.status(201).json({
      message: "Message created successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create message",
      error: error.message,
    });
  }
});

// Get All Messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.json({
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// Update Message
app.put("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { messageId, sender, recipient, subject, content, status } = req.body;

    const message = await Message.findByIdAndUpdate(
      id,
      {
        messageId,
        sender,
        recipient,
        subject,
        content,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message",
      error: error.message,
    });
  }
});

// Delete Message
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message deleted successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
    });
  }
});
// ================= DOCUMENT ROUTES =================

// Create Document
app.post("/api/documents", async (req, res) => {
  try {
    const {
      documentId,
      title,
      description,
      uploadedBy,
      department,
      category,
      status,
    } = req.body;

    const document = new Document({
      documentId,
      title,
      description,
      uploadedBy,
      department,
      category,
      status,
    });

    await document.save();

    res.status(201).json({
      message: "Document created successfully",
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create document",
      error: error.message,
    });
  }
});

// Get All Documents
app.get("/api/documents", async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });

    res.json({
      documents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
});

// Update Document
app.put("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      documentId,
      title,
      description,
      uploadedBy,
      department,
      category,
      status,
    } = req.body;

    const document = await Document.findByIdAndUpdate(
      id,
      {
        documentId,
        title,
        description,
        uploadedBy,
        department,
        category,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json({
      message: "Document updated successfully",
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update document",
      error: error.message,
    });
  }
});

// Delete Document
app.delete("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json({
      message: "Document deleted successfully",
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
});
// ================= NOTIFICATION ROUTES =================

// Create Notification
app.post("/api/notifications", async (req, res) => {
  try {
    const { notificationId, recipient, title, message, type, status } =
      req.body;

    const notification = new Notification({
      notificationId,
      recipient,
      title,
      message,
      type,
      status,
    });

    await notification.save();

    res.status(201).json({
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create notification",
      error: error.message,
    });
  }
});

// Get All Notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    res.json({
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
});

// Update Notification
app.put("/api/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { notificationId, recipient, title, message, type, status } =
      req.body;

    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        notificationId,
        recipient,
        title,
        message,
        type,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification",
      error: error.message,
    });
  }
});

// Delete Notification
app.delete("/api/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notification",
      error: error.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
