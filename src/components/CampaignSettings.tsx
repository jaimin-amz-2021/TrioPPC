'use client'

import { Settings, DollarSign } from 'lucide-react'
import type { CampaignConfig } from '@/types/campaign'
import clsx from 'clsx'

interface Props {
  config: CampaignConfig
  onChange: (config: CampaignConfig) => void
}

const structures = [
  {
    id: 'single-product',
    label: 'Single Product',
    desc: '1 campaign per ASIN per targeting type',
  },
  {
    id: 'multi-product',
    label: 'Multi Product',
    desc: 'All ASINs in one campaign per targeting type',
  },
  {
    id: 'single-keyword',
    label: 'Single Keyword',
    desc: '1 campaign per ASIN per keyword',
  },
] as const

const biddingStrategies = [
  { id: 'fixed', label: 'Fixed Bid' },
  { id: 'down-only', label: 'Dynamic (Down Only)' },
  { id: 'up-down', label: 'Dynamic (Up & Down)' },
] as const

export default function CampaignSettings({ config, onChange }: Props) {
  const set = <K extends keyof CampaignConfig>(key: K, val: CampaignConfig[K]) =>
    onChange({ ...config, [key]: val })

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Settings className="w-4 h-4 text-orange-500" />
        Campaign Settings
      </h2>

      <div className="space-y-5">
        {/* Account Type */}
        <div>
          <label className="label">Account Type</label>
          <div className="flex gap-2">
            {(['seller', 'vendor'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => set('accountType', type)}
                className={clsx('toggle-btn flex-1', {
                  'toggle-btn-active': config.accountType === type,
                  'toggle-btn-inactive': config.accountType !== type,
                })}
              >
                {type === 'seller' ? 'Seller Central' : 'Vendor Central'}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Structure */}
        <div>
          <label className="label">Campaign Structure</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {structures.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => set('structure', s.id)}
                className={clsx(
                  'rounded-lg border p-3 text-left transition',
                  config.structure === s.id
                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400'
                    : 'border-gray-200 hover:border-orange-300'
                )}
              >
                <div className="text-sm font-medium text-gray-800">{s.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Budget & Bid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <DollarSign className="w-3.5 h-3.5 inline text-gray-400" /> Daily Budget ($)
            </label>
            <input
              type="number"
              className="input"
              min="1"
              step="0.01"
              placeholder="10.00"
              value={config.dailyBudget}
              onChange={(e) => set('dailyBudget', e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <DollarSign className="w-3.5 h-3.5 inline text-gray-400" /> Default Bid ($)
            </label>
            <input
              type="number"
              className="input"
              min="0.02"
              step="0.01"
              placeholder="0.75"
              value={config.defaultBid}
              onChange={(e) => set('defaultBid', e.target.value)}
            />
          </div>
        </div>

        {/* Naming Templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Campaign Name Template</label>
            <input
              type="text"
              className="input font-mono text-xs"
              placeholder="SP_{TYPE}_{ASIN}"
              value={config.campaignNameTemplate}
              onChange={(e) => set('campaignNameTemplate', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Variables: <code className="bg-gray-100 px-1 rounded">{'{ASIN}'}</code>{' '}
              <code className="bg-gray-100 px-1 rounded">{'{SKU}'}</code>{' '}
              <code className="bg-gray-100 px-1 rounded">{'{TYPE}'}</code>{' '}
              <code className="bg-gray-100 px-1 rounded">{'{INDEX}'}</code>
            </p>
          </div>
          <div>
            <label className="label">Ad Group Name Template</label>
            <input
              type="text"
              className="input font-mono text-xs"
              placeholder="AG_{TYPE}_{ASIN}"
              value={config.adGroupNameTemplate}
              onChange={(e) => set('adGroupNameTemplate', e.target.value)}
            />
          </div>
        </div>

        {/* Start Date & State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              className="input"
              min={today}
              value={config.startDate}
              onChange={(e) => set('startDate', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Campaign State</label>
            <div className="flex gap-2">
              {(['enabled', 'paused'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('state', s)}
                  className={clsx('toggle-btn flex-1', {
                    'toggle-btn-active': config.state === s,
                    'toggle-btn-inactive': config.state !== s,
                  })}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bidding Strategy */}
        <div>
          <label className="label">Bidding Strategy</label>
          <div className="grid grid-cols-3 gap-2">
            {biddingStrategies.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => set('biddingStrategy', b.id)}
                className={clsx('toggle-btn', {
                  'toggle-btn-active': config.biddingStrategy === b.id,
                  'toggle-btn-inactive': config.biddingStrategy !== b.id,
                })}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
