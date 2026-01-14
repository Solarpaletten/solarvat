import Link from 'next/link'

const blocks = [
  {
    href: '/routes/notaries',
    title: 'Notare',
    count: '13',
    description: 'Online-Plattformen und Privatnotare',
    icon: '📜',
  },
  {
    href: '/routes/addresses',
    title: 'Geschäftsadressen',
    count: '8',
    description: 'Domizil und virtuelle Büros',
    icon: '🏢',
  },
  {
    href: '/routes/directors',
    title: 'Direktoren',
    count: '7',
    description: 'Nominee und Treuhänder',
    icon: '👔',
  },
  {
    href: '/routes/accounting',
    title: 'Buchhaltung',
    count: '10',
    description: 'Treuhand und Buchhaltungspartner',
    icon: '📊',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Company Infrastructure OS
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Alles was Sie für die Gründung einer GmbH oder AG in der Schweiz brauchen.
          Von der Beurkundung bis zur Buchhaltung — in einem System.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {blocks.map((block) => (
          <Link
            key={block.href}
            href={block.href}
            className="group p-6 bg-white border border-gray-200 rounded-lg hover:border-solar-500 hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-2">{block.icon}</div>
            <div className="text-2xl font-bold text-gray-900 group-hover:text-solar-700">
              {block.count}
            </div>
            <div className="text-sm font-medium text-gray-700">{block.title}</div>
            <div className="text-xs text-gray-500 mt-1">{block.description}</div>
          </Link>
        ))}
      </div>

      {/* Calculator CTA */}
      <div className="bg-solar-50 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Kosten berechnen
        </h2>
        <p className="text-gray-600 mb-4">
          Ermitteln Sie die geschätzten Kosten für Ihre Firmengründung
        </p>
        <Link
          href="/routes/calculator"
          className="inline-flex items-center px-6 py-3 bg-solar-600 text-white font-medium rounded-md hover:bg-solar-700 transition-colors"
        >
          Zum Kostenrechner →
        </Link>
      </div>

      {/* Quick Start */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🚀 Schnellstart: Zug GmbH
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>1. Notar (Online)</span>
              <span className="font-medium">ab CHF 290</span>
            </div>
            <div className="flex justify-between">
              <span>2. Handelsregister</span>
              <span className="font-medium">CHF 550</span>
            </div>
            <div className="flex justify-between">
              <span>3. Geschäftsadresse</span>
              <span className="font-medium">ab CHF 960/Jahr</span>
            </div>
            <div className="flex justify-between">
              <span>4. Buchhaltung</span>
              <span className="font-medium">ab CHF 1,200/Jahr</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
              <span>Total 1. Jahr</span>
              <span className="text-solar-700">ab CHF 3,000</span>
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🏛️ Enterprise: Zürich AG
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>1. Notar (Online)</span>
              <span className="font-medium">ab CHF 690</span>
            </div>
            <div className="flex justify-between">
              <span>2. Handelsregister</span>
              <span className="font-medium">CHF 950</span>
            </div>
            <div className="flex justify-between">
              <span>3. Geschäftsadresse</span>
              <span className="font-medium">ab CHF 1,500/Jahr</span>
            </div>
            <div className="flex justify-between">
              <span>4. Direktor (Nominee)</span>
              <span className="font-medium">ab CHF 3,000/Jahr</span>
            </div>
            <div className="flex justify-between">
              <span>5. Buchhaltung</span>
              <span className="font-medium">ab CHF 2,400/Jahr</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
              <span>Total 1. Jahr</span>
              <span className="text-solar-700">ab CHF 8,540</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
