import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; const id = parseInt(params.id);
    const tool = await prisma.tool.findUnique({
      where: { id },
    });

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json(tool);
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; const id = parseInt(params.id);
    const { title, description, content, slug, isActive, versionInfo } = await request.json();

    const tool = await prisma.tool.update({
      where: { id },
      data: { title, description, content, slug, isActive, versionInfo },
    });

    return NextResponse.json(tool);
  } catch (error: any) {
    console.error('Error updating tool:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
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
    await prisma.tool.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting tool:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
