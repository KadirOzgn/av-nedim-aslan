import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting CMS migration...');

  // 1. Migrate Glossary
  const sozlukPath = path.join(process.cwd(), 'src/data/sozluk.json');
  if (fs.existsSync(sozlukPath)) {
    const sozlukData = JSON.parse(fs.readFileSync(sozlukPath, 'utf8'));
    for (const item of sozlukData) {
      await prisma.glossaryTerm.upsert({
        where: { slug: item.slug },
        update: {},
        create: {
          slug: item.slug,
          kavramTr: item.kavram,
          kavramEn: item.kavram,
          harfTr: item.harf,
          harfEn: item.harf,
          tanimTr: item.tanim,
          tanimEn: item.tanim,
          dayanakTr: item.dayanak,
          dayanakEn: item.dayanak,
          kategoriTr: item.kategori,
          kategoriEn: item.kategori,
        }
      });
    }
    console.log('Glossary migrated.');
  }

  // 2. Migrate Practice Areas
  // Use regex to extract from translations since importing ES modules in ts-node commonjs is tricky
  // But wait, ts-node registers as commonjs, so translations should be importable if we compile them or just read them directly.
  // Actually, I can just use node to require it since it's an ES6 export, I can parse it or just use a small separate node script.
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
