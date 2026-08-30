"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function YeniMakalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: 'Hukuk Notu',
    excerpt: '',
    image: '/article-gavel.png',
    sources: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Split sources by newline to JSON array if not empty
      const sourcesArray = formData.sources
        ? JSON.stringify(formData.sources.split('\n').map(s => s.trim()).filter(Boolean))
        : null;

      const payload = {
        ...formData,
        sources: sourcesArray
      };

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/admin/makaleler');
      } else {
        const data = await res.json();
        setError(data.error || 'Makale eklenirken bir hata oluştu.');
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
        <Link href="/admin/makaleler" className="text-text-secondary hover:text-navy-primary transition-colors">
          &larr; Geri
        </Link>
        <h1 className="text-3xl font-serif font-bold text-text-primary">Yeni Makale Ekle</h1>
      </div>

      {error && (
        <div className="bg-accent-red/10 border-l-4 border-accent-red p-4 rounded text-accent-red">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-bg-secondary p-6 rounded-xl border border-border-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Başlık</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              placeholder="Örn: Bilişim Suçları Nelerdir?"
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
              placeholder="Örn: bilisim-suclari-nelerdir"
            />
            <p className="text-xs text-text-secondary mt-1">Türkçe karakter ve boşluk kullanmayın.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Kategori</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              placeholder="Örn: Bilişim Hukuku"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Görsel Yolu (URL)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              placeholder="/article-gavel.png"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Özet Metni</label>
          <textarea
            name="excerpt"
            rows={2}
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
            placeholder="Makalenin kısa bir özeti (kartlarda gösterilir)... Boş bırakılırsa içerikten otomatik alınır."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">İçerik (HTML veya Düz Metin)</label>
          <textarea
            name="content"
            required
            rows={15}
            value={formData.content}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all font-mono text-sm"
            placeholder="Makale içeriği..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Yasal Kaynaklar (Her satıra bir kaynak)</label>
          <textarea
            name="sources"
            rows={3}
            value={formData.sources}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
            placeholder="Örn: 5237 Sayılı Türk Ceza Kanunu Madde 243"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-navy-primary hover:bg-navy-secondary disabled:bg-navy-light text-white px-8 py-3 rounded-lg font-bold transition-all"
          >
            {loading ? 'Kaydediliyor...' : 'Makaleyi Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
