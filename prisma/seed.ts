// SOLAR Platform — Seed Script
// Migrates data from TS modules to database

import { PrismaClient, ProviderType, PriceUnit } from '@prisma/client'
import { notaries } from '../lib/data/notaries'
import { legalAddresses } from '../lib/data/addresses'
import { nomineeDirectors } from '../lib/data/directors'
import { accountingPartners } from '../lib/data/accounting'
import { qesProviders } from '../lib/data/qes'

const prisma = new PrismaClient()

async function seedProviders() {
  console.log('🌱 Seeding providers...')

  // Clear existing data (careful in production!)
  await prisma.providerOffer.deleteMany()
  await prisma.provider.deleteMany()

  // Seed Notaries
  console.log('  📜 Seeding notaries...')
  for (const notary of notaries) {
    const provider = await prisma.provider.create({
      data: {
        slug: notary.id,
        name: notary.name,
        type: 'NOTARY',
        email: notary.email,
        phone: notary.phone,
        website: notary.website,
        isActive: true,
        isPrimary: false,
        offers: {
          create: {
            cantons: notary.cantonCode === 'ALL_SWISS' ? ['ALL_SWISS'] : [notary.cantonCode],
            cities: notary.cityCodes,
            isNationwide: notary.isMultiRegion,
            supportsGmbh: notary.supportsGmbh,
            supportsAg: notary.supportsAg,
            digitalQes: notary.digitalQes,
            upregAccess: notary.upregAccess,
            priceGmbh: notary.priceGmbh,
            priceAg: notary.priceAg,
            priceUnit: 'ONE_TIME',
          },
        },
      },
    })
    console.log(`    ✓ ${provider.name}`)
  }

  // Seed Addresses
  console.log('  🏢 Seeding addresses...')
  for (const address of legalAddresses) {
    const provider = await prisma.provider.create({
      data: {
        slug: address.id,
        name: address.companyName,
        type: 'ADDRESS',
        email: address.email,
        website: address.website,
        isActive: true,
        isPrimary: false,
        offers: {
          create: {
            cantons: address.cantonCode === 'ALL_SWISS' ? ['ALL_SWISS'] : [address.cantonCode],
            cities: address.cityCodes,
            isNationwide: address.isMultiRegion,
            supportsGmbh: true,
            supportsAg: true,
            mailForward: address.mailForwarding,
            phoneService: address.phoneService,
            meetingRoom: address.meetingRoom,
            priceGmbh: address.pricePerYear,
            priceAg: address.pricePerYear,
            priceUnit: 'PER_YEAR',
          },
        },
      },
    })
    console.log(`    ✓ ${provider.name}`)
  }

  // Seed Directors
  console.log('  👔 Seeding directors...')
  for (const director of nomineeDirectors) {
    const provider = await prisma.provider.create({
      data: {
        slug: director.id,
        name: director.name,
        companyName: director.companyName,
        type: 'DIRECTOR',
        email: director.email,
        website: director.website,
        isActive: true,
        isPrimary: false,
        offers: {
          create: {
            cantons: director.cantonCodes,
            cities: director.cityCodes,
            isNationwide: director.isMultiRegion,
            supportsGmbh: director.supportsGmbh,
            supportsAg: director.supportsAg,
            priceGmbh: director.pricePerYear,
            priceAg: director.pricePerYearAg || director.pricePerYear,
            priceUnit: 'PER_YEAR',
          },
        },
      },
    })
    console.log(`    ✓ ${provider.name}`)
  }

  // Seed Accounting Partners
  console.log('  📊 Seeding accounting partners...')
  for (const partner of accountingPartners) {
    const provider = await prisma.provider.create({
      data: {
        slug: partner.id,
        name: partner.companyName,
        type: 'ACCOUNTING',
        email: partner.email,
        website: partner.website,
        isActive: true,
        isPrimary: partner.isPrimary,
        offers: {
          create: {
            cantons: partner.cantonCodes,
            cities: partner.cityCodes,
            isNationwide: partner.isMultiRegion,
            supportsGmbh: true,
            supportsAg: true,
            vatServices: partner.vatServices,
            payroll: partner.payrollServices,
            audit: partner.auditServices,
            intlTrade: partner.internationalTrade,
            priceGmbh: partner.pricePerYear,
            priceAg: partner.pricePerYear,
            priceUnit: 'PER_YEAR',
          },
        },
      },
    })
    console.log(`    ✓ ${provider.name}`)
  }

  // Seed QES Providers
  console.log('  ✍️ Seeding QES providers...')
  for (const qes of qesProviders) {
    const provider = await prisma.provider.create({
      data: {
        slug: qes.id,
        name: qes.name,
        type: 'QES',
        website: qes.website,
        isActive: true,
        isPrimary: false,
        offers: {
          create: {
            cantons: ['ALL_SWISS'],
            cities: [],
            isNationwide: true,
            supportsGmbh: true,
            supportsAg: true,
            upregAccess: qes.upregAccess,
            priceGmbh: qes.pricePerSignature,
            priceAg: qes.pricePerSignature,
            priceUnit: 'PER_SIGNATURE',
          },
        },
      },
    })
    console.log(`    ✓ ${provider.name}`)
  }

  const counts = await prisma.provider.groupBy({
    by: ['type'],
    _count: true,
  })

  console.log('\n📊 Summary:')
  for (const count of counts) {
    console.log(`  ${count.type}: ${count._count}`)
  }
}

async function seedDemoData() {
  console.log('\n🎭 Seeding demo data...')

  // Create demo admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@solar.ch' },
    update: {},
    create: {
      email: 'admin@solar.ch',
      name: 'SOLAR Admin',
      systemRole: 'SOLAR_ADMIN',
    },
  })
  console.log(`  ✓ Admin user: ${adminUser.email}`)

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'techstart' },
    update: {},
    create: {
      slug: 'techstart',
      name: 'TechStart GmbH',
      legalName: 'TechStart GmbH',
      email: 'info@techstart.ch',
      phone: '+41 41 123 45 67',
      street: 'Bahnhofstrasse 10',
      city: 'Zug',
      postalCode: '6300',
      canton: 'ZG',
      status: 'ACTIVE',
    },
  })
  console.log(`  ✓ Tenant: ${tenant.name}`)

  // Create demo client user
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@techstart.ch' },
    update: {},
    create: {
      email: 'client@techstart.ch',
      name: 'Max Muster',
      systemRole: 'USER',
    },
  })
  console.log(`  ✓ Client user: ${clientUser.email}`)

  // Create membership
  await prisma.membership.upsert({
    where: {
      userId_tenantId: {
        userId: clientUser.id,
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      userId: clientUser.id,
      tenantId: tenant.id,
      role: 'OWNER',
    },
  })
  console.log(`  ✓ Membership created`)

  // Create demo case
  const demoCase = await prisma.case.upsert({
    where: { caseNumber: 'SOLAR-2024-0001' },
    update: {},
    create: {
      caseNumber: 'SOLAR-2024-0001',
      tenantId: tenant.id,
      companyType: 'GMBH',
      companyName: 'TechStart GmbH',
      purpose: 'Software development and consulting',
      canton: 'ZG',
      city: 'Zug',
      shareCapital: 20000,
      status: 'PROVIDERS_SELECTING',
      createdById: adminUser.id,
    },
  })
  console.log(`  ✓ Case: ${demoCase.caseNumber}`)

  // Create case steps
  const stepTypes = [
    'KYC_COLLECT',
    'KYC_REVIEW',
    'KYC_APPROVE',
    'SELECT_NOTARY',
    'SELECT_ADDRESS',
    'SELECT_DIRECTOR',
    'SELECT_ACCOUNTING',
    'PREPARE_DOCUMENTS',
    'NOTARY_APPOINTMENT',
    'SIGN_DOCUMENTS',
    'SUBMIT_REGISTRY',
    'RECEIVE_UID',
  ] as const

  for (let i = 0; i < stepTypes.length; i++) {
    const stepType = stepTypes[i]
    const status = i < 3 ? 'DONE' : i === 3 ? 'IN_PROGRESS' : 'TODO'
    
    await prisma.caseStep.upsert({
      where: {
        caseId_stepType: {
          caseId: demoCase.id,
          stepType,
        },
      },
      update: { status },
      create: {
        caseId: demoCase.id,
        stepType,
        order: i + 1,
        status,
        completedAt: status === 'DONE' ? new Date() : null,
      },
    })
  }
  console.log(`  ✓ Case steps created`)

  console.log('\n✅ Demo data seeded successfully!')
}

async function main() {
  console.log('🚀 SOLAR Platform Seed Script\n')

  try {
    await seedProviders()
    await seedDemoData()
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
