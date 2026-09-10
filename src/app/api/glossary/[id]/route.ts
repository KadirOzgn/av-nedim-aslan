import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; const id = parseInt(params.id);
    const term = await prisma.glossaryTerm.findUnique({
      where: { id },
    });

    if (!term) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }

    return NextResponse.json(term);
  } catch (error) {
    console.error('Error fetching glossary term:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; const id = parseInt(params.id);
    const body = await request.json();
    const { slug, kavramTr, kavramEn, harfTr, harfEn, tanimTr, tanimEn, dayanakTr, dayanakEn, kategoriTr, kategoriEn } = body;

    const term = await prisma.glossaryTerm.update({
      where: { id },
      data: { slug, kavramTr, kavramEn, harfTr, harfEn, tanimTr, tanimEn, dayanakTr, dayanakEn, kategoriTr, kategoriEn },
    });

    return NextResponse.json(term);
  } catch (error: any) {
    console.error('Error updating glossary term:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL uzantısı (slug) zaten kullanımda.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; const id = parseInt(params.id);
    await prisma.glossaryTerm.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting glossary term:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
