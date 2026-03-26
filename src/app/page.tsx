'use client'

import { useState, useCallback, useEffect } from 'react'
import Header from '@/components/Header'
import ProductInputSection from '@/components/ProductInput'
import CampaignSettings from '@/components/CampaignSettings'
import TargetingOptions from '@/components/TargetingOptions'
import AdvancedSettings from '@/components/AdvancedSettings'
import PreviewCounters from '@/components/PreviewCounters'
import DownloadButton from '@/components/DownloadButton'
import type { CampaignConfig, ProductInput, PreviewCounts } from '@/types/campaign'
import { parseProducts, calculatePreview } from '@/lib/campaignUtils'

const DEFAULT_CONFIG: CampaignConfig = {
  accountType: 'seller',
  structure: 'single-product',
  dailyBudget: '10',
  defaultBid: '0.75',
  campaignNameTemplate: 'SP_{TYPE}_{ASIN}',
  adGroupNameTemplate: 'AG_{TYPE}_{ASIN}',
  startDate: new Date().toISOString().split('T')[0],
  state: 'paused',
  biddingStrategy: 'down-only',
  targeting: {
    auto: {
      enabled: true,
      groups: {
        closeMatch: true,
        looseMatch: true,
        substitutes: true,
        complements: true,
      },
      defaultBid: '',
    },
    keyword: {
      enabled: false,
      matchTypes: { exact: true, phrase: true, broad: false },
      keywords: '',
      defaultBid: '',
    },
    product: {
      enabled: false,
      asins: '',
      defaultBid: '',
    },
  },
  placement: {
    topOfSearch: '',
    restOfSearch: '',
    productPages: '',
  },
  negativeKeywords: {
    campaign: '',
    adGroup: '',
  },
  negativeProducts: '',
}

const DEFAULT_PRODUCTS: ProductInput = { asins: '', skus: '' }

export default function Home() {
  const [config, setConfig] = useState<CampaignConfig>(DEFAULT_CONFIG)
  const [products, setProducts] = useState<ProductInput>(DEFAULT_PRODUCTS)
  const [counts, setCounts] = useState<PreviewCounts>({
    campaigns: 0,
    adGroups: 0,
    keywords: 0,
    productTargets: 0,
    ads: 0,
  })

  const recalculate = useCallback(() => {
    const parsed = parseProducts(products)
    const preview = calculatePreview(parsed, config)
    setCounts(preview)
  }, [products, config])

  useEffect(() => {
    recalculate()
  }, [recalculate])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            i
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">How to use this tool</p>
            <ol className="text-sm text-blue-700 space-y-0.5 list-decimal ml-4">
              <li>Paste your ASINs (and optionally SKUs) in the Products section</li>
              <li>Configure your campaign settings, naming, budget, and bids</li>
              <li>Enable one or more targeting types and customize them</li>
              <li>Optionally configure advanced placement and negative settings</li>
              <li>Review the live counters, then click <strong>Download .xlsx</strong></li>
              <li>Upload the file in Amazon Ads &rarr; Bulk Operations</li>
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <ProductInputSection value={products} onChange={setProducts} />
            <CampaignSettings config={config} onChange={setConfig} />
            <TargetingOptions config={config} onChange={setConfig} />
            <AdvancedSettings config={config} onChange={setConfig} />
          </div>

          {/* Right sidebar (sticky) */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-6 space-y-6">
              <PreviewCounters counts={counts} onRefresh={recalculate} />
              <DownloadButton config={config} products={products} counts={counts} />

              {/* Tips Card */}
              <div className="section-card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <h3 className="font-semibold text-amber-800 text-sm mb-3">Pro Tips</h3>
                <ul className="space-y-2 text-xs text-amber-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    Start campaigns as <strong>Paused</strong> so you can review before spending
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    Use <strong>Auto targeting</strong> first to discover converting keywords
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    Set <strong>Top of Search</strong> placement to 50-100% for aggressive bids
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    Add competitor ASINs to <strong>Product Targeting</strong> for conquest campaigns
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    Always add negative keywords to prevent wasted spend
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TrioPerspective &mdash; Free Amazon PPC Tools
          </p>
          <p className="text-xs text-gray-400">
            Not affiliated with Amazon. Amazon, Sponsored Products are trademarks of Amazon.com, Inc.
          </p>
        </div>
      </footer>
    </div>
  )
}
