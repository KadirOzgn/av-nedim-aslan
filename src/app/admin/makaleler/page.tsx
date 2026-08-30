"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MakalelerPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Failed to fetch articles', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu makaleyi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        alert('Silme işlemi başarısız oldu.');
      }
    } catch (error) {
      console.error('Failed to delete article', error);
      alert('Silme işlemi sırasında hata oluştu.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border-primary pb-4">
        <h1 className="text-3xl font-serif font-bold text-text-primary">Makale Yönetimi</h1>
        <Link 
          href="/admin/makaleler/yeni"
          className="bg-navy-primary hover:bg-navy-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Yeni Makale Ekle
        </Link>
      </div>

      {loading ? (
        <div className="text-text-secondary text-center py-12">Yükleniyor...</div>
      ) : articles.length === 0 ? (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
          <p className="text-text-secondary mb-4">Henüz hiç makale eklenmemiş.</p>
          <Link href="/admin/makaleler/yeni" className="text-accent-blue hover:underline">
            İlk makalenizi oluşturun
          </Link>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-primary border-b border-border-primary">
                <th className="p-4 font-semibold text-text-primary">Başlık</th>
                <th className="p-4 font-semibold text-text-primary hidden sm:table-cell">URL (Slug)</th>
                <th className="p-4 font-semibold text-text-primary hidden md:table-cell">Tarih</th>
                <th className="p-4 font-semibold text-text-primary text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border-primary last:border-b-0 hover:bg-bg-primary/50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-text-primary truncate max-w-[200px] sm:max-w-[300px]">
                      {article.title}
                    </p>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-text-secondary text-sm">
                    /{article.slug}
                  </td>
                  <td className="p-4 hidden md:table-cell text-text-secondary text-sm">
                    {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link 
                      href={`/admin/makaleler/${article.id}`}
                      className="text-accent-blue hover:underline text-sm font-medium"
                    >
                      Düzenle
                    </Link>
                    <span className="text-border-strong">|</span>
                    <button 
                      onClick={() => handleDelete(article.id)}
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
