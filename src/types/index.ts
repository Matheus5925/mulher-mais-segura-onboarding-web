export interface Tenant {
  id:            string
  code:          string
  name:          string
  state:         string
  apiUrl:        string
  adminUrl?:     string
  isActive:      boolean
  minAppVersion: string
  features:      string[]
  contactEmail?: string
  notes?:        string
  lastSeenAt?:   string
  createdAt:     string
  updatedAt:     string
}

export interface CreateTenantPayload {
  code:          string
  name:          string
  state:         string
  apiUrl:        string
  adminUrl?:     string
  contactEmail?: string
  minAppVersion?: string
  features?:     string[]
  notes?:        string
}

export interface UpdateTenantPayload extends Partial<Omit<CreateTenantPayload, 'code'>> {
  isActive?: boolean
}

export interface AuthTokens {
  accessToken: string
  name:        string
  email:       string
}
