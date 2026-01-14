// SOLAR Platform — Types (World-Scale Ready)

// ============================================
// GEOGRAPHY
// ============================================

export type CountryCode = 'CH' | 'DE' | 'AT' | 'EE' | 'US'

export type CantonCode = 
  | 'ZG' | 'ZH' | 'GE' | 'BS' | 'VD' | 'TI' | 'SG' | 'BE' | 'LU' | 'AG' | 'SZ' | 'NW' | 'OW'
  | 'ALL_SWISS'

export type CityCode = 
  | 'ZUG' | 'ZURICH' | 'GENEVA' | 'BASEL' | 'LAUSANNE' | 'LUGANO' | 'ST_GALLEN' | 'BERN' | 'LUCERNE'

export interface Country {
  code: CountryCode
  name: string
  cantons: Canton[]
}

export interface Canton {
  code: CantonCode
  name: string
  countryCode: CountryCode
  cities: City[]
}

export interface City {
  code: CityCode
  name: string
  cantonCode: CantonCode
  countryCode: CountryCode
}

// ============================================
// COMPANY TYPES
// ============================================

export type CompanyType = 'GMBH' | 'AG'

// ============================================
// NOTARIES
// ============================================

export type NotaryType = 'ONLINE' | 'PRIVATE' | 'MUNICIPAL'

export interface Notary {
  id: string
  name: string
  type: NotaryType
  countryCode: CountryCode
  cantonCode: CantonCode
  cityCodes: CityCode[]
  isMultiRegion: boolean
  digitalQes: boolean
  upregAccess: boolean
  supportsGmbh: boolean
  supportsAg: boolean
  priceGmbh: number | null
  priceAg: number | null
  website: string | null
  email: string | null
  phone: string | null
}

// ============================================
// LEGAL ADDRESSES
// ============================================

export type AddressType = 'CO' | 'VIRTUAL' | 'FULL'

export interface LegalAddress {
  id: string
  companyName: string
  countryCode: CountryCode
  cantonCode: CantonCode
  cityCodes: CityCode[]
  isMultiRegion: boolean
  addressType: AddressType
  mailForwarding: boolean
  phoneService: boolean
  meetingRoom: boolean
  pricePerYear: number
  website: string | null
  email: string | null
}

// ============================================
// NOMINEE DIRECTORS
// ============================================

export type DirectorType = 'NOMINEE' | 'FIDUCIARY' | 'ACTIVE'

export interface NomineeDirector {
  id: string
  name: string
  companyName: string | null
  countryCode: CountryCode
  cantonCodes: CantonCode[]
  cityCodes: CityCode[]
  isMultiRegion: boolean
  directorType: DirectorType
  supportsGmbh: boolean
  supportsAg: boolean
  pricePerYear: number
  pricePerYearAg: number | null
  website: string | null
  email: string | null
}

// ============================================
// ACCOUNTING PARTNERS
// ============================================

export interface AccountingPartner {
  id: string
  companyName: string
  countryCode: CountryCode
  cantonCodes: CantonCode[]
  cityCodes: CityCode[]
  isMultiRegion: boolean
  vatServices: boolean
  payrollServices: boolean
  auditServices: boolean
  internationalTrade: boolean
  pricePerYear: number
  isPrimary: boolean
  website: string | null
  email: string | null
}

// ============================================
// QES PROVIDERS
// ============================================

export interface QesProvider {
  id: string
  name: string
  countryCode: CountryCode
  upregAccess: boolean
  pricePerSignature: number
  features: string[]
  website: string | null
}

// ============================================
// FILTERS
// ============================================

export interface FilterState {
  countryCode: CountryCode | null
  cantonCode: CantonCode | null
  cityCode: CityCode | null
  companyType: CompanyType | null
  digitalOnly: boolean
}

export const defaultFilters: FilterState = {
  countryCode: 'CH',
  cantonCode: null,
  cityCode: null,
  companyType: null,
  digitalOnly: false,
}

// ============================================
// COST CALCULATOR
// ============================================

export interface CostBreakdown {
  notary: number
  registry: number
  address: number
  director: number
  accounting: number
}

export interface CostEstimate {
  cityCode: CityCode
  companyType: CompanyType
  breakdown: CostBreakdown
  firstYear: number
  recurring: number
  oneTime: number
}

// ============================================
// FILTER FUNCTIONS
// ============================================

export function filterByCity<T extends { cityCodes: CityCode[], isMultiRegion: boolean }>(
  items: T[],
  cityCode: CityCode | null
): T[] {
  if (!cityCode) return items
  return items.filter(item => 
    item.isMultiRegion || item.cityCodes.includes(cityCode)
  )
}

export function filterByCanton<T extends { cantonCode?: CantonCode, cantonCodes?: CantonCode[], isMultiRegion: boolean }>(
  items: T[],
  cantonCode: CantonCode | null
): T[] {
  if (!cantonCode) return items
  return items.filter(item => {
    if (item.isMultiRegion) return true
    if (item.cantonCode) return item.cantonCode === cantonCode || item.cantonCode === 'ALL_SWISS'
    if (item.cantonCodes) return item.cantonCodes.includes(cantonCode) || item.cantonCodes.includes('ALL_SWISS')
    return false
  })
}

export function filterByCompanyType<T extends { supportsGmbh: boolean, supportsAg: boolean }>(
  items: T[],
  companyType: CompanyType | null
): T[] {
  if (!companyType) return items
  return items.filter(item => 
    companyType === 'GMBH' ? item.supportsGmbh : item.supportsAg
  )
}

export function filterByDigital<T extends { digitalQes?: boolean }>(
  items: T[],
  digitalOnly: boolean
): T[] {
  if (!digitalOnly) return items
  return items.filter(item => item.digitalQes === true)
}
