// Case Detail Page — Full case view with timeline and providers

import Link from 'next/link'

interface PageProps {
  params: { caseId: string }
}

// Mock data
const mockCase = {
  id: 'SOLAR-2024-0024',
  tenant: { id: '1', name: 'TechStart GmbH', slug: 'techstart' },
  companyType: 'GMBH',
  companyName: 'TechStart GmbH',
  purpose: 'Software development and consulting',
  canton: 'ZG',
  city: 'Zug',
  shareCapital: 20000,
  status: 'PROVIDERS_SELECTING',
  createdAt: '2024-01-20',
  createdBy: 'Anna Schmidt',
}

const mockSteps = [
  { id: '1', type: 'KYC_COLLECT', label: 'KYC sammeln', status: 'DONE', completedAt: '2024-01-22' },
  { id: '2', type: 'KYC_REVIEW', label: 'KYC prüfen', status: 'DONE', completedAt: '2024-01-24' },
  { id: '3', type: 'KYC_APPROVE', label: 'KYC genehmigen', status: 'DONE', completedAt: '2024-01-25' },
  { id: '4', type: 'SELECT_NOTARY', label: 'Notar wählen', status: 'IN_PROGRESS', assignee: 'Anna Schmidt' },
  { id: '5', type: 'SELECT_ADDRESS', label: 'Adresse wählen', status: 'TODO' },
  { id: '6', type: 'SELECT_DIRECTOR', label: 'Direktor wählen', status: 'TODO' },
  { id: '7', type: 'SELECT_ACCOUNTING', label: 'Buchhaltung wählen', status: 'TODO' },
  { id: '8', type: 'PREPARE_DOCUMENTS', label: 'Dokumente vorbereiten', status: 'TODO' },
  { id: '9', type: 'NOTARY_APPOINTMENT', label: 'Notartermin', status: 'TODO' },
  { id: '10', type: 'SIGN_DOCUMENTS', label: 'Dokumente signieren', status: 'TODO' },
  { id: '11', type: 'SUBMIT_REGISTRY', label: 'HR-Eintragung', status: 'TODO' },
  { id: '12', type: 'RECEIVE_UID', label: 'UID erhalten', status: 'TODO' },
]

const mockProviders = [
  { role: 'NOTARY', provider: null, status: 'SELECTING' },
  { role: 'ADDRESS', provider: null, status: 'PENDING' },
  { role: 'DIRECTOR', provider: null, status: 'PENDING' },
  { role: 'ACCOUNTING', provider: { name: 'YPL Group', price: 1800 }, status: 'CONFIRMED' },
]

const stepStatusIcons: Record<string, string> = {
  DONE: '✅',
  IN_PROGRESS: '🔄',
  TODO: '⬜',
  BLOCKED: '🚫',
  SKIPPED: '⏭️',
}

const providerRoleLabels: Record<string, string> = {
  NOTARY: 'Notar',
  ADDRESS: 'Adresse',
  DIRECTOR: 'Direktor',
  ACCOUNTING: 'Buchhaltung',
}

export default function CaseDetailPage({ params }: PageProps) {
  const { caseId } = params

  // Calculate progress
  const completedSteps = mockSteps.filter(s => s.status === 'DONE').length
  const totalSteps = mockSteps.length
  const progressPercent = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/cases" className="text-gray-500 hover:text-gray-700">
          Fälle
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">{caseId}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{mockCase.companyName}</h1>
          <p className="text-gray-500">{caseId} · {mockCase.companyType} · Kanton {mockCase.canton}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/tenants/${mockCase.tenant.id}`}
            className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Mandant →
          </Link>
          <button className="px-3 py-2 text-sm text-white bg-solar-600 rounded-md hover:bg-solar-700">
            Bearbeiten
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Fortschritt</span>
          <span className="text-sm text-gray-500">{completedSteps}/{totalSteps} Schritte ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-solar-600 h-2 rounded-full transition-all" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Timeline</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {mockSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-lg">{stepStatusIcons[step.status]}</span>
                    {index < mockSteps.length - 1 && (
                      <div className={`w-0.5 h-8 ${step.status === 'DONE' ? 'bg-green-300' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${step.status === 'DONE' ? 'text-gray-500' : 'text-gray-900'}`}>
                        {step.label}
                      </span>
                      {step.completedAt && (
                        <span className="text-xs text-gray-400">{step.completedAt}</span>
                      )}
                    </div>
                    {step.assignee && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        Zugewiesen: {step.assignee}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Info */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Details</h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <div className="text-gray-500">Mandant</div>
                <Link href={`/admin/tenants/${mockCase.tenant.id}`} className="font-medium text-solar-600 hover:text-solar-700">
                  {mockCase.tenant.name}
                </Link>
              </div>
              <div>
                <div className="text-gray-500">Gesellschaftsform</div>
                <div className="font-medium">{mockCase.companyType}</div>
              </div>
              <div>
                <div className="text-gray-500">Stammkapital</div>
                <div className="font-medium">CHF {mockCase.shareCapital.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-500">Kanton / Stadt</div>
                <div className="font-medium">{mockCase.canton} / {mockCase.city}</div>
              </div>
              <div>
                <div className="text-gray-500">Zweck</div>
                <div className="font-medium text-gray-700">{mockCase.purpose}</div>
              </div>
              <div>
                <div className="text-gray-500">Erstellt von</div>
                <div className="font-medium">{mockCase.createdBy}</div>
              </div>
            </div>
          </div>

          {/* Provider Bundle */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Provider Bundle</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {mockProviders.map((item) => (
                <div key={item.role} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{providerRoleLabels[item.role]}</span>
                    {item.status === 'CONFIRMED' ? (
                      <span className="text-xs text-green-600">✓ Bestätigt</span>
                    ) : item.status === 'SELECTING' ? (
                      <span className="text-xs text-blue-600">Auswählen...</span>
                    ) : (
                      <span className="text-xs text-gray-400">Ausstehend</span>
                    )}
                  </div>
                  {item.provider ? (
                    <div className="mt-1">
                      <div className="font-medium text-gray-900">{item.provider.name}</div>
                      <div className="text-sm text-gray-500">CHF {item.provider.price}/Jahr</div>
                    </div>
                  ) : (
                    <button className="mt-1 text-sm text-solar-600 hover:text-solar-700">
                      + Provider wählen
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <Link
                href={`/admin/catalog/notaries?canton=${mockCase.canton}`}
                className="text-sm text-solar-600 hover:text-solar-700"
              >
                Katalog öffnen →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Notizen</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                AS
              </div>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium">Anna Schmidt</span>
                  <span className="text-gray-500 ml-2">vor 2 Stunden</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  KYC-Dokumente erhalten und geprüft. Alles in Ordnung, weiter zur Provider-Auswahl.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <textarea
              placeholder="Notiz hinzufügen..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-500">
                <input type="checkbox" className="rounded" />
                Intern (für Kunden nicht sichtbar)
              </label>
              <button className="px-3 py-1.5 bg-solar-600 text-white text-sm rounded-md hover:bg-solar-700">
                Speichern
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
