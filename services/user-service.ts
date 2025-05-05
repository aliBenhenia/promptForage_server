const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ProfileUpdateData {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}

export async function updateProfile(data: ProfileUpdateData): Promise<void> {
  try {
    const token = localStorage.getItem("token")

    // Determine if this is a password update or profile update
    const endpoint = data.currentPassword ? "/user/password" : "/user/profile"

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update profile")
    }

    // If we're updating profile info, update the stored user
    if (!data.currentPassword) {
      const userJson = localStorage.getItem("user")
      if (userJson) {
        const user = JSON.parse(userJson)
        if (data.name) user.name = data.name
        if (data.email) user.email = data.email
        localStorage.setItem("user", JSON.stringify(user))
      }
    }

    return Promise.resolve()
  } catch (error) {
    throw error
  }
}
