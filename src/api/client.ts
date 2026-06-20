import axios from 'axios'

const BASE = import.meta.env.VITE_ONBOARDING_API_URL ?? 'http://localhost:3100'

export const client = axios.create({
  baseURL: `${BASE}/v1`,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('onboarding_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

client.interceptors.response.use(
  res => res,
  err => {
    const isLoginRequest = err.config?.url?.includes('/auth/login')
    if (err.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('onboarding_token')
      localStorage.removeItem('onboarding_user')
      window.dispatchEvent(new CustomEvent('session-expired'))
    }
    return Promise.reject(err)
  },
)

export const ONBOARDING_BASE = BASE
