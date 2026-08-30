import ArticlesClient from '@/components/ArticlesClient';
import prisma from '@/lib/prisma';

export const metadata = {
  title: "Hukuk Notları | Av. Nedim Aslan",
  description: "Mevzuat değişiklikleri, yargı kararları ve güncel hukuki gelişmeler hakkında makaleler.",
};

export default async function HukukNotlariPage() {
  const dbArticles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const articles = dbArticles.map((a) => {
    let parsedSources = [];
    if (a.sources) {
      try { parsedSources = JSON.parse(a.sources); } catch(e) {}
    }

    return {
      slug: a.slug,
      title: a.title,
      date: a.createdAt.toISOString(),
      updateDate: a.updatedAt.toISOString(),
      category: a.category,
      sources: Array.isArray(parsedSources) ? parsedSources : [],
      excerpt: a.excerpt || a.content.substring(0, 150) + '...',
      image: a.image || '/article-gavel.png',
    };
  });

  return <ArticlesClient articles={articles} />;
}
