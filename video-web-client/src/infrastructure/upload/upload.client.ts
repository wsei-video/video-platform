import axios from 'axios'

export const uploadClientSimple = axios.create({
  baseURL: import.meta.env.VITE_UPLOAD_API_URL,
})
