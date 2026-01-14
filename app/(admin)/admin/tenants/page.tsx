// Tenants List — All clients/organizations

import Link from 'next/link'

const mockTenants = [
  { id: '1', slug: 'techstart', name: 'TechStart GmbH', email: 'info@techstart.ch', status: 'ACTIVE', cases: 2, created: '2024-01-15' },
  { id: '2', slug: 'alpine-ventures', name: 'Alpine Ventures AG', email: 'contact@alpine-v.ch', status: 'ACTIVE', cases: 1, created: '2024-02-20' },
  { id: '3', slug: 'digital-solutions', name: 'Digital Solutions', email: 'hello@digsol.ch', status: 'LEAD', cases: 1, created: '2024-03-10' },
  { id: '4', slug: 'swiss-trading', name: 'Swiss Trading Co', email: 'info@swisstrading.ch', status: 'ACTIVE', cases: 3, created: '2024-01-05' },
  { id: '5', slug: 'fintech-hub', name: 'FinTech Hub GmbH', email: 'team@fintech-hub.ch', status: 'ACTIVE', cases: 1, created: '2024-03-01' },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  LEAD: { label: 'Lead', color: 'bg-yellow-100 text-yellow-700' },
  ACTIVE: { label: 'Aktiv', color: 'bg-green-100 text-green-700' },
  SUSPENDED: { label: 'Suspendiert', color: 'bg-red-100 text-red-700' },
  CHURNED: { label: 'Verloren', color: 'bg-gray-100 text-gray-700' },
}

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mandanten</h1>
          <p className="text-gray-600">Alle Kunden und Organisationen</p>
        </div>
        <Link
          href="/admin/tenants/new"
          className="px-4 py-2 bg-solar-600 text-white text-sm font-medium rounded-md hover:bg-solar-700 transition-colors"
        >
          + Neuer Mandant
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">Alle Status</option>
          <option value="LEAD">Lead</option>
          <option value="ACTIVE">Aktiv</option>
          <option value="SUSPENDED">Suspendiert</option>
          <option value="CHURNED">Verloren</option>
        </select>
        <input
          type="text"
          placeholder="Suchen..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1 max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">E-Mail</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Fälle</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Erstellt</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockTenants.map((tenant) => {
              const statusInfo = statusLabels[tenant.status]
              return (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/tenants/${tenant.id}`} className="font-medium text-gray-900 hover:text-solar-700">
                      {tenant.name}
                    </Link>
                    <div className="text-xs text-gray-500">/{tenant.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{tenant.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{tenant.cases}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{tenant.created}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/tenants/${tenant.id}`} className="text-sm text-solar-600 hover:text-solar-700">
                      Öffnen →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Zeige 1-5 von 24 Mandanten</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" disabled>
            Zurück
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            Weiter
          </button>
        </div>
      </div>
    </div>
  )
}
