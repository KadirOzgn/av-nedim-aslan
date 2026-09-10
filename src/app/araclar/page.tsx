import React from 'react';
import prisma from '@/lib/prisma';
import ToolsClient from '@/components/ToolsClient';

export const metadata = {
  title: 'Hukuki Araçlar | Aslan Hukuk Bürosu',
  description: 'Hukuki hesaplama ve danışmanlık araçları',
};

export default async function ToolsPage() {
  const tools = await prisma.tool.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return <ToolsClient tools={tools} />;
}
