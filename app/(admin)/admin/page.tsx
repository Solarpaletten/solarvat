// Admin Dashboard — Overview of SOLAR Operations

const stats = [
  { label: 'Aktive Mandanten', value: '24', change: '+3', trend: 'up' },
  { label: 'Offene Fälle', value: '12', change: '-2', trend: 'down' },
  { label: 'Ausstehende Rechnungen', value: 'CHF 45,200', change: '+12,000', trend: 'up' },
  { label: 'Diesen Monat registriert', value: '5', change: '+2', trend: 'up' },
]

const recentCases = [
  { id: 'SOLAR-2024-0024', tenant: 'TechStart GmbH', status: 'PROVIDERS_SELECTING', type: 'GMBH', canton: 'ZG' },
  { id: 'SOLAR-2024-0023', tenant: 'Alpine Ventures AG', status: 'NOTARY_SCHEDULED', type: 'AG', canton: 'ZH' },
  { id: 'SOLAR-2024-0022', tenant: 'Digital Solutions', status: 'KYC_PENDING', type: 'GMBH', canton: 'ZG' },
  { id: 'SOLAR-2024-0021', tenant: 'Swiss Trading Co', status: 'REGISTERED', type: 'AG', canton: 'GE' },
  { id: 'SOLAR-2024-0020', tenant: 'FinTech Hub', status: 'VAT_APPLYING', type: 'GMBH', canton: 'ZG' },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  LEAD: { label: 'Lead', color: 'bg-gray-100 text-gray-700' },
  KYC_PENDING: { label: 'KYC ausstehend', color: 'bg-yellow-100 text-yellow-700' },
  KYC_APPROVED: { label: 'KYC genehmigt', color: 'bg-green-100 text-green-700' },
  PROVIDERS_SELECTING: { label: 'Provider-Auswahl', color: 'bg-blue-100 text-blue-700' },
  PROVIDERS_CONFIRMED: { label: 'Provider bestätigt', color: 'bg-blue-100 text-blue-700' },
  NOTARY_SCHEDULED: { label: 'Notar geplant', color: 'bg-purple-100 text-purple-700' },
  DOCUMENTS_SIGNING: { label: 'Signierung', color: 'bg-purple-100 text-purple-700' },
  FILED: { label: 'Eingereicht', color: 'bg-orange-100 text-orange-700' },
  REGISTERED: { label: 'Registriert', color: 'bg-green-100 text-green-700' },
  VAT_APPLYING: { label: 'MWST-Antrag', color: 'bg-cyan-100 text-cyan-700' },
  VAT_GRANTED: { label: 'MWST erteilt', color: 'bg-green-100 text-green-700' },
  ACTIVE: { label: 'Aktiv', color: 'bg-green-100 text-green-700' },
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Willkommen bei SOLAR Operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Cases */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Aktuelle Fälle</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentCases.map((caseItem) => {
            const statusInfo = statusLabels[caseItem.status] || { label: caseItem.status, color: 'bg-gray-100 text-gray-700' }
            return (
              <a
                key={caseItem.id}
                href={`/admin/cases/${caseItem.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium text-gray-900">{caseItem.id}</div>
                    <div className="text-sm text-gray-500">{caseItem.tenant}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{caseItem.type} · {caseItem.canton}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <a href="/admin/cases" className="text-sm text-solar-600 hover:text-solar-700">
            Alle Fälle anzeigen →
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/admin/tenants/new"
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-solar-500 transition-colors"
        >
          <span className="text-2xl">➕</span>
          <div>
            <div className="font-medium text-gray-900">Neuer Mandant</div>
            <div className="text-sm text-gray-500">Mandant erstellen</div>
          </div>
        </a>
        <a
          href="/admin/cases/new"
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-solar-500 transition-colors"
        >
          <span className="text-2xl">📁</span>
          <div>
            <div className="font-medium text-gray-900">Neuer Fall</div>
            <div className="text-sm text-gray-500">Registrierung starten</div>
          </div>
        </a>
        <a
          href="/admin/invoices/new"
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-solar-500 transition-colors"
        >
          <span className="text-2xl">💰</span>
          <div>
            <div className="font-medium text-gray-900">Neue Rechnung</div>
            <div className="text-sm text-gray-500">Rechnung erstellen</div>
          </div>
        </a>
      </div>
    </div>
  )
}
