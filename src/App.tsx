import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider }        from '@tanstack/react-query'
import { Toaster }                                 from 'react-hot-toast'
import { useAuth }                                 from '@/hooks/useAuth'
import { Layout }                                  from '@/components/Layout'
import { SessionExpiredModal }                     from '@/components/SessionExpiredModal'
import Login                                       from '@/pages/Login'
import Dashboard                                   from '@/pages/Dashboard'
import TenantList                                  from '@/pages/tenants/TenantList'
import TenantDetail                                from '@/pages/tenants/TenantDetail'
import TenantForm                                  from '@/pages/tenants/TenantForm'
import UsersPage                                   from '@/pages/Users'

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } })

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index         element={<Dashboard />} />
            <Route path="cidades"           element={<TenantList />} />
            <Route path="cidades/nova"         element={<TenantForm />} />
            <Route path="cidades/:code"        element={<TenantDetail />} />
            <Route path="cidades/:code/editar" element={<TenantForm />} />
            <Route path="usuarios"             element={<UsersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <SessionExpiredModal />
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />
    </QueryClientProvider>
  )
}
