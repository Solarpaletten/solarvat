// SOLAR Platform — Geography Data

import { Country, Canton, City } from '../types'

export const countries: Country[] = [
  {
    code: 'CH',
    name: 'Schweiz',
    cantons: [],
  },
]

export const cantons: Canton[] = [
  { code: 'ZG', name: 'Zug', countryCode: 'CH', cities: [] },
  { code: 'ZH', name: 'Zürich', countryCode: 'CH', cities: [] },
  { code: 'GE', name: 'Genf', countryCode: 'CH', cities: [] },
  { code: 'BS', name: 'Basel-Stadt', countryCode: 'CH', cities: [] },
  { code: 'VD', name: 'Waadt', countryCode: 'CH', cities: [] },
  { code: 'TI', name: 'Tessin', countryCode: 'CH', cities: [] },
  { code: 'SG', name: 'St. Gallen', countryCode: 'CH', cities: [] },
  { code: 'BE', name: 'Bern', countryCode: 'CH', cities: [] },
  { code: 'LU', name: 'Luzern', countryCode: 'CH', cities: [] },
  { code: 'ALL_SWISS', name: 'Ganze Schweiz', countryCode: 'CH', cities: [] },
]

export const cities: City[] = [
  { code: 'ZUG', name: 'Zug', cantonCode: 'ZG', countryCode: 'CH' },
  { code: 'ZURICH', name: 'Zürich', cantonCode: 'ZH', countryCode: 'CH' },
  { code: 'GENEVA', name: 'Genf', cantonCode: 'GE', countryCode: 'CH' },
  { code: 'BASEL', name: 'Basel', cantonCode: 'BS', countryCode: 'CH' },
  { code: 'LAUSANNE', name: 'Lausanne', cantonCode: 'VD', countryCode: 'CH' },
  { code: 'LUGANO', name: 'Lugano', cantonCode: 'TI', countryCode: 'CH' },
  { code: 'ST_GALLEN', name: 'St. Gallen', cantonCode: 'SG', countryCode: 'CH' },
  { code: 'BERN', name: 'Bern', cantonCode: 'BE', countryCode: 'CH' },
  { code: 'LUCERNE', name: 'Luzern', cantonCode: 'LU', countryCode: 'CH' },
]

export function getCantonsByCoutry(countryCode: string) {
  return cantons.filter(c => c.countryCode === countryCode)
}

export function getCitiesByCanton(cantonCode: string) {
  return cities.filter(c => c.cantonCode === cantonCode)
}

export function getCityByCode(cityCode: string) {
  return cities.find(c => c.code === cityCode)
}

export function getCantonByCode(cantonCode: string) {
  return cantons.find(c => c.code === cantonCode)
}
