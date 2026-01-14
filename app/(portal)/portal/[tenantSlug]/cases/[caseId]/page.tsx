// Portal Case Detail — Client's view of their case

import Link from 'next/link'

interface PageProps {
  params: { 
    tenantSlug: string
    caseId: string 
  }
}

// Mock data (client-visible only)
const mockCase = {
  id: 'SOLAR-2024-0024',
  companyName: 'TechStart GmbH',
  type: 'GMBH',
  canton: 'ZG',
  city: 'Zug',
  shareCapital: 20000,
  status: 'PROVIDERS_SELECTING',
  createdAt: '20.01.2024',
}

const mockSteps = [
  { id: '1', label: 'KYC-Unterlagen einreichen', status: 'DONE', date: '22.01.2024', clientAction: false },
  { id: '2', label: 'KYC-Prüfung', status: 'DONE', date: '25.01.2024', clientAction: false },
  { id: '3', label: 'Provider-Auswahl', status: 'IN_PROGRESS', date: null, clientAction: true, 
    description: 'Wir wählen die besten Partner für Ihre Firmengründung aus.' },
  { id: '4', label: 'Dokumente vorbereiten', status: 'TODO', date: null, clientAction: false },
  { id: '5', label: 'Notartermin', status: 'TODO', date: null, clientAction: true,
    description: 'Sie werden zur Unterzeichnung eingeladen.' },
  { id: '6', label: 'Handelsregister-Eintragung', status: 'TODO', date: null, clientAction: false },
  { id: '7', label: 'UID-Nummer erhalten', status: 'TODO', date: null, clientAction: false },
]

const mockProviders = [
  { role: 'Notar', provider: null, status: 'Wird ausgewählt' },
  { role: 'Geschäftsadresse', provider: null, status: 'Ausstehend' },
  { role: 'Buchhaltung', provider: { name: 'YPL Group' }, status: 'Bestätigt' },
]

const mockDocuments = [
  { name: 'Statuten (Entwurf)', type: 'PDF', status: 'Bereit zur Prüfung', date: '28.01.2024' },
  { name: 'Gründungsurkunde', type: 'PDF', status: 'In Vorbereitung', date: null },
]

export default function PortalCaseDetailPage({ params }: PageProps) {
  const { tenantSlug, caseId } = params
  const basePath = `/portal/${tenantSlug}`

  const completedSteps = mockSteps.filter(s => s.status === 'DONE').length
  const totalSteps = mockSteps.length
  const progressPercent = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href={`${basePath}/cases`} className="text-gray-500 hover:text-gray-700">
          Fälle
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">{mockCase.companyName}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{mockCase.companyName}</h1>
            <p className="text-gray-500">{mockCase.type} · Kanton {mockCase.canton}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Fall-Nr.</div>
            <div className="font-mono text-gray-900">{caseId}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Gesamtfortschritt</span>
            <span className="text-sm text-gray-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-solar-600 h-2 rounded-full transition-all" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Schritte</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {mockSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        step.status === 'DONE' ? 'bg-green-100 text-green-600' :
                        step.status === 'IN_PROGRESS' ? 'bg-solar-100 text-solar-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {step.status === 'DONE' ? '✓' : index + 1}
                      </div>
                      {index < mockSteps.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[20px] ${
                          step.status === 'DONE' ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          step.status === 'DONE' ? 'text-gray-500' :
                          step.status === 'IN_PROGRESS' ? 'text-gray-900' :
                          'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                        {step.clientAction && step.status !== 'DONE' && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                            Ihre Aktion
                          </span>
                        )}
                      </div>
                      {step.date && (
                        <div className="text-xs text-gray-400 mt-0.5">{step.date}</div>
                      )}
                      {step.description && step.status === 'IN_PROGRESS' && (
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Dokumente</h2>
              <Link href={`${basePath}/documents`} className="text-sm text-solar-600 hover:text-solar-700">
                Alle →
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {mockDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">📄</span>
                    <div>
                      <div className="font-medium text-gray-900">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs ${
                      doc.status === 'Bereit zur Prüfung' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Details</h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <div className="text-gray-500">Gesellschaftsform</div>
                <div className="font-medium">{mockCase.type}</div>
              </div>
              <div>
                <div className="text-gray-500">Stammkapital</div>
                <div className="font-medium">CHF {mockCase.shareCapital.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-500">Standort</div>
                <div className="font-medium">{mockCase.city}, {mockCase.canton}</div>
              </div>
              <div>
                <div className="text-gray-500">Gestartet</div>
                <div className="font-medium">{mockCase.createdAt}</div>
              </div>
            </div>
          </div>

          {/* Selected Providers */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Ihre Partner</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {mockProviders.map((item, index) => (
                <div key={index} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{item.role}</span>
                    <span className={`text-xs ${
                      item.status === 'Bestätigt' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  {item.provider && (
                    <div className="font-medium text-gray-900 mt-1">
                      {item.provider.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-solar-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Fragen?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Unser Team steht Ihnen zur Verfügung.
            </p>
            <a
              href="mailto:support@solar.ch"
              className="inline-flex items-center text-sm text-solar-600 hover:text-solar-700"
            >
              support@solar.ch →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
