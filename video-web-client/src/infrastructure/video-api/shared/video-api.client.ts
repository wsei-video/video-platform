import axios from 'axios'

import {
  BadRequest,
  ConflictError,
  ForbiddenError,
  GoneError,
  NetworkError,
  NotAuthenticatedError,
  NotFoundError,
  UnexpectedServerError,
} from '@/domain/shared/error/error'
import { useAuthStore } from '@/store/auth.store'

export const videoClient = axios.create({
  baseURL: import.meta.env.VITE_VIDEO_API_URL,
  timeout: 2000,
})

videoClient.interceptors.response.use(
  async (config) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('test')
      }, 500)
    })
    console.log('Response:', config)
    return config
  },
  (error) => {
    if (!error.response) return Promise.reject(new NetworkError(error.message))

    const status = error.response.data.statusCode
    const reason = error.response.data.reason
    console.error(error.response.data)

    switch (status) {
      case 400:
        return Promise.reject(new BadRequest(reason))
      case 401:
        return Promise.reject(new NotAuthenticatedError(reason))
      case 403:
        return Promise.reject(new ForbiddenError(reason))
      case 404:
        return Promise.reject(new NotFoundError(reason))
      case 409:
        return Promise.reject(new ConflictError(reason))
      case 410:
        return Promise.reject(new GoneError(reason))
      case 500:
        return Promise.reject(new UnexpectedServerError(reason))
      default:
        return Promise.reject(new UnexpectedServerError(reason))
    }
  },
)

videoClient.interceptors.request.use(async (config) => {
  console.log('Sending:', config)

  const authStore = useAuthStore()
  if (authStore.authToken) {
    config.headers.Authorization = `Bearer ${authStore.authToken}`
  }
  return config
})
