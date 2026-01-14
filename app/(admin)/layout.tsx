import Link from 'next/link'
import { ReactNode } from 'react'

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/tenants', label: 'Mandanten', icon: '🏢' },
  { href: '/admin/cases', label: 'Fälle', icon: '📁' },
  { href: '/admin/invoices', label: 'Rechnungen', icon: '💰' },
  { href: '/admin/catalog', label: 'Katalog', icon: '📋' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-bold text-lg text-solar-700">
              SOLAR <span className="text-xs text-gray-500">Ops</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">admin@solar.ch</span>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-3.5rem)] sticky top-14">
          <nav className="p-3 space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Catalog submenu */}
          <div className="px-3 pt-4 border-t border-gray-100 mt-4">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
              Katalog
            </div>
            <div className="space-y-1">
              <Link href="/admin/catalog/notaries" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                Notare
              </Link>
              <Link href="/admin/catalog/addresses" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                Adressen
              </Link>
              <Link href="/admin/catalog/directors" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                Direktoren
              </Link>
              <Link href="/admin/catalog/accounting" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                Buchhaltung
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
