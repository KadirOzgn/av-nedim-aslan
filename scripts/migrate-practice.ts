import { PrismaClient } from '@prisma/client';
import { translations } from '../src/lib/translations';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Migrating Practice Areas...');
  const practiceTr = translations.tr.practice.list;
  const practiceEn = translations.en.practice.list;

  for (let i = 0; i < practiceTr.length; i++) {
    const tr = practiceTr[i];
    const en = practiceEn.find((e: any) => e.id === tr.id) || practiceTr[i];

    const existing = await prisma.practiceArea.findFirst({ where: { iconId: tr.id } });
    if (!existing) {
      await prisma.practiceArea.create({
        data: {
          iconId: tr.id,
          titleTr: tr.title,
          titleEn: en.title,
          briefTr: tr.brief,
          briefEn: en.brief,
          descriptionTr: tr.description,
          descriptionEn: en.description,
          itemsTr: JSON.stringify(tr.items),
          itemsEn: JSON.stringify(en.items),
        }
      });
      console.log(`Migrated ${tr.title}`);
    }
  }
}

migrate().catch(console.error).finally(() => prisma.$disconnect());
