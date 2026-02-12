/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance, type AxiosPromise, type InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '../stores/userStore'

const baseURL = `${import.meta.env.VITE_API_URL}/api`

let isRefreshing = false
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

const attachToken = (config: InternalAxiosRequestConfig) => {
  const { accessToken } = useUserStore.getState()
  if (accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}

const handle401 = async (error: any, instance: AxiosInstance): AxiosPromise<any> => {
  const originalRequest = error.config
  const status = error?.response?.status

  if (status !== 401 || originalRequest._retry || window.location.pathname === '/login') {
    return Promise.reject(error)
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
      .then((token) => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`
        return instance(originalRequest)
      })
      .catch((err) => Promise.reject(err))
  }

  originalRequest._retry = true
  isRefreshing = true

  const accessToken = useUserStore.getState().accessToken
  const refreshToken = useUserStore.getState().refreshToken

  if (!refreshToken) {
    useUserStore.getState().clearUser()
    return Promise.reject(error)
  }

  try {
    const refreshResponse = await axios.post(`${baseURL}/auth/refreshUser`, {
      accessToken,
      refreshToken,
    })

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data

    if (!newAccessToken || !newRefreshToken) {
      useUserStore.getState().clearUser()
      return Promise.reject(error)
    }

    useUserStore.getState().setUser(refreshResponse.data)

    axiosDefaultInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

    processQueue(null, newAccessToken)

    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
    return instance(originalRequest)
  } catch (err) {
    console.error('[Interceptor] Token refresh failed:', err)
    processQueue(err, null)
    useUserStore.getState().clearUser()
    return Promise.reject(err)
  } finally {
    isRefreshing = false
  }
}

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL })

  instance.interceptors.request.use(attachToken)
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const status = err?.response?.data?.status

      if (status === 401) return handle401(err, instance)

      return Promise.reject(err)
    }
  )

  return instance
}

export const axiosDefaultInstance = createAxiosInstance(baseURL)
