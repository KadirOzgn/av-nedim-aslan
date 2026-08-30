import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();
const articlesDirectory = path.join(process.cwd(), 'content/articles');

async function main() {
  console.log('Starting data migration...');

  // 1. Migrate Articles
  if (fs.existsSync(articlesDirectory)) {
    const fileNames = fs.readdirSync(articlesDirectory);
    const mdFiles = fileNames.filter(f => f.endsWith('.md'));
    
    for (const fileName of mdFiles) {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Create excerpt
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

      // Check if exists
      const existing = await prisma.article.findUnique({ where: { slug } });
      if (!existing) {
        await prisma.article.create({
          data: {
            title: data.title || slug,
            slug,
            content,
            category: data.category || 'Hukuk Notu',
            excerpt,
            image,
            sources: data.sources ? JSON.stringify(data.sources) : null,
            createdAt: data.date ? new Date(data.date) : new Date(),
            updatedAt: data.updateDate ? new Date(data.updateDate) : new Date(),
          }
        });
        console.log(`Migrated article: ${slug}`);
      } else {
        console.log(`Article already exists: ${slug}`);
      }
    }
  }

  // 2. Migrate Tools
  const infazToolSlug = 'infaz-hesaplama';
  const existingTool = await prisma.tool.findUnique({ where: { slug: infazToolSlug } });
  
  if (!existingTool) {
    await prisma.tool.create({
      data: {
        title: 'İnfaz Hesaplama Aracı',
        slug: infazToolSlug,
        description: 'Kesinleşmiş hapis cezasına göre koşullu salıverme, denetimli serbestlik ve bihakkın tahliye tarihlerini hesaplayın.',
        isActive: true
      }
    });
    console.log(`Migrated tool: ${infazToolSlug}`);
  } else {
    console.log(`Tool already exists: ${infazToolSlug}`);
  }

  console.log('Migration complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
