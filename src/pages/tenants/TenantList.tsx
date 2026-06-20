import { useState }       from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link }            from 'react-router-dom'
import { Plus, Search, MapPin, QrCode, ExternalLink, Power, ArrowRight } from 'lucide-react'
import toast               from 'react-hot-toast'
import { tenants }         from '@/api/tenants'
import { StatusBadge }     from '@/components/StatusBadge'

export default function TenantList() {
  const qc            = useQueryClient()
  const [q, setQ]     = useState('')
  const { data = [], isLoading } = useQuery({ queryKey: ['tenants'], queryFn: tenants.list, refetchInterval: 30_000 })

  const deactivate = useMutation({
    mutationFn: tenants.deactivate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tenants'] }); toast.success('Cidade desativada') },
    onError:   () => toast.error('Erro ao desativar cidade'),
  })

  const filtered = data.filter(t =>
    t.name.toLowerCase().includes(q.toLowerCase()) ||
    t.code.toLowerCase().includes(q.toLowerCase()) ||
    t.state.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cidades</h1>
          <p className="text-sm text-gray-500 mt-1">{data.length} cidade{data.length !== 1 && 's'} cadastrada{data.length !== 1 && 's'}</p>
        </div>
        <Link
          to="/cidades/nova"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
        >
          <Plus size={16} /> Nova Cidade
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar por nome, código ou estado..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all shadow-sm"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <MapPin size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 text-sm">{q ? 'Nenhuma cidade encontrada' : 'Nenhuma cidade cadastrada'}</p>
            {!q && (
              <Link to="/cidades/nova" className="mt-3 inline-flex items-center gap-1 text-brand-600 text-sm font-medium">
                <Plus size={14} /> Cadastrar agora
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">Código</div>
              <div className="col-span-4">Cidade / Estado</div>
              <div className="col-span-4">URL da API</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1" />
            </div>

            <div className="divide-y divide-gray-50">
              {filtered.map(t => (
                <div key={t.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors group">
                  {/* Code */}
                  <div className="col-span-1">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 text-xs font-bold text-brand-700">
                      {t.code.slice(0, 2)}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="col-span-4">
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.state}</p>
                  </div>

                  {/* URL */}
                  <div className="col-span-4">
                    <p className="text-xs text-gray-500 font-mono truncate">{t.apiUrl}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge isActive={t.isActive} lastSeenAt={t.lastSeenAt} size="sm" />
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/cidades/${t.code}`}
                      title="Ver QR Code"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      <QrCode size={15} />
                    </Link>
                    {t.adminUrl && (
                      <a
                        href={t.adminUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir painel"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    {t.isActive && (
                      <button
                        title="Desativar"
                        onClick={() => {
                          if (confirm(`Desativar ${t.name}?`)) deactivate.mutate(t.code)
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Power size={15} />
                      </button>
                    )}
                    <Link
                      to={`/cidades/${t.code}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
