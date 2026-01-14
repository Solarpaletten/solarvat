import { legalAddresses, cantons } from '@/lib/data'
import { CantonCode, CityCode, filterByCanton, filterByCity } from '@/lib/types'
import Filters from '@/app/components/Filters'

interface PageProps {
  searchParams: {
    canton?: string
    city?: string
  }
}

export default function AddressesPage({ searchParams }: PageProps) {
  const cantonCode = searchParams.canton as CantonCode | undefined
  const cityCode = searchParams.city as CityCode | undefined

  // Filter addresses
  let filtered = [...legalAddresses]
  
  if (cantonCode) {
    filtered = filterByCanton(filtered, cantonCode)
  }
  
  if (cityCode) {
    filtered = filterByCity(filtered, cityCode)
  }

  const addressTypeLabels = {
    CO: 'c/o Adresse',
    VIRTUAL: 'Virtuell',
    FULL: 'Vollservice',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Geschäftsadressen</h1>
        <p className="text-gray-600 mt-1">
          Domizil und virtuelle Bürodienstleistungen
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
              <th>Anbieter</th>
              <th>Kanton</th>
              <th>Typ</th>
              <th>Post</th>
              <th>Telefon</th>
              <th>Meeting</th>
              <th>Preis/Jahr</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-8">
                  Keine Adressen für diese Filter gefunden.
                </td>
              </tr>
            ) : (
              filtered.map((address) => (
                <tr key={address.id}>
                  <td className="font-medium">{address.companyName}</td>
                  <td>{cantons.find(c => c.code === address.cantonCode)?.name || address.cantonCode}</td>
                  <td>
                    <span className={`badge ${
                      address.addressType === 'FULL' ? 'badge-success' :
                      address.addressType === 'VIRTUAL' ? 'badge-primary' :
                      'badge-neutral'
                    }`}>
                      {addressTypeLabels[address.addressType]}
                    </span>
                  </td>
                  <td>
                    {address.mailForwarding ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {address.phoneService ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>
                    {address.meetingRoom ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td>CHF {address.pricePerYear.toLocaleString('de-CH')}</td>
                  <td>
                    {address.website ? (
                      <a 
                        href={address.website} 
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
