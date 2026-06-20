import QRCode from 'react-qr-code'
import { Download, Smartphone, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props { code: string; name: string }

export function QRCodeCard({ code, name }: Props) {
  const deepLink = `mulhermaisgura://config?tenant=${code}`

  const copy = () => {
    navigator.clipboard.writeText(deepLink)
    toast.success('Link copiado!')
  }

  const download = () => {
    const svg  = document.getElementById(`qr-${code}`)
    if (!svg) return
    const xml  = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([xml], { type: 'image/svg+xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `qrcode-${code.toLowerCase()}.svg`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('QR Code baixado!')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
        <div className="flex items-center gap-2">
          <Smartphone size={18} className="text-white/80" />
          <div>
            <p className="text-sm font-semibold text-white">QR Code de Onboarding</p>
            <p className="text-[11px] text-white/70 mt-0.5">Vítimas e agressores escaneiam para se registrar</p>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center px-8 py-8 gap-4">
        <div className="p-5 bg-white rounded-2xl border-2 border-brand-100 shadow-inner">
          <QRCode
            id={`qr-${code}`}
            value={deepLink}
            size={200}
            fgColor="#880E4F"
            bgColor="#ffffff"
            level="H"
          />
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cidade</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{name} <span className="text-brand-600">({code})</span></p>
        </div>

        {/* Deep link */}
        <div className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
          <code className="flex-1 text-xs text-gray-600 truncate font-mono">{deepLink}</code>
          <button onClick={copy} className="shrink-0 text-gray-400 hover:text-brand-600 transition-colors">
            <Copy size={15} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={download}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-200 text-brand-700 text-sm font-medium hover:bg-brand-50 transition-colors"
          >
            <Download size={15} /> Baixar SVG
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
          >
            Imprimir
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-6 pb-6">
        <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
          <p className="text-xs font-semibold text-brand-700 mb-2">Como usar</p>
          <ol className="text-xs text-brand-800/70 space-y-1 list-decimal list-inside">
            <li>Exiba este QR Code na delegacia ou posto de atendimento</li>
            <li>A vítima ou agressor abre o app e escaneia o código</li>
            <li>O app se conecta automaticamente ao servidor de {name}</li>
            <li>O usuário completa o cadastro normalmente via OTP</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
