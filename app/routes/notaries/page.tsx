import { notaries, cantons, getCitiesByCanton } from '@/lib/data'
import { CantonCode, CityCode, CompanyType, filterByCanton, filterByCity, filterByCompanyType, filterByDigital } from '@/lib/types'
import Filters from '@/app/components/Filters'

interface PageProps {
  searchParams: {
    canton?: string
    city?: string
    type?: string
    digital?: string
  }
}

export default function NotariesPage({ searchParams }: PageProps) {
  const cantonCode = searchParams.canton as CantonCode | undefined
  const cityCode = searchParams.city as CityCode | undefined
  const companyType = searchParams.type as CompanyType | undefined
  const digitalOnly = searchParams.digital === 'true'

  // Filter notaries
  let filtered = [...notaries]
  
  if (cantonCode) {
    filtered = filterByCanton(filtered, cantonCode)
  }
  
  if (cityCode) {
    filtered = filterByCity(filtered, cityCode)
  }
  
  if (companyType) {
    filtered = filterByCompanyType(filtered, companyType)
  }
  
  if (digitalOnly) {
    filtered = filterByDigital(filtered, digitalOnly)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notare</h1>
        <p className="text-gray-600 mt-1">
          Notarielle Dienstleistungen für Firmengründung in der Schweiz
        </p>
      </div>

      <Filters showCompanyType={true} showDigitalOnly={true} />

      <div className="text-sm text-gray-500 mb-4">
        {filtered.length} Ergebnisse
      </div>

      <div className="table-container border border-gray-200 rounded-lg overflow-hidden">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Typ</th>
              <th>Kanton</th>
              <th>QES</th>
              <th>UR-Zugang</th>
              <th>GmbH</th>
              <th>AG</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-8">
                  Keine Notare für diese Filter gefunden.
                </td>
              </tr>
            ) : (
              filtered.map((notary) => (
                <tr key={notary.id}>
                  <td className="font-medium">{notary.name}</td>
                  <td>
                    <span className={`badge ${
                      notary.type === 'ONLINE' ? 'badge-success' :
                      notary.type === 'PRIVATE' ? 'badge-neutral' :
                      'badge-warning'
                    }`}>
                      {notary.type === 'ONLINE' ? 'Online' :
                       notary.type === 'PRIVATE' ? 'Privat' : 'Amt'}
                    </span>
                  </td>
                  <td>{cantons.find(c => c.code === notary.cantonCode)?.name || notary.cantonCode}</td>
                  <td>
                    {notary.digitalQes ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {notary.upregAccess ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {notary.priceGmbh ? (
                      <span>CHF {notary.priceGmbh}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {notary.priceAg ? (
                      <span>CHF {notary.priceAg}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {notary.website ? (
                      <a 
                        href={notary.website} 
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
