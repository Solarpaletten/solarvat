'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { cantons, getCitiesByCanton } from '@/lib/data'
import { CantonCode, CityCode, CompanyType } from '@/lib/types'

interface FiltersProps {
  showCompanyType?: boolean
  showDigitalOnly?: boolean
}

export default function Filters({ showCompanyType = true, showDigitalOnly = true }: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCanton = searchParams.get('canton') as CantonCode | null
  const currentCity = searchParams.get('city') as CityCode | null
  const currentCompanyType = searchParams.get('type') as CompanyType | null
  const digitalOnly = searchParams.get('digital') === 'true'

  const cities = currentCanton && currentCanton !== 'ALL_SWISS' 
    ? getCitiesByCanton(currentCanton)
    : []

  const updateParams = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Reset city when canton changes
    if (key === 'canton') {
      params.delete('city')
    }

    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Canton Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Kanton
          </label>
          <select
            value={currentCanton || ''}
            onChange={(e) => updateParams('canton', e.target.value || null)}
            className="filter-select"
          >
            <option value="">Alle Kantone</option>
            {cantons.map((canton) => (
              <option key={canton.code} value={canton.code}>
                {canton.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Stadt
          </label>
          <select
            value={currentCity || ''}
            onChange={(e) => updateParams('city', e.target.value || null)}
            className="filter-select"
            disabled={!currentCanton || currentCanton === 'ALL_SWISS'}
          >
            <option value="">Alle Städte</option>
            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Company Type Filter */}
        {showCompanyType && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gesellschaftsform
            </label>
            <select
              value={currentCompanyType || ''}
              onChange={(e) => updateParams('type', e.target.value || null)}
              className="filter-select"
            >
              <option value="">Alle</option>
              <option value="GMBH">GmbH</option>
              <option value="AG">AG</option>
            </select>
          </div>
        )}

        {/* Digital Only Filter */}
        {showDigitalOnly && (
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={digitalOnly}
                onChange={(e) => updateParams('digital', e.target.checked ? 'true' : null)}
                className="filter-checkbox"
              />
              <span className="text-sm text-gray-700">Nur Digital (QES)</span>
            </label>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(currentCanton || currentCity || currentCompanyType || digitalOnly) && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {currentCanton && (
              <span className="badge badge-primary">
                {cantons.find(c => c.code === currentCanton)?.name}
              </span>
            )}
            {currentCity && (
              <span className="badge badge-primary">
                {cities.find(c => c.code === currentCity)?.name}
              </span>
            )}
            {currentCompanyType && (
              <span className="badge badge-neutral">
                {currentCompanyType}
              </span>
            )}
            {digitalOnly && (
              <span className="badge badge-success">
                Digital
              </span>
            )}
          </div>
          <button
            onClick={() => router.push(pathname)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Zurücksetzen
          </button>
        </div>
      )}
    </div>
  )
}
