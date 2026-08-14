import { getArticles } from '@/lib/mdx';
import ArticlesClient from '@/components/ArticlesClient';

export const metadata = {
  title: "Hukuk Notları | Av. Nedim Aslan",
  description: "Mevzuat değişiklikleri, yargı kararları ve güncel hukuki gelişmeler hakkında makaleler.",
};

export default function HukukNotlariPage() {
  const articles = getArticles();
  return <ArticlesClient articles={articles} />;
}
