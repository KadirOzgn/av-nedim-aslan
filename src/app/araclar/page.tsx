import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Hukuki Araçlar | Aslan Hukuk Bürosu',
  description: 'Hukuki hesaplama ve danışmanlık araçları',
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-text-primary mb-8 border-b border-border-primary pb-4">
        Hukuki Araçlar
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-bg-secondary p-6 rounded-xl border border-border-primary shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-serif font-bold text-text-primary mb-3">
            İnfaz Hesaplama Aracı
          </h2>
          <p className="text-text-secondary mb-6 text-sm">
            Kesinleşmiş hapis cezasına göre koşullu salıverme, denetimli serbestlik ve bihakkın tahliye tarihlerini hesaplayın.
          </p>
          <Link
            href="/araclar/infaz-hesaplama"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-blue hover:bg-accent-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue transition-colors"
          >
            Aracı Kullan
          </Link>
        </div>
        {/* Daha fazla araç veritabanından çekilip buraya eklenebilir */}
      </div>
    </div>
  );
}
