import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; const id = parseInt(params.id);
    const area = await prisma.practiceArea.findUnique({
      where: { id },
    });

    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    return NextResponse.json(area);
  } catch (error) {
    console.error('Error fetching practice area:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; const id = parseInt(params.id);
    const body = await request.json();
    const { iconId, titleTr, titleEn, briefTr, briefEn, descriptionTr, descriptionEn, itemsTr, itemsEn } = body;

    const area = await prisma.practiceArea.update({
      where: { id },
      data: { 
        iconId: parseInt(iconId), 
        titleTr, titleEn, briefTr, briefEn, descriptionTr, descriptionEn, itemsTr, itemsEn 
      },
    });

    return NextResponse.json(area);
  } catch (error: any) {
    console.error('Error updating practice area:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; const id = parseInt(params.id);
    await prisma.practiceArea.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting practice area:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
