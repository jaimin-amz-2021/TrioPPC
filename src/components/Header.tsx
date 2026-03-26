'use client'

import { Zap, BarChart3 } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-amazon-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-amazon-orange rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">Trio</span>
              <span className="font-bold text-lg tracking-tight text-amazon-orange">Perspective</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-300">
            <a href="#" className="hover:text-white transition">Tools</a>
            <a href="#" className="hover:text-white transition">Blog</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amazon-dark via-gray-800 to-amazon-dark border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
            <Zap className="w-3.5 h-3.5" />
            Free Bulk Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Bulk Amazon PPC{' '}
            <span className="text-amazon-orange">Campaign Launcher</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Create hundreds of Sponsored Products campaigns in seconds. Configure
            targeting, set bids, and download your Amazon bulk upload sheet — all for free.
          </p>
        </div>
      </div>
    </header>
  )
}
