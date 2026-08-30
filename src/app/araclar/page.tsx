import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-text-primary mb-8 border-b border-border-primary pb-4">
        Hukuki Araçlar
      </h1>

      {tools.length === 0 ? (
        <p className="text-text-secondary text-sm">Henüz aktif bir araç bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-bg-secondary p-6 rounded-xl border border-border-primary shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-serif font-bold text-text-primary mb-3">
                {tool.title}
              </h2>
              <p className="text-text-secondary mb-6 text-sm">
                {tool.description}
              </p>
              <Link
                href={`/araclar/${tool.slug}`}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-blue hover:bg-accent-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue transition-colors"
              >
                Aracı Kullan
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
