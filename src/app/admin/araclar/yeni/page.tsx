"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function YeniAracPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    versionInfo: '',
    isActive: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/admin/araclar');
      } else {
        const data = await res.json();
        setError(data.error || 'Araç eklenirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4 border-b border-border-primary pb-4">
        <Link href="/admin/araclar" className="text-text-secondary hover:text-navy-primary transition-colors">
          &larr; Geri
        </Link>
        <h1 className="text-3xl font-serif font-bold text-text-primary">Yeni Araç Ekle</h1>
      </div>

      {error && (
        <div className="bg-accent-red/10 border-l-4 border-accent-red p-4 rounded text-accent-red">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-bg-secondary p-6 rounded-xl border border-border-primary">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Araç Adı</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
            placeholder="Örn: İnfaz Hesaplama"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">URL Uzantısı (Slug)</label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
            placeholder="Örn: infaz-hesaplama"
          />
          <p className="text-xs text-text-secondary mt-1">Sitede görüneceği link uzantısıdır. Türkçe karakter kullanmayın.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Açıklama (Opsiyonel - Kısa Özet)</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
            placeholder="Bu araç ne işe yarar? Kısa bir açıklama..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Versiyon / Güncelleme Notu (Opsiyonel)</label>
          <input
            type="text"
            name="versionInfo"
            value={formData.versionInfo}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
            placeholder="Örn: 18 Ağustos 2026 Mevzuatı"
          />
          <p className="text-xs text-text-secondary mt-1">Eğer araç içinde bir sürüm veya tarih gösteriliyorsa bunu değiştirmek için kullanabilirsiniz.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">İçerik / Kullanım Rehberi (Opsiyonel)</label>
          <div className="border border-border-primary rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-navy-light focus-within:border-navy-light transition-all">
            <RichTextEditor 
              content={formData.content} 
              onChange={(html) => setFormData({ ...formData, content: html })} 
              placeholder="Araç hakkında detaylı rehber veya içerik..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 accent-navy-primary cursor-pointer"
          />
          <label htmlFor="isActive" className="text-sm font-semibold text-text-primary cursor-pointer">
            Sitede Aktif (Yayınla)
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-navy-primary hover:bg-navy-secondary disabled:bg-navy-light text-white px-8 py-3 rounded-lg font-bold transition-all"
          >
            {loading ? 'Kaydediliyor...' : 'Aracı Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
