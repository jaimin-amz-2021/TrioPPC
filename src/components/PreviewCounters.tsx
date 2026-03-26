'use client'

import { Megaphone, Layers, Type, Target, Package, RefreshCw } from 'lucide-react'
import type { PreviewCounts } from '@/types/campaign'

interface Props {
  counts: PreviewCounts
  onRefresh: () => void
}

const counters = [
  { key: 'campaigns', label: 'Campaigns', icon: Megaphone, color: 'text-orange-600' },
  { key: 'adGroups', label: 'Ad Groups', icon: Layers, color: 'text-blue-600' },
  { key: 'keywords', label: 'Keywords', icon: Type, color: 'text-green-600' },
  { key: 'productTargets', label: 'Product Targets', icon: Target, color: 'text-purple-600' },
  { key: 'ads', label: 'Product Ads', icon: Package, color: 'text-rose-600' },
] as const

export default function PreviewCounters({ counts, onRefresh }: Props) {
  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
          Live Preview
        </h2>
        <button onClick={onRefresh} className="btn-ghost">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {counters.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="counter-card">
            <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
            <div className="text-2xl font-bold text-gray-900">
              {counts[key].toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Counts update automatically as you configure your campaign settings
      </p>
    </div>
  )
}
