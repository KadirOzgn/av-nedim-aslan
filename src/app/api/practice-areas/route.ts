import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const areas = await prisma.practiceArea.findMany({
      orderBy: { iconId: 'asc' },
    });
    return NextResponse.json(areas);
  } catch (error) {
    console.error('Error fetching practice areas:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { iconId, titleTr, titleEn, briefTr, briefEn, descriptionTr, descriptionEn, itemsTr, itemsEn } = body;

    if (!titleTr || !descriptionTr) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const area = await prisma.practiceArea.create({
      data: {
        iconId: parseInt(iconId) || 1,
        titleTr,
        titleEn: titleEn || titleTr,
        briefTr,
        briefEn: briefEn || briefTr,
        descriptionTr,
        descriptionEn: descriptionEn || descriptionTr,
        itemsTr,
        itemsEn,
      },
    });

    return NextResponse.json(area, { status: 201 });
  } catch (error: any) {
    console.error('Error creating practice area:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
