'use client'

import { useState, useRef } from 'react'
import { Upload, Package, X, Info } from 'lucide-react'
import type { ProductInput } from '@/types/campaign'

interface Props {
  value: ProductInput
  onChange: (value: ProductInput) => void
}

export default function ProductInputSection({ value, onChange }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const asinCount = value.asins
    .split(/[\n,]+/)
    .map((a) => a.trim())
    .filter((a) => a.length > 0).length

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      // Parse CSV - take first column as ASINs
      const lines = text.split('\n').map((l) => l.split(',')[0].trim()).filter(Boolean)
      onChange({ ...value, asins: lines.join('\n') })
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Package className="w-4 h-4 text-orange-500" />
        Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ASIN Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">
              ASINs{' '}
              <span className="text-xs text-gray-400 font-normal">
                (one per line or comma-separated)
              </span>
            </label>
            {asinCount > 0 && (
              <span className="badge bg-orange-100 text-orange-700">
                {asinCount} ASINs
              </span>
            )}
          </div>
          <div
            className={`relative border-2 border-dashed rounded-lg transition ${
              dragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-gray-50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <textarea
              className="w-full bg-transparent rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none resize-none font-mono"
              rows={8}
              placeholder={"B08XYZ1234\nB09ABC5678\nB07DEF9012"}
              value={value.asins}
              onChange={(e) => onChange({ ...value, asins: e.target.value })}
            />
            {value.asins.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs">Drag & drop CSV or paste ASINs</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              className="btn-secondary text-xs py-1.5 px-3"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload CSV
            </button>
            {value.asins && (
              <button
                type="button"
                className="btn-ghost text-xs text-gray-500 hover:text-red-500"
                onClick={() => onChange({ ...value, asins: '' })}
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
            />
          </div>
        </div>

        {/* SKU Input */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <label className="label mb-0">
              SKUs{' '}
              <span className="text-xs text-gray-400 font-normal">(optional, Seller Central)</span>
            </label>
            <div className="group relative">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-5 top-0 z-10 hidden group-hover:block w-56 bg-gray-800 text-white text-xs rounded-lg p-2.5 shadow-lg">
                Match SKUs to ASINs line by line. Leave blank to use ASINs only.
              </div>
            </div>
          </div>
          <textarea
            className="textarea"
            rows={8}
            placeholder={"MY-SKU-001\nMY-SKU-002\nMY-SKU-003"}
            value={value.skus}
            onChange={(e) => onChange({ ...value, skus: e.target.value })}
          />
          <p className="text-xs text-gray-400 mt-2">
            Match line-by-line with ASINs above. Required for Seller Central ads.
          </p>
        </div>
      </div>
    </div>
  )
}
