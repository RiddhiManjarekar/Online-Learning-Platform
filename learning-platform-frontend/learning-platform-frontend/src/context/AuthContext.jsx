
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore the logged-in user's session after page refresh
  useEffect(() => {
    let active = true

    async function restoreSession() {
      const token = sessionStorage.getItem('token')

      if (!token) {
        if (active) {
          setLoading(false)
        }
        return
      }

      try {
        const currentUser = await authService.getCurrentUser()

        if (active) {
          setUser(currentUser)
        }
      } catch (error) {
        sessionStorage.removeItem('token')

        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [])

  // Login
  async function login(credentials) {
    const result = await authService.login(credentials)

    sessionStorage.setItem('token', result.token)
    setUser(result.user)

    return result.user
  }

  // Register
  async function register(userData) {
    const result = await authService.register(userData)

    sessionStorage.setItem('token', result.token)
    setUser(result.user)

    return result.user
  }

  const updateUser = (updatedUser) => {
  setUser(updatedUser)
}

  // Logout
  function logout() {
    sessionStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}
