// SOLAR Platform — QES Providers Data

import { QesProvider } from '../types'

export const qesProviders: QesProvider[] = [
  {
    id: 'skribble',
    name: 'Skribble',
    countryCode: 'CH',
    upregAccess: true,
    pricePerSignature: 2.5,
    features: ['QES', 'AES', 'SES', 'API', 'Handelsregister-Integration'],
    website: 'https://skribble.com',
  },
  {
    id: 'deepsign',
    name: 'DeepSign',
    countryCode: 'CH',
    upregAccess: true,
    pricePerSignature: 1.9,
    features: ['QES', 'AES', 'SES', 'API', 'Handelsregister-Integration', 'Swiss Made'],
    website: 'https://deepsign.swiss',
  },
  {
    id: 'esignr',
    name: 'eSignR',
    countryCode: 'CH',
    upregAccess: false,
    pricePerSignature: 1.5,
    features: ['QES', 'AES', 'SES', 'API'],
    website: 'https://esignr.ch',
  },
  {
    id: '360-signatures',
    name: '360 Signatures',
    countryCode: 'CH',
    upregAccess: true,
    pricePerSignature: 2.0,
    features: ['QES', 'AES', 'SES', 'Handelsregister-Integration'],
    website: 'https://360signatures.com',
  },
  {
    id: 'swisscom-sign',
    name: 'Swisscom Sign',
    countryCode: 'CH',
    upregAccess: true,
    pricePerSignature: 3.0,
    features: ['QES', 'AES', 'SES', 'API', 'Handelsregister-Integration', 'Enterprise'],
    website: 'https://trustservices.swisscom.com',
  },
]

export default qesProviders
