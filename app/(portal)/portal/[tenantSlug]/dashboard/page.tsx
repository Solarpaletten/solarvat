// Portal Dashboard — Client's main view

import Link from 'next/link'

interface PageProps {
  params: { tenantSlug: string }
}

// Mock data
const mockCase = {
  id: 'SOLAR-2024-0024',
  companyName: 'TechStart GmbH',
  type: 'GMBH',
  canton: 'ZG',
  status: 'PROVIDERS_SELECTING',
  progress: 25,
  nextAction: 'Provider-Auswahl bestätigen',
}

const mockSteps = [
  { label: 'KYC eingereicht', status: 'DONE', date: '22.01.2024' },
  { label: 'KYC genehmigt', status: 'DONE', date: '25.01.2024' },
  { label: 'Provider-Auswahl', status: 'IN_PROGRESS', date: null },
  { label: 'Notartermin', status: 'TODO', date: null },
  { label: 'Registrierung', status: 'TODO', date: null },
]

const mockInvoices = [
  { id: 'SOLAR-INV-2024-0012', amount: 'CHF 3,490', status: 'PAID', date: '25.01.2024' },
]

export default function PortalDashboard({ params }: PageProps) {
  const { tenantSlug } = params
  const basePath = `/portal/${tenantSlug}`

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Willkommen zurück!</h1>
        <p className="text-gray-600">Hier ist der aktuelle Stand Ihrer Firmenregistrierung.</p>
      </div>

      {/* Current Case */}
      {mockCase && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-solar-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{mockCase.companyName}</h2>
                <p className="text-sm text-gray-500">{mockCase.type} · Kanton {mockCase.canton}</p>
              </div>
              <Link
                href={`${basePath}/cases/${mockCase.id}`}
                className="text-sm text-solar-600 hover:text-solar-700"
              >
                Details →
              </Link>
            </div>
          </div>
          
          {/* Progress */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Fortschritt</span>
              <span className="text-sm text-gray-500">{mockCase.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-solar-600 h-3 rounded-full transition-all" 
                style={{ width: `${mockCase.progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
              {mockSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center min-w-[100px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step.status === 'DONE' ? 'bg-green-100 text-green-600' :
                    step.status === 'IN_PROGRESS' ? 'bg-solar-100 text-solar-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {step.status === 'DONE' ? '✓' : 
                     step.status === 'IN_PROGRESS' ? '•' : 
                     index + 1}
                  </div>
                  <span className={`text-xs mt-1 text-center ${
                    step.status === 'DONE' ? 'text-green-600' :
                    step.status === 'IN_PROGRESS' ? 'text-solar-600 font-medium' :
                    'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {step.date && (
                    <span className="text-xs text-gray-400">{step.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Action */}
          <div className="px-4 py-3 border-t border-gray-100 bg-yellow-50">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⚡</span>
              <span className="text-sm text-yellow-800">
                <strong>Nächster Schritt:</strong> {mockCase.nextAction}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`${basePath}/documents`}
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-solar-500 transition-colors"
        >
          <span className="text-2xl">📄</span>
          <div>
            <div className="font-medium text-gray-900">Dokumente</div>
            <div className="text-sm text-gray-500">Alle Unterlagen</div>
          </div>
        </Link>
        <Link
          href={`${basePath}/invoices`}
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-solar-500 transition-colors"
        >
          <span className="text-2xl">💳</span>
          <div>
            <div className="font-medium text-gray-900">Rechnungen</div>
            <div className="text-sm text-gray-500">{mockInvoices.length} Rechnung(en)</div>
          </div>
        </Link>
        <a
          href="mailto:support@solar.ch"
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-solar-500 transition-colors"
        >
          <span className="text-2xl">💬</span>
          <div>
            <div className="font-medium text-gray-900">Support</div>
            <div className="text-sm text-gray-500">Fragen? Kontakt</div>
          </div>
        </a>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Letzte Rechnungen</h2>
          <Link href={`${basePath}/invoices`} className="text-sm text-solar-600 hover:text-solar-700">
            Alle anzeigen →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {mockInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium text-gray-900">{invoice.id}</div>
                <div className="text-sm text-gray-500">{invoice.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{invoice.amount}</span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                  Bezahlt
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
