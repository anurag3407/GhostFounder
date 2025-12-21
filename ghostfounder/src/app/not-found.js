import Link from 'next/link';
import { IconGhost2, IconHome, IconSearch } from '@tabler/icons-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Ghost */}
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-white/5 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <IconGhost2 className="w-24 h-24 text-ghost-blue opacity-50" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Page Not Found
        </h1>
        
        <p className="text-gray-400 mb-8">
          This page has vanished into the spectral realm. 
          Perhaps it never existed, or maybe our ghosts moved it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-ghost-blue text-black font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <IconHome className="w-5 h-5" />
            Go Home
          </Link>
          
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <IconSearch className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
