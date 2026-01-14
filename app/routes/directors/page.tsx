import { nomineeDirectors, cantons } from '@/lib/data'
import { CantonCode, CityCode, CompanyType, filterByCity } from '@/lib/types'
import Filters from '@/app/components/Filters'

interface PageProps {
  searchParams: {
    canton?: string
    city?: string
    type?: string
  }
}

export default function DirectorsPage({ searchParams }: PageProps) {
  const cantonCode = searchParams.canton as CantonCode | undefined
  const cityCode = searchParams.city as CityCode | undefined
  const companyType = searchParams.type as CompanyType | undefined

  // Filter directors
  let filtered = [...nomineeDirectors]
  
  if (cantonCode) {
    filtered = filtered.filter(d => 
      d.isMultiRegion || 
      d.cantonCodes.includes(cantonCode) || 
      d.cantonCodes.includes('ALL_SWISS')
    )
  }
  
  if (cityCode) {
    filtered = filterByCity(filtered, cityCode)
  }
  
  if (companyType) {
    filtered = filtered.filter(d => 
      companyType === 'GMBH' ? d.supportsGmbh : d.supportsAg
    )
  }

  const directorTypeLabels = {
    NOMINEE: 'Nominee',
    FIDUCIARY: 'Treuhänder',
    ACTIVE: 'Aktiv',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Direktoren</h1>
        <p className="text-gray-600 mt-1">
          Nominee- und Treuhand-Direktoren für GmbH und AG
        </p>
      </div>

      <Filters showCompanyType={true} showDigitalOnly={false} />

      <div className="text-sm text-gray-500 mb-4">
        {filtered.length} Ergebnisse
      </div>

      <div className="table-container border border-gray-200 rounded-lg overflow-hidden">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unternehmen</th>
              <th>Typ</th>
              <th>Kantone</th>
              <th>GmbH</th>
              <th>AG</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-8">
                  Keine Direktoren für diese Filter gefunden.
                </td>
              </tr>
            ) : (
              filtered.map((director) => (
                <tr key={director.id}>
                  <td className="font-medium">{director.name}</td>
                  <td className="text-gray-600">{director.companyName || '—'}</td>
                  <td>
                    <span className={`badge ${
                      director.directorType === 'FIDUCIARY' ? 'badge-success' :
                      director.directorType === 'ACTIVE' ? 'badge-warning' :
                      'badge-neutral'
                    }`}>
                      {directorTypeLabels[director.directorType]}
                    </span>
                  </td>
                  <td className="text-sm">
                    {director.cantonCodes.includes('ALL_SWISS') 
                      ? 'Ganze CH' 
                      : director.cantonCodes.map(c => 
                          cantons.find(ct => ct.code === c)?.name || c
                        ).join(', ')
                    }
                  </td>
                  <td>
                    {director.supportsGmbh ? (
                      <span>CHF {director.pricePerYear.toLocaleString('de-CH')}/J</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {director.supportsAg && director.pricePerYearAg ? (
                      <span>CHF {director.pricePerYearAg.toLocaleString('de-CH')}/J</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {director.website ? (
                      <a 
                        href={director.website} 
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
