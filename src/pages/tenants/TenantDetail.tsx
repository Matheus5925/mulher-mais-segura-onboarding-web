import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link, useNavigate }           from 'react-router-dom'
import { useState, FormEvent }                    from 'react'
import { ArrowLeft, Edit3, ExternalLink, Clock, Server, Smartphone, ToggleLeft, ToggleRight, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import toast                                       from 'react-hot-toast'
import { tenants }                                 from '@/api/tenants'
import { StatusBadge }                             from '@/components/StatusBadge'
import { QRCodeCard }                              from '@/components/QRCodeCard'

// ── Formulário de setup do primeiro admin ────────────────────────────────────
const ADMIN_DONE_KEY = (code: string) => `setup_admin_done_${code}`

function SetupAdminCard({ code, cityName }: { code: string; cityName: string }) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [phone,    setPhone]    = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [done,     setDone]     = useState(() => localStorage.getItem(ADMIN_DONE_KEY(code)) === 'true')

  const setup = useMutation({
    mutationFn: () => tenants.setupAdmin(code, { name, email, password, phone: phone || undefined }),
    onSuccess: () => {
      toast.success(`Admin criado em ${cityName}!`)
      localStorage.setItem(ADMIN_DONE_KEY(code), 'true')
      setDone(true)
    },
    onError:   (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao criar admin'),
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error('Preencha nome, e-mail e senha'); return }
    if (password.length < 8) { toast.error('Senha deve ter ao menos 8 caracteres'); return }
    setup.mutate()
  }

  if (done) return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-green-700">
          <ShieldCheck size={20} />
          <p className="font-semibold text-sm">Admin já configurado em {cityName}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(ADMIN_DONE_KEY(code))
            setDone(false)
          }}
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          Reconfigurar
        </button>
      </div>
      {email && (
        <p className="text-xs text-gray-500 mt-2">
          O administrador <strong>{email}</strong> pode fazer login no painel de {cityName}.
        </p>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
        <UserPlus size={16} className="text-brand-600" />
        <h3 className="font-semibold text-gray-800 text-sm">Criar Primeiro Admin da Cidade</h3>
      </div>
      <form onSubmit={submit} className="p-6 space-y-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          Cria o SUPER_ADMIN inicial de <strong>{cityName}</strong> diretamente pelo painel de onboarding.
          Só funciona enquanto a cidade não possui nenhum administrador.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome completo *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Maria Silva"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Telefone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">E-mail *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@prefeitura.sp.gov.br"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Senha *</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={setup.isPending}
          className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
          <UserPlus size={15} />
          {setup.isPending ? 'Criando...' : `Criar Admin em ${cityName}`}
        </button>
      </form>
    </div>
  )
}

function InfoRow({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`text-sm text-gray-800 ${mono ? 'font-mono' : 'font-medium'}`}>{value}</p>
    </div>
  )
}

export default function TenantDetail() {
  const { code }  = useParams<{ code: string }>()
  const qc        = useQueryClient()
  const navigate  = useNavigate()

  const { data: tenant, isLoading, isError } = useQuery({
    queryKey: ['tenants', code],
    queryFn:  () => tenants.get(code!),
  })

  const toggle = useMutation({
    mutationFn: () => tenant?.isActive
      ? tenants.deactivate(code!)
      : tenants.update(code!, { isActive: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenants'] })
      toast.success(tenant?.isActive ? 'Cidade desativada' : 'Cidade ativada')
    },
    onError: () => toast.error('Erro ao alterar status'),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (isError || !tenant) return (
    <div className="text-center py-32">
      <p className="text-gray-500">Cidade não encontrada</p>
      <Link to="/cidades" className="mt-4 inline-flex items-center gap-1 text-brand-600 text-sm">
        <ArrowLeft size={14} /> Voltar
      </Link>
    </div>
  )

  const lastSeen = tenant.lastSeenAt
    ? new Date(tenant.lastSeenAt).toLocaleString('pt-BR')
    : 'Nunca'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/cidades" className="mt-1 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
              <span className="text-sm font-bold text-brand-700">{tenant.code.slice(0, 2)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{tenant.code}</span>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-gray-500">{tenant.state}</span>
                <span className="text-gray-300">·</span>
                <StatusBadge isActive={tenant.isActive} lastSeenAt={tenant.lastSeenAt} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {tenant.adminUrl && (
            <a
              href={tenant.adminUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={14} /> Painel
            </a>
          )}
          <Link
            to={`/cidades/${code}/editar`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-200 text-sm text-brand-700 hover:bg-brand-50 transition-colors"
          >
            <Edit3 size={14} /> Editar
          </Link>
          <button
            onClick={() => toggle.mutate()}
            disabled={toggle.isPending}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              tenant.isActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
            }`}
          >
            {tenant.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
            {tenant.isActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code */}
        <div className="lg:col-span-1">
          <QRCodeCard code={tenant.code} name={tenant.name} />
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Connection info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Server size={16} className="text-brand-600" />
              <h3 className="font-semibold text-gray-800 text-sm">Configuração de Conexão</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <InfoRow label="URL da API"        value={tenant.apiUrl}    mono />
              <InfoRow label="URL do Admin"      value={tenant.adminUrl}  mono />
              <InfoRow label="Versão mínima do app" value={tenant.minAppVersion} />
              <InfoRow label="Contato"           value={tenant.contactEmail} />
            </div>
          </div>

          {/* Features */}
          {Array.isArray(tenant.features) && (tenant.features as string[]).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone size={16} className="text-brand-600" />
                <h3 className="font-semibold text-gray-800 text-sm">Funcionalidades Habilitadas</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(tenant.features as string[]).map((f: string) => (
                  <span key={f} className="px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-medium text-brand-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-brand-600" />
              <h3 className="font-semibold text-gray-800 text-sm">Atividade</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Último ping"   value={lastSeen} />
              <InfoRow label="Cadastrado em" value={new Date(tenant.createdAt).toLocaleDateString('pt-BR')} />
            </div>
            {tenant.notes && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Notas</p>
                <p className="text-sm text-gray-600">{tenant.notes}</p>
              </div>
            )}
          </div>

          {/* Setup primeiro admin */}
          <SetupAdminCard code={tenant.code} cityName={tenant.name} />
        </div>
      </div>
    </div>
  )
}
