import { useQuery }      from '@tanstack/react-query'
import { Link }           from 'react-router-dom'
import { MapPin, Wifi, XCircle, CheckCircle2, Plus, ArrowRight, Activity } from 'lucide-react'
import { tenants }        from '@/api/tenants'
import { StatusBadge }    from '@/components/StatusBadge'
import type { Tenant }    from '@/types'

function StatCard({ label, value, icon: Icon, color, to }: { label: string; value: number; icon: any; color: string; to?: string }) {
  const inner = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
    </div>
  )
  if (to) return (
    <Link to={to} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all group block">
      {inner}
      <p className="text-xs text-brand-500 mt-3 opacity-0 group-hover:opacity-100 transition-opacity font-medium">Ver cidades →</p>
    </Link>
  )
  return <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">{inner}</div>
}

function isOnline(t: Tenant) {
  return t.lastSeenAt && Date.now() - new Date(t.lastSeenAt).getTime() < 5 * 60 * 1000
}

export default function Dashboard() {
  const { data = [], isLoading } = useQuery({ queryKey: ['tenants'], queryFn: tenants.list, refetchInterval: 30_000 })

  const total    = data.length
  const active   = data.filter(t => t.isActive).length
  const inactive = data.filter(t => !t.isActive).length
  const online   = data.filter(t => t.isActive && isOnline(t)).length

  const recent = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral das cidades implantadas</p>
        </div>
        <Link
          to="/cidades/nova"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
        >
          <Plus size={16} /> Nova Cidade
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Cidades" value={total}    icon={MapPin}       color="bg-brand-50 text-brand-600"     to="/cidades" />
        <StatCard label="Ativas"           value={active}   icon={CheckCircle2} color="bg-green-50 text-green-600"     to="/cidades?status=active" />
        <StatCard label="Inativas"         value={inactive} icon={XCircle}      color="bg-gray-100 text-gray-500"      to="/cidades?status=inactive" />
        <StatCard label="Online Agora"     value={online}   icon={Wifi}         color="bg-emerald-50 text-emerald-600" to="/cidades?status=online" />
      </div>

      {/* Recent tenants */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-brand-600" />
            <h2 className="font-semibold text-gray-800 text-sm">Cidades Recentes</h2>
          </div>
          <Link to="/cidades" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
            Ver todas <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="py-16 text-center">
            <MapPin size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 text-sm">Nenhuma cidade cadastrada ainda</p>
            <Link to="/cidades/nova" className="mt-3 inline-flex items-center gap-1 text-brand-600 text-sm font-medium hover:text-brand-700">
              <Plus size={14} /> Cadastrar primeira cidade
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map(t => (
              <Link
                key={t.id}
                to={`/cidades/${t.code}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group"
              >
                {/* Code badge */}
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-700">{t.code.slice(0, 2)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{t.apiUrl}</p>
                </div>

                <StatusBadge isActive={t.isActive} lastSeenAt={t.lastSeenAt} size="sm" />

                <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
