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
    console.log('Response: \n', config)
    return config
  },
  (error) => {
    if (!error.response) return Promise.reject(new NetworkError(error.message))

    const status = error.response.data.statusCode
    console.error(error.response.data)

    switch (status) {
      case 400:
        return Promise.reject(new BadRequest())
      case 401:
        return Promise.reject(new NotAuthenticatedError())
      case 403:
        return Promise.reject(new ForbiddenError())
      case 404:
        return Promise.reject(new NotFoundError())
      case 409:
        return Promise.reject(new ConflictError())
      case 410:
        return Promise.reject(new GoneError())
      case 500:
        return Promise.reject(new UnexpectedServerError())
      default:
        return Promise.reject(new UnexpectedServerError())
    }
  },
)

videoClient.interceptors.request.use(async (config) => {
  console.log('Sending:\n', config)

  const authStore = useAuthStore()
  if (authStore.authToken) {
    config.headers.Authorization = `Bearer ${authStore.authToken}`
  } else {
    console.log('not authenticated')
  }
  return config
})
