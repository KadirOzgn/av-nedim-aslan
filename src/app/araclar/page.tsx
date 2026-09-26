import React, { Suspense } from 'react';
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

  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary pt-24 pb-16 flex items-center justify-center">Yükleniyor...</div>}>
      <ToolsClient tools={tools} />
    </Suspense>
  );
}
