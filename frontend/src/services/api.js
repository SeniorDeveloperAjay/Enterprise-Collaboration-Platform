const API_URL = "http://localhost:5000"

export const checkBackend = async () => {
  const response = await fetch(`${API_URL}/`)

  if (!response.ok) {
    throw new Error("Backend request failed")
  }

  return response.json()
}

// Employees
export const getEmployees = async () => {
  const response = await fetch(`${API_URL}/api/employees`)

  if (!response.ok) {
    throw new Error("Failed to fetch employees")
  }

  return response.json()
}

// Teams
export const getTeams = async () => {
  const response = await fetch(`${API_URL}/api/teams`)

  if (!response.ok) {
    throw new Error("Failed to fetch teams")
  }

  return response.json()
}

// Tasks
export const getTasks = async () => {
  const response = await fetch(`${API_URL}/api/tasks`)

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}

// Notifications
export const getNotifications = async () => {
  const response = await fetch(`${API_URL}/api/notifications`)

  if (!response.ok) {
    throw new Error("Failed to fetch notifications")
  }

  return response.json()
}