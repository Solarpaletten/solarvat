import { accountingPartners, cantons } from '@/lib/data'
import { CantonCode, CityCode, filterByCity } from '@/lib/types'
import Filters from '@/app/components/Filters'

interface PageProps {
  searchParams: {
    canton?: string
    city?: string
  }
}

export default function AccountingPage({ searchParams }: PageProps) {
  const cantonCode = searchParams.canton as CantonCode | undefined
  const cityCode = searchParams.city as CityCode | undefined

  // Filter partners
  let filtered = [...accountingPartners]
  
  if (cantonCode) {
    filtered = filtered.filter(a => 
      a.isMultiRegion || 
      a.cantonCodes.includes(cantonCode) || 
      a.cantonCodes.includes('ALL_SWISS')
    )
  }
  
  if (cityCode) {
    filtered = filterByCity(filtered, cityCode)
  }

  // Sort: primary first
  filtered.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buchhaltung</h1>
        <p className="text-gray-600 mt-1">
          Treuhand- und Buchhaltungspartner in der Schweiz
        </p>
      </div>

      <Filters showCompanyType={false} showDigitalOnly={false} />

      <div className="text-sm text-gray-500 mb-4">
        {filtered.length} Ergebnisse
      </div>

      <div className="table-container border border-gray-200 rounded-lg overflow-hidden">
        <table>
          <thead>
            <tr>
              <th>Unternehmen</th>
              <th>Kantone</th>
              <th>MWST</th>
              <th>Lohn</th>
              <th>Revision</th>
              <th>Int. Handel</th>
              <th>Ab Preis/Jahr</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-8">
                  Keine Buchhaltungspartner für diese Filter gefunden.
                </td>
              </tr>
            ) : (
              filtered.map((partner) => (
                <tr key={partner.id} className={partner.isPrimary ? 'bg-solar-50' : ''}>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      {partner.companyName}
                      {partner.isPrimary && (
                        <span className="badge badge-primary">Unser Partner</span>
                      )}
                    </div>
                  </td>
                  <td className="text-sm">
                    {partner.cantonCodes.includes('ALL_SWISS') 
                      ? 'Ganze CH' 
                      : partner.cantonCodes.slice(0, 3).map(c => 
                          cantons.find(ct => ct.code === c)?.name || c
                        ).join(', ') + (partner.cantonCodes.length > 3 ? '...' : '')
                    }
                  </td>
                  <td>
                    {partner.vatServices ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {partner.payrollServices ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {partner.auditServices ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {partner.internationalTrade ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>CHF {partner.pricePerYear.toLocaleString('de-CH')}</td>
                  <td>
                    {partner.website ? (
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-solar-600 hover:text-solar-700"
                      >
                        Link →
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
