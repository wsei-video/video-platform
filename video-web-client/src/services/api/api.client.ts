import axios, { type AxiosInstance } from 'axios'

class ApiClient {
  private isntance: AxiosInstance

  constructor() {
    this.isntance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: import.meta.env.VITE_API_TIMEOUT ?? 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  }

  public get<T>(url: string) {
    return this.isntance.get<T>(url)
  }

  public post<T>(url: string, data: unknown) {
    return this.isntance.post<T>(url, data)
  }
}

export default new ApiClient()
