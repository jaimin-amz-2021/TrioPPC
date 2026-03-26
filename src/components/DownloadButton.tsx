'use client'

import { useState } from 'react'
import { Download, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react'
import type { CampaignConfig, ProductInput, PreviewCounts } from '@/types/campaign'
import { parseProducts, generateBulkSheet } from '@/lib/campaignUtils'

interface Props {
  config: CampaignConfig
  products: ProductInput
  counts: PreviewCounts
}

export default function DownloadButton({ config, products, counts }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleDownload = async () => {
    setStatus('loading')
    setError('')

    try {
      const parsedProducts = parseProducts(products)

      if (parsedProducts.length === 0) {
        setError('Please enter at least one ASIN before downloading.')
        setStatus('error')
        return
      }

      const hasTargeting =
        config.targeting.auto.enabled ||
        config.targeting.keyword.enabled ||
        config.targeting.product.enabled

      if (!hasTargeting) {
        setError('Please enable at least one targeting type.')
        setStatus('error')
        return
      }

      const rows = generateBulkSheet(parsedProducts, config)

      // Dynamically import xlsx
      const XLSX = await import('xlsx')
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(rows)

      // Auto-size columns
      const colWidths = Object.keys(rows[0] || {}).map((key) => ({
        wch: Math.max(key.length, 18),
      }))
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Sponsored Products')

      const dateStr = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `TrioPPC_BulkSheet_${dateStr}.xlsx`)

      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to generate the bulk sheet. Please try again.')
      setStatus('error')
    }
  }

  const totalItems =
    counts.campaigns + counts.adGroups + counts.keywords + counts.productTargets + counts.ads

  return (
    <div className="section-card bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-1">
            <FileSpreadsheet className="w-5 h-5 text-orange-400" />
            Download Bulk Upload Sheet
          </h2>
          <p className="text-gray-400 text-sm">
            Amazon-compatible Excel file ready for bulk upload in Seller/Vendor Central.
          </p>
          {totalItems > 0 && (
            <p className="text-orange-400 text-sm mt-1 font-medium">
              {counts.campaigns} campaigns &bull; {counts.adGroups} ad groups &bull;{' '}
              {counts.keywords} keywords &bull; {counts.productTargets} product targets
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleDownload}
            disabled={status === 'loading'}
            className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition text-base ${
              status === 'success'
                ? 'bg-green-500 text-white'
                : status === 'loading'
                ? 'bg-orange-400 text-white cursor-wait'
                : 'bg-amazon-orange hover:bg-orange-500 text-white'
            }`}
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download .xlsx
              </>
            )}
          </button>
          <span className="text-gray-500 text-xs">Free, no sign-up required</span>
        </div>
      </div>

      {status === 'error' && error && (
        <div className="mt-4 flex items-start gap-2 bg-red-900/30 border border-red-700 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {[
          ['Compatible', 'Amazon Seller & Vendor Central'],
          ['Format', 'Excel (.xlsx) Bulk Sheet'],
          ['Data Safe', '100% runs in your browser'],
          ['Cost', 'Completely Free'],
        ].map(([title, desc]) => (
          <div key={title}>
            <div className="text-white text-xs font-semibold">{title}</div>
            <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
