// Tenant Detail Page — Single tenant view

import Link from 'next/link'

interface PageProps {
  params: { tenantId: string }
}

// Mock data - in production this comes from database
const mockTenant = {
  id: '1',
  slug: 'techstart',
  name: 'TechStart GmbH',
  legalName: 'TechStart GmbH',
  email: 'info@techstart.ch',
  phone: '+41 41 123 45 67',
  street: 'Bahnhofstrasse 10',
  city: 'Zug',
  postalCode: '6300',
  canton: 'ZG',
  country: 'CH',
  uid: 'CHE-123.456.789',
  vatNumber: 'CHE-123.456.789 MWST',
  status: 'ACTIVE',
  createdAt: '2024-01-15',
}

const mockCases = [
  { id: 'SOLAR-2024-0024', companyName: 'TechStart GmbH', type: 'GMBH', status: 'REGISTERED', canton: 'ZG', created: '2024-01-20' },
  { id: 'SOLAR-2024-0030', companyName: 'TechStart Holding AG', type: 'AG', status: 'KYC_PENDING', canton: 'ZG', created: '2024-03-15' },
]

const mockInvoices = [
  { id: 'SOLAR-INV-2024-0012', amount: 'CHF 3,490', status: 'PAID', date: '2024-01-25' },
  { id: 'SOLAR-INV-2024-0018', amount: 'CHF 1,200', status: 'SENT', date: '2024-03-20' },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  LEAD: { label: 'Lead', color: 'bg-yellow-100 text-yellow-700' },
  KYC_PENDING: { label: 'KYC ausstehend', color: 'bg-yellow-100 text-yellow-700' },
  REGISTERED: { label: 'Registriert', color: 'bg-green-100 text-green-700' },
  ACTIVE: { label: 'Aktiv', color: 'bg-green-100 text-green-700' },
  PAID: { label: 'Bezahlt', color: 'bg-green-100 text-green-700' },
  SENT: { label: 'Gesendet', color: 'bg-blue-100 text-blue-700' },
}

export default function TenantDetailPage({ params }: PageProps) {
  const { tenantId } = params

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/tenants" className="text-gray-500 hover:text-gray-700">
          Mandanten
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">{mockTenant.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{mockTenant.name}</h1>
          <p className="text-gray-500">/{mockTenant.slug} · Mandant #{tenantId}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/portal/${mockTenant.slug}/dashboard`}
            className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Portal öffnen →
          </Link>
          <button className="px-3 py-2 text-sm text-white bg-solar-600 rounded-md hover:bg-solar-700">
            Bearbeiten
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Details</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Firma</div>
              <div className="font-medium">{mockTenant.legalName}</div>
            </div>
            <div>
              <div className="text-gray-500">UID</div>
              <div className="font-medium">{mockTenant.uid || '—'}</div>
            </div>
            <div>
              <div className="text-gray-500">MWST-Nr.</div>
              <div className="font-medium">{mockTenant.vatNumber || '—'}</div>
            </div>
            <div>
              <div className="text-gray-500">Status</div>
              <div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusLabels[mockTenant.status].color}`}>
                  {statusLabels[mockTenant.status].label}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-500">Adresse</div>
              <div className="font-medium">
                {mockTenant.street}<br />
                {mockTenant.postalCode} {mockTenant.city}, {mockTenant.canton}
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Kontakt</h2>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div>
              <div className="text-gray-500">E-Mail</div>
              <a href={`mailto:${mockTenant.email}`} className="text-solar-600 hover:text-solar-700">
                {mockTenant.email}
              </a>
            </div>
            <div>
              <div className="text-gray-500">Telefon</div>
              <a href={`tel:${mockTenant.phone}`} className="text-solar-600 hover:text-solar-700">
                {mockTenant.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cases */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Fälle</h2>
          <Link
            href={`/admin/tenants/${tenantId}/cases/new`}
            className="text-sm text-solar-600 hover:text-solar-700"
          >
            + Neuer Fall
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {mockCases.map((caseItem) => {
            const statusInfo = statusLabels[caseItem.status] || { label: caseItem.status, color: 'bg-gray-100' }
            return (
              <Link
                key={caseItem.id}
                href={`/admin/cases/${caseItem.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-gray-900">{caseItem.id}</div>
                  <div className="text-sm text-gray-500">{caseItem.companyName}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{caseItem.type} · {caseItem.canton}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Rechnungen</h2>
          <Link
            href={`/admin/invoices/new?tenant=${tenantId}`}
            className="text-sm text-solar-600 hover:text-solar-700"
          >
            + Neue Rechnung
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {mockInvoices.map((invoice) => {
            const statusInfo = statusLabels[invoice.status]
            return (
              <Link
                key={invoice.id}
                href={`/admin/invoices/${invoice.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-gray-900">{invoice.id}</div>
                  <div className="text-sm text-gray-500">{invoice.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{invoice.amount}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
