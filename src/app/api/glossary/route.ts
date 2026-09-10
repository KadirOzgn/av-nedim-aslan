import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const terms = await prisma.glossaryTerm.findMany({
      orderBy: { kavramTr: 'asc' },
    });
    return NextResponse.json(terms);
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, kavramTr, kavramEn, harfTr, harfEn, tanimTr, tanimEn, dayanakTr, dayanakEn, kategoriTr, kategoriEn } = body;

    if (!slug || !kavramTr) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const term = await prisma.glossaryTerm.create({
      data: {
        slug,
        kavramTr,
        kavramEn: kavramEn || kavramTr,
        harfTr: harfTr || kavramTr.charAt(0).toUpperCase(),
        harfEn: harfEn || (kavramEn ? kavramEn.charAt(0).toUpperCase() : kavramTr.charAt(0).toUpperCase()),
        tanimTr,
        tanimEn: tanimEn || tanimTr,
        dayanakTr,
        dayanakEn,
        kategoriTr,
        kategoriEn,
      },
    });

    return NextResponse.json(term, { status: 201 });
  } catch (error: any) {
    console.error('Error creating glossary term:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL uzantısı (slug) zaten kullanımda.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
