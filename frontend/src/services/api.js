import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { triggerForcedLogout } from './authEvents'

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8000/api'
  : 'http://127.0.0.1:8000/api'

// Public web API key — safe to embed client-side, same one used in your
// Firebase console's Project settings > General > Your apps.
const FIREBASE_WEB_API_KEY = 'AIzaSyDZacjvuyJQQi3sH-JWgyYwMnDN4KVEIYM'
const REFRESH_URL = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_WEB_API_KEY}`

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Silent token refresh on 401/403 ---
// Firebase ID tokens expire after 1 hour. When a request fails because of
// that, use the refresh_token (stored at login) to get a new ID token from
// Google's Secure Token API, then retry the original request once.
let isRefreshing = false
let refreshQueue = []

const processQueue = (error, newToken = null) => {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(newToken)))
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        })
      }

      isRefreshing = true
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token')
        if (!refreshToken) throw new Error('No refresh token available')

        const refreshResponse = await axios.post(
          REFRESH_URL,
          new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }).toString(),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )

        const newIdToken = refreshResponse.data.id_token
        const newRefreshToken = refreshResponse.data.refresh_token

        await AsyncStorage.setItem('auth_token', newIdToken)
        await AsyncStorage.setItem('refresh_token', newRefreshToken)

        processQueue(null, newIdToken)
        originalRequest.headers.Authorization = `Bearer ${newIdToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // Refresh token itself is invalid/expired — nothing left to do but
        // force a clean logout so the farmer re-authenticates normally.
        await AsyncStorage.multiRemove(['auth_token', 'auth_user', 'refresh_token'])
        triggerForcedLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export const getCropAdvisory = (crop_name, lang) =>
  api.get(`/crops/advisory/${encodeURIComponent(crop_name)}/`, {
    params: { lang },
  })

export const getCropAdvisoryList = (lang) =>
  api.get('/crops/advisory/', { params: { lang } })

export const loginUser = (username, password, lang) =>
  api.post('/users/login/', { username, password, lang })

export const registerUser = (data) =>
  api.post('/users/register/', data)

export const getProfile = () =>
  api.get('/users/profile/')

export const updateUserProfile = (data) =>
  api.patch('/users/profile/', data)

export const deleteUserAccount = () =>
  api.delete('/users/delete-account/')

export const getCrops = () =>
  api.get('/irrigation/crops/')

export const getIrrigationRecommendation = (crop_id, latitude, longitude, lang) =>
  api.post('/irrigation/recommend/', { crop_id, latitude, longitude, lang })

export const getIrrigationHistory = () =>
  api.get('/irrigation/history/')

export const getDiseaseForecast = (latitude, longitude, lang) =>
  api.post('/disease/forecast/', { latitude, longitude, lang })

export const updateLocation = (latitude, longitude) =>
  api.patch('/users/update-location/', { latitude, longitude })

export const getDiseaseAlerts = () =>
  api.get('/disease/alerts/')

export default api