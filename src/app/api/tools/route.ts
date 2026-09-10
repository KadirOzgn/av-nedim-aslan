import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, content, slug, isActive, versionInfo } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tool = await prisma.tool.create({
      data: {
        title,
        description,
        content,
        slug,
        isActive: isActive !== undefined ? isActive : true,
        versionInfo,
      },
    });

    return NextResponse.json(tool, { status: 201 });
  } catch (error: any) {
    console.error('Error creating tool:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL uzantısı (slug) zaten kullanımda.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
