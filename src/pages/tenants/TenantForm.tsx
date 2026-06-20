import { useState, FormEvent }                   from 'react'
import { useNavigate, Link, useParams }           from 'react-router-dom'
import { useQuery, useMutation, useQueryClient }  from '@tanstack/react-query'
import { ArrowLeft, Save, MapPin }                from 'lucide-react'
import toast                                      from 'react-hot-toast'
import { tenants }                                from '@/api/tenants'

const FEATURES = ['facial_recognition', 'panic_button', 'support_network', 'restraining_orders', 'proximity_alert']

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, ...rest }: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
      {...rest}
    />
  )
}

export default function TenantForm() {
  const { code } = useParams<{ code?: string }>()
  const isEdit   = !!code
  const qc       = useQueryClient()
  const navigate = useNavigate()

  const { data: existing } = useQuery({
    queryKey: ['tenants', code],
    queryFn:  () => tenants.get(code!),
    enabled:  isEdit,
  })

  const [form, setForm] = useState({
    code:          existing?.code          ?? '',
    name:          existing?.name          ?? '',
    state:         existing?.state         ?? '',
    apiUrl:        existing?.apiUrl        ?? '',
    adminUrl:      existing?.adminUrl      ?? '',
    contactEmail:  existing?.contactEmail  ?? '',
    minAppVersion: existing?.minAppVersion ?? '1.0.0',
    notes:         existing?.notes         ?? '',
  })
  const [features, setFeatures] = useState<string[]>((existing?.features as string[]) ?? [])

  const set = (k: keyof typeof form) => (v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const toggleFeature = (f: string) =>
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  // Campos opcionais com @IsUrl/@IsEmail no backend rejeitam string vazia
  // (class-validator só pula @IsOptional quando o valor é undefined) —
  // então omitimos os que estiverem em branco em vez de mandar "".
  const buildPayload = (data: typeof form) => ({
    ...data,
    adminUrl:     data.adminUrl     || undefined,
    contactEmail: data.contactEmail || undefined,
    features,
  })

  const create = useMutation({
    mutationFn: () => tenants.create(buildPayload(form)),
    onSuccess: t => { qc.invalidateQueries({ queryKey: ['tenants'] }); toast.success('Cidade cadastrada!'); navigate(`/cidades/${t.code}`) },
    onError:   (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao cadastrar cidade'),
  })

  const update = useMutation({
    // "code" é o identificador imutável da cidade — não faz parte do UpdateTenantDto
    mutationFn: () => {
      const { code: _code, ...rest } = form
      return tenants.update(code!, buildPayload(rest as typeof form))
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tenants'] }); toast.success('Cidade atualizada!'); navigate(`/cidades/${code}`) },
    onError:   (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao atualizar'),
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.name || !form.state || !form.apiUrl) { toast.error('Preencha os campos obrigatórios'); return }
    isEdit ? update.mutate() : create.mutate()
  }

  const loading = create.isPending || update.isPending

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to={isEdit ? `/cidades/${code}` : '/cidades'} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            <MapPin size={18} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Editar Cidade' : 'Nova Cidade'}</h1>
            <p className="text-sm text-gray-500">{isEdit ? form.name : 'Cadastrar nova implantação'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-700 text-sm">Identificação</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Código *" hint="Ex: SP, RJ, CURITIBA">
              <Input value={form.code} onChange={set('code')} placeholder="SP" disabled={isEdit}
                className={isEdit ? 'opacity-60 cursor-not-allowed' : ''} />
            </Field>
            <Field label="Estado (UF) *">
              <Input value={form.state} onChange={set('state')} placeholder="SP" maxLength={2} />
            </Field>
          </div>

          <Field label="Nome da Cidade *">
            <Input value={form.name} onChange={set('name')} placeholder="São Paulo" />
          </Field>

          <Field label="E-mail de Contato">
            <Input value={form.contactEmail} onChange={set('contactEmail')} type="email" placeholder="ti@prefeitura.sp.gov.br" />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-700 text-sm">Configuração de Infraestrutura</h2>

          <Field label="URL da API *" hint="Backend NestJS desta cidade">
            <Input value={form.apiUrl} onChange={set('apiUrl')} type="url" placeholder="https://api.sp.mulhermaisgura.gov.br" />
          </Field>

          <Field label="URL do Painel Admin" hint="Opcional — painel Next.js desta cidade">
            <Input value={form.adminUrl} onChange={set('adminUrl')} type="url" placeholder="https://admin.sp.mulhermaisgura.gov.br" />
          </Field>

          <Field label="Versão mínima do app">
            <Input value={form.minAppVersion} onChange={set('minAppVersion')} placeholder="1.0.0" />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm">Funcionalidades</h2>
          <div className="grid grid-cols-2 gap-2">
            {FEATURES.map(f => (
              <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  features.includes(f) ? 'bg-brand-600 border-brand-600' : 'border-gray-300 group-hover:border-brand-400'
                }`}>
                  {features.includes(f) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className="text-sm text-gray-700" onClick={() => toggleFeature(f)}>{f.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <Field label="Notas internas">
            <textarea
              value={form.notes}
              onChange={e => set('notes')(e.target.value)}
              placeholder="Observações sobre esta implantação..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none"
            />
          </Field>
        </div>

        <div className="flex gap-3">
          <Link to={isEdit ? `/cidades/${code}` : '/cidades'} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors text-center">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-brand-600/20"
          >
            <Save size={15} />
            {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Cidade'}
          </button>
        </div>
      </form>
    </div>
  )
}
