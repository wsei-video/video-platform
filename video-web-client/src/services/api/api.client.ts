import axios, { type AxiosInstance } from 'axios'

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
      timeout: import.meta.env.VITE_API_TIMEOUT ?? 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  }

  public get<T>(url: string) {
    return this.instance.get<T>(url)
  }

  public post<T>(url: string, data: unknown) {
    return this.instance.post<T>(url, data)
  }
}

export default new ApiClient()
