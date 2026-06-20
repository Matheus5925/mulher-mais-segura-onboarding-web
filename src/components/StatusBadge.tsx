import { Wifi, WifiOff, CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  isActive:   boolean
  lastSeenAt?: string
  size?:       'sm' | 'md'
}

function isOnline(lastSeenAt?: string) {
  if (!lastSeenAt) return false
  return Date.now() - new Date(lastSeenAt).getTime() < 5 * 60 * 1000 // 5 min
}

export function StatusBadge({ isActive, lastSeenAt, size = 'md' }: Props) {
  const online = isOnline(lastSeenAt)
  const px     = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'

  if (!isActive)
    return (
      <span className={`inline-flex items-center gap-1.5 ${px} rounded-full font-medium bg-gray-100 text-gray-500`}>
        <XCircle size={12} /> Inativa
      </span>
    )

  if (online)
    return (
      <span className={`inline-flex items-center gap-1.5 ${px} rounded-full font-medium bg-green-50 text-green-700`}>
        <Wifi size={12} className="animate-pulse" /> Online
      </span>
    )

  return (
    <span className={`inline-flex items-center gap-1.5 ${px} rounded-full font-medium bg-brand-50 text-brand-700`}>
      <CheckCircle2 size={12} /> Ativa
    </span>
  )
}
