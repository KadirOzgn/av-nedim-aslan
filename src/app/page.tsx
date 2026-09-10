import prisma from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const practiceAreas = await prisma.practiceArea.findMany({
    orderBy: { iconId: 'asc' },
  });

  return <HomeClient articles={articles} practiceAreas={practiceAreas} />;
}
