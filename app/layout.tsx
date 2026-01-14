import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SOLAR Platform — Firmengründung Schweiz',
  description: 'Company Infrastructure OS für Schweizer GmbH und AG Gründung',
}

const navigation = [
  { href: '/', label: 'Start' },
  { href: '/routes/notaries', label: 'Notare' },
  { href: '/routes/addresses', label: 'Adressen' },
  { href: '/routes/directors', label: 'Direktoren' },
  { href: '/routes/accounting', label: 'Buchhaltung' },
  { href: '/routes/calculator', label: 'Kostenrechner' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <div className="min-h-screen bg-white">
          {/* Header */}
          <header className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-solar-700">SOLAR</span>
                  <span className="text-sm text-gray-500">Platform</span>
                </Link>
                
                {/* Navigation */}
                <nav className="hidden md:flex space-x-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-solar-700 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile menu button placeholder */}
                <div className="md:hidden">
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Powered by SOLAR Platform</span>
                <span>Version 2.0.0</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
