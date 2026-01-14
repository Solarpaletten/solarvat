import { cities } from '@/lib/data'
import { calculateCosts, formatCurrency } from '@/lib/calculator'
import { CityCode, CompanyType } from '@/lib/types'
import Link from 'next/link'

interface PageProps {
  searchParams: {
    city?: string
    type?: string
  }
}

export default function CalculatorPage({ searchParams }: PageProps) {
  const cityCode = (searchParams.city as CityCode) || 'ZUG'
  const companyType = (searchParams.type as CompanyType) || 'GMBH'
  
  const estimate = calculateCosts(cityCode, companyType)
  const cityName = cities.find(c => c.code === cityCode)?.name || cityCode

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kostenrechner</h1>
        <p className="text-gray-600 mt-1">
          Geschätzte Kosten für Ihre Firmengründung in der Schweiz
        </p>
      </div>

      {/* Selectors */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Stadt
            </label>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city.code}
                  href={`/routes/calculator?city=${city.code}&type=${companyType}`}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    city.code === cityCode
                      ? 'bg-solar-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-solar-500'
                  }`}
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gesellschaftsform
            </label>
            <div className="flex gap-2">
              <Link
                href={`/routes/calculator?city=${cityCode}&type=GMBH`}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  companyType === 'GMBH'
                    ? 'bg-solar-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-solar-500'
                }`}
              >
                GmbH
              </Link>
              <Link
                href={`/routes/calculator?city=${cityCode}&type=AG`}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  companyType === 'AG'
                    ? 'bg-solar-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-solar-500'
                }`}
              >
                AG
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* First Year Total */}
        <div className="bg-solar-50 rounded-lg p-6 text-center">
          <div className="text-sm text-solar-700 font-medium mb-1">Erstes Jahr</div>
          <div className="text-3xl font-bold text-solar-900">
            {formatCurrency(estimate.firstYear)}
          </div>
          <div className="text-xs text-solar-600 mt-1">Total inkl. Gründung</div>
        </div>

        {/* One-time */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-sm text-gray-600 font-medium mb-1">Einmalige Kosten</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(estimate.oneTime)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Notar + Handelsregister</div>
        </div>

        {/* Recurring */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-sm text-gray-600 font-medium mb-1">Ab 2. Jahr</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(estimate.recurring)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Jährliche Kosten</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="font-semibold text-gray-900">
            Kostenaufstellung: {companyType} in {cityName}
          </h2>
        </div>
        <div className="divide-y">
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <div className="font-medium text-gray-900">Notar</div>
              <div className="text-sm text-gray-500">Beurkundung der Gründung</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(estimate.breakdown.notary)}</div>
              <div className="text-xs text-gray-500">einmalig</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <div className="font-medium text-gray-900">Handelsregister</div>
              <div className="text-sm text-gray-500">Eintragungsgebühr</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(estimate.breakdown.registry)}</div>
              <div className="text-xs text-gray-500">einmalig</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <div className="font-medium text-gray-900">Geschäftsadresse</div>
              <div className="text-sm text-gray-500">Domizil / virtuelles Büro</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(estimate.breakdown.address)}</div>
              <div className="text-xs text-gray-500">pro Jahr</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <div className="font-medium text-gray-900">Direktor</div>
              <div className="text-sm text-gray-500">Nominee / Treuhänder</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(estimate.breakdown.director)}</div>
              <div className="text-xs text-gray-500">pro Jahr</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <div className="font-medium text-gray-900">Buchhaltung</div>
              <div className="text-sm text-gray-500">Treuhand / Buchführung</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(estimate.breakdown.accounting)}</div>
              <div className="text-xs text-gray-500">pro Jahr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-sm text-gray-500 text-center">
        Alle Preise sind Richtwerte und können je nach Anbieter variieren.
        Für verbindliche Angebote kontaktieren Sie bitte die Anbieter direkt.
      </div>
    </div>
  )
}
