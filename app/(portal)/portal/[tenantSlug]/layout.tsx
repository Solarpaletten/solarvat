import Link from 'next/link'
import { ReactNode } from 'react'

interface PortalLayoutProps {
  children: ReactNode
  params: { tenantSlug: string }
}

export default function PortalLayout({ children, params }: PortalLayoutProps) {
  const { tenantSlug } = params
  const basePath = `/portal/${tenantSlug}`
  
  const portalNav = [
    { href: `${basePath}/dashboard`, label: 'Übersicht', icon: '🏠' },
    { href: `${basePath}/cases`, label: 'Fälle', icon: '📁' },
    { href: `${basePath}/documents`, label: 'Dokumente', icon: '📄' },
    { href: `${basePath}/invoices`, label: 'Rechnungen', icon: '💳' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Link href={`${basePath}/dashboard`} className="font-bold text-lg text-solar-700">
              SOLAR <span className="text-xs text-gray-500">Portal</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">{tenantSlug}</span>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-6">
            {portalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 py-3 text-sm text-gray-600 hover:text-solar-700 border-b-2 border-transparent hover:border-solar-500 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-500 text-center">
            © 2024 SOLAR Platform · Firmengründung Schweiz
          </div>
        </div>
      </footer>
    </div>
  )
}
