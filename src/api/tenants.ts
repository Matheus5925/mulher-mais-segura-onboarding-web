import { client } from './client'
import type { Tenant, CreateTenantPayload, UpdateTenantPayload, AuthTokens } from '@/types'

export const auth = {
  login: (email: string, password: string) =>
    client.post<AuthTokens>('/auth/login', { email, password }).then(r => r.data),
}

export interface OnboardingUser {
  id:          string
  name:        string
  email:       string
  isActive:    boolean
  lastLoginAt?: string
  createdAt:   string
}

export const users = {
  list:   ()                                        => client.get<OnboardingUser[]>('/users').then(r => r.data),
  create: (name: string, email: string, password: string) =>
    client.post<OnboardingUser>('/users', { name, email, password }).then(r => r.data),
  update: (id: string, data: { name?: string; password?: string }) =>
    client.put<OnboardingUser>(`/users/${id}`, data).then(r => r.data),
  remove: (id: string) => client.delete(`/users/${id}`).then(r => r.data),
}

export interface SetupAdminPayload {
  name:     string
  email:    string
  password: string
  phone?:   string
}

export const tenants = {
  list:       ()             => client.get<Tenant[]>('/tenants').then(r => r.data),
  get:        (code: string) => client.get<Tenant>(`/tenants/${code}`).then(r => r.data),
  create:     (payload: CreateTenantPayload) => client.post<Tenant>('/tenants', payload).then(r => r.data),
  update:     (code: string, payload: UpdateTenantPayload) => client.put<Tenant>(`/tenants/${code}`, payload).then(r => r.data),
  deactivate: (code: string) => client.delete(`/tenants/${code}`).then(r => r.data),
  ping:       (code: string) => client.post(`/tenants/${code}/ping`),
  setupAdmin: (code: string, payload: SetupAdminPayload) =>
    client.post(`/tenants/${code}/setup-admin`, payload).then(r => r.data),
}
