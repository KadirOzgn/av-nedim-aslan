import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, slug, category, excerpt, image, sources } = body;

    if (!title || !content || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        slug,
        category: category || 'Hukuk Notu',
        excerpt: excerpt || null,
        image: image || '/article-gavel.png',
        sources: sources || null,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error('Error creating article:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL uzantısı (slug) zaten kullanımda.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
