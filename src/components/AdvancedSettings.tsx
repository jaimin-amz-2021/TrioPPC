'use client'

import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import type { CampaignConfig } from '@/types/campaign'

interface Props {
  config: CampaignConfig
  onChange: (config: CampaignConfig) => void
}

export default function AdvancedSettings({ config, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const set = <K extends keyof CampaignConfig>(key: K, val: CampaignConfig[K]) =>
    onChange({ ...config, [key]: val })

  return (
    <div className="section-card">
      <button
        type="button"
        className="flex items-center justify-between w-full"
        onClick={() => setOpen((o) => !o)}
      >
        <h2 className="section-title mb-0">
          <SlidersHorizontal className="w-4 h-4 text-orange-500" />
          Advanced Settings
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{open ? 'Hide' : 'Show'}</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="mt-5 space-y-6">
          {/* Placement Adjustments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Placement Bid Adjustments (%)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ['topOfSearch', 'Top of Search'],
                  ['restOfSearch', 'Rest of Search'],
                  ['productPages', 'Product Pages'],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input pr-8"
                      min="0"
                      max="900"
                      placeholder="0"
                      value={config.placement[key]}
                      onChange={(e) =>
                        set('placement', { ...config.placement, [key]: e.target.value })
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              0% = no adjustment. Up to 900% increase over your base bid.
            </p>
          </div>

          {/* Negative Keywords */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Negative Keywords</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Campaign Level (one per line)</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder={"cheap\nfree\nbulk discount"}
                  value={config.negativeKeywords.campaign}
                  onChange={(e) =>
                    set('negativeKeywords', {
                      ...config.negativeKeywords,
                      campaign: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="label">Ad Group Level (one per line)</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder={"used\nrefurbished\ncounterfeit"}
                  value={config.negativeKeywords.adGroup}
                  onChange={(e) =>
                    set('negativeKeywords', {
                      ...config.negativeKeywords,
                      adGroup: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Negative Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Negative Product Targeting (ASINs)
            </h3>
            <textarea
              className="textarea"
              rows={3}
              placeholder={"B09COMPETITOR1\nB08COMPETITOR2"}
              value={config.negativeProducts}
              onChange={(e) => set('negativeProducts', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Block your ads from appearing on these product pages.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
