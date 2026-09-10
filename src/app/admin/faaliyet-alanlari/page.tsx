import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Faaliyet Alanları Yönetimi | Aslan Hukuk Admin',
};

export default async function AdminPracticeAreasPage() {
  const areas = await prisma.practiceArea.findMany({
    orderBy: { iconId: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-primary pb-4">
        <h1 className="text-3xl font-serif font-bold text-text-primary">Faaliyet Alanları Yönetimi</h1>
        <Link 
          href="/admin/faaliyet-alanlari/yeni" 
          className="flex items-center gap-2 bg-navy-primary hover:bg-navy-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Yeni Alan Ekle
        </Link>
      </div>

      <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-primary border-b border-border-primary text-text-secondary text-sm">
                <th className="p-4 font-semibold w-16">İkon ID</th>
                <th className="p-4 font-semibold">Başlık (TR/EN)</th>
                <th className="p-4 font-semibold hidden md:table-cell">Kısa Açıklama</th>
                <th className="p-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {areas.map((area) => (
                <tr key={area.id} className="hover:bg-bg-primary/50 transition-colors">
                  <td className="p-4 text-center font-bold text-text-secondary">{area.iconId}</td>
                  <td className="p-4">
                    <div className="font-bold text-text-primary">{area.titleTr}</div>
                    <div className="text-xs text-text-muted mt-1">{area.titleEn}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-text-secondary max-w-xs truncate">
                    {area.briefTr}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/faaliyet-alanlari/${area.id}`}
                        className="p-2 text-text-secondary hover:text-navy-primary hover:bg-navy-primary/10 rounded transition-colors"
                        title="Düzenle"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteAreaButton id={area.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary">
                    Henüz faaliyet alanı eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import DeleteAreaButton from './DeleteAreaButton';
