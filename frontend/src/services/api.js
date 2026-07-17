import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

export const getCropAdvisory = (crop_name, lang) =>
  api.get(`/crops/advisory/${encodeURIComponent(crop_name)}/`, {
    params: { lang },
  })
  
export const loginUser = (username, password, lang) =>
  api.post('/users/login/', { username, password, lang })

export const registerUser = (data) =>
  api.post('/users/register/', data)

export const getProfile = () =>
  api.get('/users/profile/')

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