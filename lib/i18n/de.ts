// SOLAR Platform — German Locale (DE-first)
// Все строки интерфейса на немецком

export const de = {
  // Navigation
  nav: {
    home: 'Startseite',
    notaries: 'Notare',
    addresses: 'Adressen',
    directors: 'Direktoren',
    accounting: 'Buchhaltung',
    calculator: 'Kostenrechner',
    qes: 'QES-Anbieter',
  },

  // Filters
  filters: {
    title: 'Filter',
    country: 'Land',
    canton: 'Kanton',
    city: 'Stadt',
    companyType: 'Gesellschaftsform',
    digitalOnly: 'Nur Digital',
    allCountries: 'Alle Länder',
    allCantons: 'Alle Kantone',
    allCities: 'Alle Städte',
    reset: 'Zurücksetzen',
    apply: 'Anwenden',
  },

  // Company Types
  companyTypes: {
    GMBH: 'GmbH',
    AG: 'AG',
    BOTH: 'GmbH & AG',
  },

  // Countries
  countries: {
    CH: 'Schweiz',
    DE: 'Deutschland',
    AT: 'Österreich',
    EE: 'Estland',
    US: 'USA',
  },

  // Cantons (Swiss)
  cantons: {
    ZG: 'Zug',
    ZH: 'Zürich',
    GE: 'Genf',
    BS: 'Basel-Stadt',
    VD: 'Waadt',
    TI: 'Tessin',
    SG: 'St. Gallen',
    BE: 'Bern',
    LU: 'Luzern',
    AG: 'Aargau',
    SZ: 'Schwyz',
    NW: 'Nidwalden',
    OW: 'Obwalden',
    ALL_SWISS: 'Ganze Schweiz',
  },

  // Cities
  cities: {
    ZUG: 'Zug',
    ZURICH: 'Zürich',
    GENEVA: 'Genf',
    BASEL: 'Basel',
    LAUSANNE: 'Lausanne',
    LUGANO: 'Lugano',
    ST_GALLEN: 'St. Gallen',
    BERN: 'Bern',
    LUCERNE: 'Luzern',
  },

  // Notaries
  notaries: {
    title: 'Notare',
    subtitle: 'Notarielle Dienstleistungen für Firmengründung',
    columns: {
      name: 'Name',
      type: 'Typ',
      canton: 'Kanton',
      city: 'Stadt',
      qes: 'QES',
      upreg: 'UR-Zugang',
      price: 'Preis',
      website: 'Website',
      contact: 'Kontakt',
    },
    types: {
      ONLINE: 'Online-Plattform',
      PRIVATE: 'Privatnotar',
      MUNICIPAL: 'Amtsnotar',
    },
    empty: 'Keine Notare für diese Filter gefunden.',
  },

  // Legal Addresses
  addresses: {
    title: 'Geschäftsadressen',
    subtitle: 'Domizil und virtuelle Bürodienstleistungen',
    columns: {
      company: 'Anbieter',
      city: 'Stadt',
      type: 'Typ',
      mailForward: 'Postweiterleitung',
      phoneService: 'Telefonservice',
      meetingRoom: 'Sitzungsraum',
      priceYear: 'Preis/Jahr',
      website: 'Website',
    },
    types: {
      CO: 'c/o Adresse',
      VIRTUAL: 'Virtuelles Büro',
      FULL: 'Vollservice',
    },
    empty: 'Keine Adressen für diese Filter gefunden.',
  },

  // Nominee Directors
  directors: {
    title: 'Direktoren',
    subtitle: 'Nominee- und Treuhand-Direktoren',
    columns: {
      name: 'Name',
      type: 'Typ',
      cities: 'Städte',
      gmbh: 'GmbH',
      ag: 'AG',
      priceYear: 'Preis/Jahr',
      website: 'Website',
    },
    types: {
      NOMINEE: 'Nominee',
      FIDUCIARY: 'Treuhänder',
      ACTIVE: 'Aktiv',
    },
    empty: 'Keine Direktoren für diese Filter gefunden.',
  },

  // Accounting Partners
  accounting: {
    title: 'Buchhaltung',
    subtitle: 'Treuhand- und Buchhaltungspartner',
    columns: {
      company: 'Unternehmen',
      cities: 'Städte',
      vat: 'MWST',
      payroll: 'Lohn',
      audit: 'Revision',
      intlTrade: 'Int. Handel',
      priceYear: 'Ab Preis/Jahr',
      website: 'Website',
    },
    badges: {
      primary: 'Unser Partner',
    },
    empty: 'Keine Buchhaltungspartner für diese Filter gefunden.',
  },

  // Cost Calculator
  calculator: {
    title: 'Kostenrechner',
    subtitle: 'Geschätzte Kosten für Firmengründung',
    selectCity: 'Stadt auswählen',
    selectCompanyType: 'Gesellschaftsform wählen',
    categories: {
      notary: 'Notar',
      registry: 'Handelsregister',
      address: 'Geschäftsadresse',
      director: 'Direktor',
      accounting: 'Buchhaltung',
    },
    totals: {
      firstYear: 'Erstes Jahr (Total)',
      recurring: 'Ab 2. Jahr (jährlich)',
      oneTime: 'Einmalige Kosten',
    },
    perYear: '/Jahr',
    currency: 'CHF',
    disclaimer: 'Alle Preise sind Richtwerte und können je nach Anbieter variieren.',
  },

  // QES Providers
  qes: {
    title: 'QES-Anbieter',
    subtitle: 'Qualifizierte Elektronische Signatur',
    columns: {
      name: 'Anbieter',
      urAccess: 'UR-Zugang',
      priceSignature: 'Preis/Signatur',
      features: 'Funktionen',
      website: 'Website',
    },
  },

  // Common
  common: {
    yes: 'Ja',
    no: 'Nein',
    loading: 'Laden...',
    error: 'Fehler',
    noResults: 'Keine Ergebnisse',
    showMore: 'Mehr anzeigen',
    showLess: 'Weniger anzeigen',
    copyLink: 'Link kopieren',
    linkCopied: 'Link kopiert!',
    from: 'ab',
    included: 'inkl.',
    optional: 'optional',
    recommended: 'empfohlen',
  },

  // Footer
  footer: {
    poweredBy: 'Powered by SOLAR Platform',
    version: 'Version',
  },
} as const

export type Locale = typeof de
export default de
