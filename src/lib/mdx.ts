import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface ArticleMetadata {
  slug: string;
  title: string;
  date: string;
  updateDate: string;
  category: string;
  sources: string[];
  excerpt: string;
  image: string;
}

export interface ArticleData {
  metadata: ArticleMetadata;
  content: string;
}

export function getArticles(): ArticleMetadata[] {
  // Check if directory exists, if not return empty array
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Create excerpt from content
      const excerpt = content
        .replace(/[#*`_[\]]/g, '') // remove markdown syntax characters
        .substring(0, 150)
        .trim() + '...';

      // Set fallback images based on slug
      let image = '/article-gavel.png';
      if (slug.includes('custody') || slug.includes('velayet')) {
        image = '/article-custody.png';
      } else if (slug.includes('kvkk')) {
        image = '/article-kvkk.png';
      }

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        updateDate: data.updateDate || '',
        category: data.category || '',
        sources: data.sources || [],
        excerpt,
        image,
      };
    });

  // Sort articles by date descending
  return allArticlesData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): ArticleData | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Create excerpt from content
    const excerpt = content
      .replace(/[#*`_[\]]/g, '')
      .substring(0, 150)
      .trim() + '...';

    let image = '/article-gavel.png';
    if (slug.includes('custody') || slug.includes('velayet')) {
      image = '/article-custody.png';
    } else if (slug.includes('kvkk')) {
      image = '/article-kvkk.png';
    }

    const metadata: ArticleMetadata = {
      slug,
      title: data.title || '',
      date: data.date || '',
      updateDate: data.updateDate || '',
      category: data.category || '',
      sources: data.sources || [],
      excerpt,
      image,
    };

    return {
      metadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading article by slug ${slug}:`, error);
    return null;
  }
}
