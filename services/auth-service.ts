const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
  },
]

// Mock JWT token generation
const generateToken = (user: { id: string; name: string; email: string }) => {
  // In a real app, this would be done on the server
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  }

  // This is just a mock token, not a real JWT
  return btoa(JSON.stringify(payload))
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }

    const data = await response.json()
    localStorage.setItem("token", data.token)

    return data.user
  } catch (error) {
    throw error
  }
}

export async function register(name: string, email: string, password: string) {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if user already exists
  if (MOCK_USERS.some((u) => u.email === email)) {
    throw new Error("User already exists")
  }

  // Create new user
  const newUser = {
    id: String(MOCK_USERS.length + 1),
    name,
    email,
    password,
  }

  // In a real app, this would be saved to a database
  MOCK_USERS.push(newUser)

  const token = generateToken({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  })

  localStorage.setItem("token", token)

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  }
}

export async function logout() {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  localStorage.removeItem("token")
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token")

  if (!token) {
    return null
  }

  try {
    // In a real app, you would verify the token on the server
    const decoded = JSON.parse(atob(token))

    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      localStorage.removeItem("token")
      return null
    }

    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
    }
  } catch (error) {
    localStorage.removeItem("token")
    return null
  }
}
