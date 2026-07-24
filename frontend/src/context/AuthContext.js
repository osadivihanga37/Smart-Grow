import React, { createContext, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setLogoutHandler } from '../services/authEvents'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationPrompted, setLocationPrompted] = useState(false)
  const [notificationPrompted, setNotificationPrompted] = useState(false)

  useEffect(() => {
    loadStoredAuth()
    // Let api.js force a logout (clears React state) if token refresh fails.
    setLogoutHandler(logout)
  }, [])

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token')
      const storedUser = await AsyncStorage.getItem('auth_user')
      const storedLocationPrompted = await AsyncStorage.getItem('location_prompted')
      const storedNotificationPrompted = await AsyncStorage.getItem('notification_prompted')
      if (storedToken) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
      if (storedLocationPrompted === 'true') {
        setLocationPrompted(true)
      }
      if (storedNotificationPrompted === 'true') {
        setNotificationPrompted(true)
      }
    } catch (error) {
      console.log('Auth load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (tokenValue, userData, refreshTokenValue) => {
    setToken(tokenValue)
    setUser(userData)
    await AsyncStorage.setItem('auth_token', tokenValue)
    await AsyncStorage.setItem('auth_user', JSON.stringify(userData))
    if (refreshTokenValue) {
      await AsyncStorage.setItem('refresh_token', refreshTokenValue)
    }
  }

  const logout = async () => {
    setToken(null)
    setUser(null)
    setLocationPrompted(false)
    setNotificationPrompted(false)
    await AsyncStorage.removeItem('auth_token')
    await AsyncStorage.removeItem('auth_user')
    await AsyncStorage.removeItem('location_prompted')
    await AsyncStorage.removeItem('notification_prompted')
    await AsyncStorage.removeItem('refresh_token')
  }

  const markLocationPrompted = async () => {
    setLocationPrompted(true)
    await AsyncStorage.setItem('location_prompted', 'true')
  }

  const markNotificationPrompted = async () => {
    setNotificationPrompted(true)
    await AsyncStorage.setItem('notification_prompted', 'true')
  }

  return (
    <AuthContext.Provider
      value={{
        token, user, login, logout, loading,
        locationPrompted, markLocationPrompted,
        notificationPrompted, markNotificationPrompted,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)