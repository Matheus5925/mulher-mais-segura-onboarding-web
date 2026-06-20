import { useState, FormEvent }                         from 'react'
import { useQuery, useMutation, useQueryClient }        from '@tanstack/react-query'
import { Users as UsersIcon, Plus, Trash2, Eye, EyeOff, Pencil, X, Check, ShieldCheck } from 'lucide-react'
import toast                                            from 'react-hot-toast'
import { users, type OnboardingUser }                   from '@/api/tenants'

// ── Modal de criar / editar ────────────────────────────────────────────────────
function UserModal({
  editing,
  onClose,
}: {
  editing: OnboardingUser | null
  onClose: () => void
}) {
  const qc           = useQueryClient()
  const [name,     setName]     = useState(editing?.name  ?? '')
  const [email,    setEmail]    = useState(editing?.email ?? '')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)

  const create = useMutation({
    mutationFn: () => users.create(name, email, password),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['onboarding-users'] }); toast.success('Usuário criado!'); onClose() },
    onError:    (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao criar'),
  })

  const update = useMutation({
    mutationFn: () => users.update(editing!.id, { name, password: password || undefined }),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['onboarding-users'] }); toast.success('Usuário atualizado!'); onClose() },
    onError:    (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao atualizar'),
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Informe o nome'); return }
    if (!editing && (!email.trim() || !password)) { toast.error('Preencha todos os campos'); return }
    if (password && password.length < 8) { toast.error('Senha deve ter ao menos 8 caracteres'); return }
    editing ? update.mutate() : create.mutate()
  }

  const loading = create.isPending || update.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <UsersIcon size={16} className="text-brand-600" />
            </div>
            <h2 className="font-semibold text-gray-800 text-sm">
              {editing ? 'Editar usuário' : 'Novo usuário'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome completo *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome do usuário"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
            />
          </div>

          {!editing && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">E-mail *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@mulhermaisgura.gov.br"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              {editing ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={editing ? 'Nova senha (opcional)' : 'Mínimo 8 caracteres'}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Check size={15} />
              {loading ? 'Salvando...' : editing ? 'Salvar' : 'Criar usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function UsersPage() {
  const qc                             = useQueryClient()
  const [modal, setModal]              = useState<'create' | OnboardingUser | null>(null)

  const { data = [], isLoading } = useQuery({ queryKey: ['onboarding-users'], queryFn: users.list })

  const remove = useMutation({
    mutationFn: users.remove,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['onboarding-users'] }); toast.success('Usuário desativado') },
    onError:    (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao remover'),
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administradores do painel central de onboarding
          </p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
        >
          <Plus size={16} /> Novo usuário
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 flex items-start gap-3">
        <ShieldCheck size={18} className="text-brand-600 mt-0.5 shrink-0" />
        <p className="text-sm text-brand-800/80 leading-relaxed">
          Estes usuários têm acesso ao painel central de onboarding — onde cidades são cadastradas e QR Codes gerados.
          São diferentes dos admins de cada cidade.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center">
            <UsersIcon size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 text-sm">Nenhum usuário cadastrado</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Nome</div>
              <div className="col-span-4">E-mail</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Criado em</div>
            </div>

            <div className="divide-y divide-gray-50">
              {data.map(u => (
                <div key={u.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors group">
                  {/* Avatar + nome */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                      {u.name[0]?.toUpperCase()}
                    </div>
                    <p className="font-semibold text-gray-800 text-sm truncate">{u.name}</p>
                  </div>

                  {/* Email */}
                  <div className="col-span-4">
                    <p className="text-sm text-gray-500 truncate">{u.email}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {u.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {/* Data */}
                  <div className="col-span-2 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal(u)}
                        title="Editar"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Desativar ${u.name}?`)) remove.mutate(u.id)
                        }}
                        title="Desativar"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <UserModal
          editing={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
