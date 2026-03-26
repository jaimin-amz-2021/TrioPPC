'use client'

import { Target, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { CampaignConfig, TargetingConfig } from '@/types/campaign'
import clsx from 'clsx'

interface Props {
  config: CampaignConfig
  onChange: (config: CampaignConfig) => void
}

function SectionToggle({
  label,
  enabled,
  onToggle,
  children,
}: {
  label: string
  enabled: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div
      className={clsx(
        'rounded-xl border transition',
        enabled ? 'border-orange-300 bg-orange-50/40' : 'border-gray-200 bg-white'
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <label className="flex items-center gap-2 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggle}
            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
          />
          <span className={clsx('font-semibold text-sm', enabled ? 'text-orange-700' : 'text-gray-700')}>
            {label}
          </span>
          {enabled && (
            <span className="badge bg-orange-100 text-orange-700">Active</span>
          )}
        </label>
        {enabled && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-gray-400 hover:text-gray-600"
          >
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
      {enabled && open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  )
}

export default function TargetingOptions({ config, onChange }: Props) {
  const setTargeting = (targeting: TargetingConfig) =>
    onChange({ ...config, targeting })

  const t = config.targeting

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Target className="w-4 h-4 text-orange-500" />
        Targeting Strategy
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Enable one or more targeting types. Each type creates separate campaigns.
      </p>

      <div className="space-y-3">
        {/* Auto Targeting */}
        <SectionToggle
          label="Auto Targeting"
          enabled={t.auto.enabled}
          onToggle={() =>
            setTargeting({ ...t, auto: { ...t.auto, enabled: !t.auto.enabled } })
          }
        >
          <div>
            <label className="label">Auto Targeting Groups</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['closeMatch', 'Close Match'],
                  ['looseMatch', 'Loose Match'],
                  ['substitutes', 'Substitutes'],
                  ['complements', 'Complements'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={t.auto.groups[key]}
                    onChange={(e) =>
                      setTargeting({
                        ...t,
                        auto: {
                          ...t.auto,
                          groups: { ...t.auto.groups, [key]: e.target.checked },
                        },
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="max-w-xs">
            <label className="label">Default Bid for Auto ($)</label>
            <input
              type="number"
              className="input"
              min="0.02"
              step="0.01"
              placeholder={config.defaultBid || '0.75'}
              value={t.auto.defaultBid}
              onChange={(e) =>
                setTargeting({ ...t, auto: { ...t.auto, defaultBid: e.target.value } })
              }
            />
          </div>
        </SectionToggle>

        {/* Keyword Targeting */}
        <SectionToggle
          label="Keyword Targeting (Manual)"
          enabled={t.keyword.enabled}
          onToggle={() =>
            setTargeting({ ...t, keyword: { ...t.keyword, enabled: !t.keyword.enabled } })
          }
        >
          <div>
            <label className="label">Match Types</label>
            <div className="flex gap-2">
              {(['exact', 'phrase', 'broad'] as const).map((match) => (
                <label key={match} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={t.keyword.matchTypes[match]}
                    onChange={(e) =>
                      setTargeting({
                        ...t,
                        keyword: {
                          ...t.keyword,
                          matchTypes: { ...t.keyword.matchTypes, [match]: e.target.checked },
                        },
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                  {match.charAt(0).toUpperCase() + match.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Keywords (one per line)</label>
            <textarea
              className="textarea"
              rows={5}
              placeholder={"wireless earbuds\nnoise cancelling headphones\nbluetooth speaker"}
              value={t.keyword.keywords}
              onChange={(e) =>
                setTargeting({ ...t, keyword: { ...t.keyword, keywords: e.target.value } })
              }
            />
          </div>
          <div className="max-w-xs">
            <label className="label">Default Bid for Keywords ($)</label>
            <input
              type="number"
              className="input"
              min="0.02"
              step="0.01"
              placeholder={config.defaultBid || '0.75'}
              value={t.keyword.defaultBid}
              onChange={(e) =>
                setTargeting({ ...t, keyword: { ...t.keyword, defaultBid: e.target.value } })
              }
            />
          </div>
        </SectionToggle>

        {/* Product Targeting */}
        <SectionToggle
          label="Product Targeting (ASIN)"
          enabled={t.product.enabled}
          onToggle={() =>
            setTargeting({ ...t, product: { ...t.product, enabled: !t.product.enabled } })
          }
        >
          <div>
            <label className="label">Target ASINs (one per line)</label>
            <textarea
              className="textarea"
              rows={5}
              placeholder={"B09XYZ1234\nB08ABC5678"}
              value={t.product.asins}
              onChange={(e) =>
                setTargeting({ ...t, product: { ...t.product, asins: e.target.value } })
              }
            />
          </div>
          <div className="max-w-xs">
            <label className="label">Default Bid for Products ($)</label>
            <input
              type="number"
              className="input"
              min="0.02"
              step="0.01"
              placeholder={config.defaultBid || '0.75'}
              value={t.product.defaultBid}
              onChange={(e) =>
                setTargeting({ ...t, product: { ...t.product, defaultBid: e.target.value } })
              }
            />
          </div>
        </SectionToggle>
      </div>
    </div>
  )
}
