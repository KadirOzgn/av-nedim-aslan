import { getArticles } from '@/lib/mdx';
import HomeClient from '@/components/HomeClient';

export default function Home() {
  const articles = getArticles();
  return <HomeClient articles={articles} />;
}
