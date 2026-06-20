import { useState, FormEvent } from 'react'
import { useNavigate }         from 'react-router-dom'
import { Eye, EyeOff }        from 'lucide-react'
import toast                   from 'react-hot-toast'
import { useAuth }             from '@/hooks/useAuth'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Preencha todos os campos'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      toast.error('Credenciais inválidas')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0010' }}>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12"
        style={{ background: 'linear-gradient(160deg, #1a0028 0%, #0A0010 60%, #200012 100%)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(233,30,140,0.2)', border: '1px solid rgba(233,30,140,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 7v9c0 7 5.3 13.5 12 15.5C22.7 29.5 28 23 28 16V7L16 2z"
                fill="rgba(233,30,140,0.25)" stroke="#E91E8C" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none">Mulher Mais Segura</p>
            <p className="font-mono text-xs mt-0.5" style={{ color: 'rgba(233,30,140,0.6)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>
              Onboarding System
            </p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: 'rgba(255,255,255,0.92)' }}>
            Central de<br />
            <span style={{ color: '#E91E8C' }}>Implantação</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Gerencie cidades, gere QR Codes e acompanhe o status de cada implantação governamental da plataforma.
          </p>

          {/* Stats decorativos */}
          <div className="flex gap-6 mt-10">
            {[
              { label: 'Cidades ativas', value: '—' },
              { label: 'QR gerados',     value: '—' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold" style={{ color: '#E91E8C' }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Sistema restrito — acesso autorizado apenas
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#F8F5FA' }}>
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FCE4EC' }}>
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L4 7v9c0 7 5.3 13.5 12 15.5C22.7 29.5 28 23 28 16V7L16 2z"
                  fill="rgba(233,30,140,0.2)" stroke="#E91E8C" strokeWidth="2" />
              </svg>
            </div>
            <span className="font-bold text-sm text-gray-900">Mulher Mais Segura</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h2>
          <p className="text-sm text-gray-500 mb-8">Acesse o painel central de implantação</p>

          <form onSubmit={submit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@mulhermaisgura.gov.br"
                autoFocus
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all"
                style={{ border: '1.5px solid #EDE8F0', background: '#fff', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#E91E8C'}
                onBlur={e => e.target.style.borderColor = '#EDE8F0'}
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Senha</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all"
                  style={{ border: '1.5px solid #EDE8F0', background: '#fff', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#E91E8C'}
                  onBlur={e => e.target.style.borderColor = '#EDE8F0'}
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all mt-1 disabled:opacity-60"
              style={{
                background: loading ? '#C2185B' : 'linear-gradient(135deg, #E91E8C 0%, #C2185B 100%)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(233,30,140,0.35)',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar no painel'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Acesso restrito à equipe de implantação · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
