import React, { createContext, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationPrompted, setLocationPrompted] = useState(false)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token')
      const storedUser = await AsyncStorage.getItem('auth_user')
      const storedLocationPrompted = await AsyncStorage.getItem('location_prompted')
      if (storedToken) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
      if (storedLocationPrompted === 'true') {
        setLocationPrompted(true)
      }
    } catch (error) {
      console.log('Auth load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (tokenValue, userData) => {
    setToken(tokenValue)
    setUser(userData)
    await AsyncStorage.setItem('auth_token', tokenValue)
    await AsyncStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const logout = async () => {
    setToken(null)
    setUser(null)
    setLocationPrompted(false)
    await AsyncStorage.removeItem('auth_token')
    await AsyncStorage.removeItem('auth_user')
    await AsyncStorage.removeItem('location_prompted')
  }

  const markLocationPrompted = async () => {
    setLocationPrompted(true)
    await AsyncStorage.setItem('location_prompted', 'true')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, locationPrompted, markLocationPrompted }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)