"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AraclarPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools');
      if (res.ok) {
        const data = await res.json();
        setTools(data);
      }
    } catch (error) {
      console.error('Failed to fetch tools', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu aracı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTools(tools.filter(t => t.id !== id));
      } else {
        alert('Silme işlemi başarısız oldu.');
      }
    } catch (error) {
      console.error('Failed to delete tool', error);
      alert('Silme işlemi sırasında hata oluştu.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border-primary pb-4">
        <h1 className="text-3xl font-serif font-bold text-text-primary">Araç Yönetimi</h1>
        <Link 
          href="/admin/araclar/yeni"
          className="bg-navy-primary hover:bg-navy-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Yeni Araç Ekle
        </Link>
      </div>

      {loading ? (
        <div className="text-text-secondary text-center py-12">Yükleniyor...</div>
      ) : tools.length === 0 ? (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
          <p className="text-text-secondary mb-4">Henüz hiç araç eklenmemiş.</p>
          <Link href="/admin/araclar/yeni" className="text-accent-blue hover:underline">
            İlk aracı tanımlayın
          </Link>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-primary border-b border-border-primary">
                <th className="p-4 font-semibold text-text-primary">Araç Adı</th>
                <th className="p-4 font-semibold text-text-primary hidden sm:table-cell">URL (Slug)</th>
                <th className="p-4 font-semibold text-text-primary text-center">Durum</th>
                <th className="p-4 font-semibold text-text-primary text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id} className="border-b border-border-primary last:border-b-0 hover:bg-bg-primary/50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-text-primary truncate max-w-[200px] sm:max-w-[300px]">
                      {tool.title}
                    </p>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-text-secondary text-sm">
                    /{tool.slug}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tool.isActive ? 'bg-accent-blue/10 text-accent-blue' : 'bg-border-primary text-text-secondary'}`}>
                      {tool.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link 
                      href={`/admin/araclar/${tool.id}`}
                      className="text-accent-blue hover:underline text-sm font-medium"
                    >
                      Düzenle
                    </Link>
                    <span className="text-border-strong">|</span>
                    <button 
                      onClick={() => handleDelete(tool.id)}
                      className="text-accent-red hover:underline text-sm font-medium"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
