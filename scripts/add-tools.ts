import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tools = [
    {
      title: 'Yasal Faiz Hesaplama',
      slug: 'faiz-hesaplama',
      description: 'Kanuni, ticari ve temerrüt faizlerini güncel oranlarla hesaplayın.',
      isActive: true,
    },
    {
      title: 'Dava Süre Hesaplama',
      slug: 'sure-hesaplama',
      description: 'Hukuk, ceza ve idari davalardaki itiraz ve temyiz sürelerini hesaplayın.',
      isActive: true,
    },
    {
      title: 'Miras Payı Hesaplama',
      slug: 'miras-hesaplama',
      description: 'Yasal mirasçıların miras paylarını hesaplayın.',
      isActive: true,
    },
    {
      title: 'Harç Hesaplama',
      slug: 'harc-hesaplama',
      description: 'Dava ve icra harçlarını güncel tarifeler üzerinden hesaplayın.',
      isActive: true,
    },
    {
      title: 'İşçilik Alacakları Hesaplama',
      slug: 'iscilik-hesaplama',
      description: 'Kıdem, ihbar, fazla mesai ve diğer işçilik alacaklarını hesaplayın.',
      isActive: true,
    }
  ]

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: tool,
    })
  }
  console.log('Araçlar başarıyla eklendi!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
