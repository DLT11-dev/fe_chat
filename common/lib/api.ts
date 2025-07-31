import { redirect } from 'next/navigation'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { localStorageFunc } from '@/common/helpers'
import PAGE_URLS from '@/common/constants/pageUrls'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

console.log('API_BASE_URL', API_BASE_URL)

const parseToken = (token: string) => {
  return `Bearer ${token}`
}

// Helper function to get token from auth store
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const auth = JSON.parse(authStorage)
        return auth.state?.token || null
      } catch (error) {
        console.error('Error parsing auth storage:', error)
        return null
      }
    }
  }
  return null
}

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const auth = JSON.parse(authStorage)
        return auth.state?.refreshToken || null
      } catch (error) {
        console.error('Error parsing auth storage:', error)
        return null
      }
    }
  }
  return null
}

class HttpService {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // Request interceptor
    this.axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken()
        
        if (token && config.headers) {
          config.headers.Authorization = parseToken(token)
        } else {
          console.log('❌ No token found for request:', config.url)
        }
        
        return config
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const statusCode = error?.response?.status
        const message = error?.response?.data?.message || error?.response?.statusText

        if (statusCode === 500) {
          redirect('/global-error')
        }

        if (statusCode === 401) {
          console.log('Token is expired, refreshing token ...')
          const refreshToken = getRefreshToken()

          if (!refreshToken) {
            // Clear tokens and redirect to login
            localStorage.removeItem('auth-storage')
            redirect(PAGE_URLS.LOGIN)
            return
          }

          try {
            // Call refresh token API
            const response = await this.axios.post(`${PAGE_URLS.REFRESH_TOKEN}`, {
              refresh_token: refreshToken
            })

            const { access_token, refresh_token } = response.data

            // Update tokens in auth store
            if (typeof window !== 'undefined') {
              const authStorage = localStorage.getItem('auth-storage')
              if (authStorage) {
                try {
                  const auth = JSON.parse(authStorage)
                  auth.state.token = access_token
                  auth.state.refreshToken = refresh_token
                  localStorage.setItem('auth-storage', JSON.stringify(auth))
                } catch (error) {
                  console.error('Error updating auth storage:', error)
                }
              }
            }

            // Retry original request
            if (error.config) {
              error.config.headers.Authorization = parseToken(access_token)
              return this.axios(error.config)
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            localStorage.removeItem('auth-storage')
            redirect(PAGE_URLS.LOGIN)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.delete<T>(url, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.patch<T>(url, data, config)
    return response.data
  }
}

const httpService = new HttpService()

export default httpService
