import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MapPin, Users, LogOut, ShieldCheck, Globe, Activity } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/',         label: 'Dashboard', Icon: LayoutDashboard, hint: 'Visão geral' },
  { to: '/cidades',  label: 'Cidades',   Icon: MapPin,          hint: 'Tenants ativos' },
  { to: '/usuarios', label: 'Usuários',  Icon: Users,           hint: 'Acesso ao painel' },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Sessão encerrada')
    navigate('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col z-40" style={{ width: 228, background: '#0A0010' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(233,30,140,0.12)' }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
          style={{ background: 'rgba(233,30,140,0.18)', border: '1px solid rgba(233,30,140,0.35)' }}>
          <ShieldCheck size={16} className="text-pink-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Mulher + Segura</p>
          <p className="font-mono mt-0.5" style={{ color: 'rgba(233,30,140,0.6)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>
            Onboarding
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, label, Icon, hint }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgba(233,30,140,0.18)',
              borderLeft: '2px solid #E91E8C',
            } : { borderLeft: '2px solid transparent' }}
          >
            <Icon size={15} className="shrink-0" />
            <span className="flex-1">{label}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-white/30" style={{ fontSize: 9 }}>
              {hint}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Discovery API badge */}
      <div className="px-4 pb-4 shrink-0">
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={11} className="text-pink-500" />
            <span className="font-mono text-pink-600" style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>Discovery API</span>
          </div>
          <p className="font-mono text-white/30 truncate" style={{ fontSize: 10 }}>
            {import.meta.env.VITE_ONBOARDING_API_URL ?? 'localhost:3100'}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 font-mono" style={{ fontSize: 9 }}>online</span>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-4 pb-5 shrink-0" style={{ borderTop: '1px solid rgba(233,30,140,0.1)' }}>
        <div className="flex items-center gap-3 pt-4 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
            style={{ background: 'rgba(233,30,140,0.3)', border: '1px solid rgba(233,30,140,0.4)' }}>
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name ?? 'Admin'}</p>
            <p className="font-mono truncate" style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <LogOut size={13} />
          Encerrar sessão
        </button>
      </div>
    </aside>
  )
}
