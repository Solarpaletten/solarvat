// SOLAR Platform — Cost Calculator Logic

import { CityCode, CompanyType, CostBreakdown, CostEstimate } from './types'

// Registry fees (Handelsregister) by canton
const registryFees: Record<string, { gmbh: number; ag: number }> = {
  ZG: { gmbh: 550, ag: 750 },
  ZH: { gmbh: 750, ag: 950 },
  GE: { gmbh: 700, ag: 900 },
  BS: { gmbh: 650, ag: 850 },
  DEFAULT: { gmbh: 600, ag: 800 },
}

// Typical costs by city (median values from data)
const typicalCosts: Record<CityCode, {
  notary: { gmbh: number; ag: number };
  address: number;
  director: { gmbh: number; ag: number };
  accounting: number;
  canton: string;
}> = {
  ZUG: {
    notary: { gmbh: 435, ag: 750 },
    address: 1200,
    director: { gmbh: 2500, ag: 4000 },
    accounting: 1800,
    canton: 'ZG',
  },
  ZURICH: {
    notary: { gmbh: 550, ag: 850 },
    address: 1500,
    director: { gmbh: 3000, ag: 4500 },
    accounting: 2400,
    canton: 'ZH',
  },
  GENEVA: {
    notary: { gmbh: 600, ag: 900 },
    address: 1800,
    director: { gmbh: 3500, ag: 5000 },
    accounting: 3000,
    canton: 'GE',
  },
  BASEL: {
    notary: { gmbh: 550, ag: 800 },
    address: 1400,
    director: { gmbh: 2800, ag: 4200 },
    accounting: 2200,
    canton: 'BS',
  },
  LAUSANNE: {
    notary: { gmbh: 500, ag: 750 },
    address: 1300,
    director: { gmbh: 2600, ag: 4000 },
    accounting: 2000,
    canton: 'VD',
  },
  LUGANO: {
    notary: { gmbh: 480, ag: 720 },
    address: 1100,
    director: { gmbh: 2400, ag: 3800 },
    accounting: 1900,
    canton: 'TI',
  },
  ST_GALLEN: {
    notary: { gmbh: 390, ag: 590 },
    address: 1000,
    director: { gmbh: 2200, ag: 3500 },
    accounting: 1600,
    canton: 'SG',
  },
  BERN: {
    notary: { gmbh: 500, ag: 780 },
    address: 1200,
    director: { gmbh: 2500, ag: 4000 },
    accounting: 1800,
    canton: 'BE',
  },
  LUCERNE: {
    notary: { gmbh: 450, ag: 700 },
    address: 1100,
    director: { gmbh: 2300, ag: 3600 },
    accounting: 1700,
    canton: 'LU',
  },
}

export function calculateCosts(cityCode: CityCode, companyType: CompanyType): CostEstimate {
  const cityData = typicalCosts[cityCode]
  const cantonCode = cityData.canton
  const registry = registryFees[cantonCode] || registryFees.DEFAULT

  const breakdown: CostBreakdown = {
    notary: companyType === 'GMBH' ? cityData.notary.gmbh : cityData.notary.ag,
    registry: companyType === 'GMBH' ? registry.gmbh : registry.ag,
    address: cityData.address,
    director: companyType === 'GMBH' ? cityData.director.gmbh : cityData.director.ag,
    accounting: cityData.accounting,
  }

  // One-time costs: notary + registry
  const oneTime = breakdown.notary + breakdown.registry

  // Recurring costs: address + director + accounting
  const recurring = breakdown.address + breakdown.director + breakdown.accounting

  // First year: everything
  const firstYear = oneTime + recurring

  return {
    cityCode,
    companyType,
    breakdown,
    firstYear,
    recurring,
    oneTime,
  }
}

export function getAllCityCosts(companyType: CompanyType): CostEstimate[] {
  return Object.keys(typicalCosts).map(cityCode => 
    calculateCosts(cityCode as CityCode, companyType)
  )
}

export function formatCurrency(amount: number): string {
  return `CHF ${amount.toLocaleString('de-CH')}`
}
