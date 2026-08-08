import { getArticles } from '@/lib/mdx';
import ArticlesClient from '@/components/ArticlesClient';

export default function ArticlesPage() {
  const articles = getArticles();
  return <ArticlesClient articles={articles} />;
}
