import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import { ShieldAlert }         from 'lucide-react'

export function SessionExpiredModal() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handle = () => setVisible(true)
    window.addEventListener('session-expired', handle)
    return () => window.removeEventListener('session-expired', handle)
  }, [])

  if (!visible) return null

  const goToLogin = () => {
    localStorage.removeItem('onboarding_token')
    localStorage.removeItem('onboarding_user')
    setVisible(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-sm w-full mx-4 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-100 mx-auto mb-4">
          <ShieldAlert size={24} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Sessão expirada</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Sua sessão foi encerrada por inatividade ou por ter sido aberta em outro dispositivo.
          Faça login novamente para continuar.
        </p>
        <button
          onClick={goToLogin}
          className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          Ir para o login
        </button>
      </div>
    </div>
  )
}
