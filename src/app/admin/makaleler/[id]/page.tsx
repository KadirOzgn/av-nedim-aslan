"use client";

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function EditMakalePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: 'Hukuk Notu',
    excerpt: '',
    image: '/article-gavel.png',
    sources: ''
  });

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/articles/${unwrappedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        
        let sourcesStr = '';
        if (data.sources) {
          try {
            const parsed = JSON.parse(data.sources);
            if (Array.isArray(parsed)) {
              sourcesStr = parsed.join('\n');
            }
          } catch(e) {
            sourcesStr = data.sources;
          }
        }

        setFormData({
          title: data.title,
          slug: data.slug,
          content: data.content,
          category: data.category || 'Hukuk Notu',
          excerpt: data.excerpt || '',
          image: data.image || '/article-gavel.png',
          sources: sourcesStr
        });
      } else {
        setError('Makale bulunamadı.');
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert('Görsel yüklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      alert('Görsel yüklenemedi.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const sourcesArray = formData.sources
        ? JSON.stringify(formData.sources.split('\n').map(s => s.trim()).filter(Boolean))
        : null;

      const payload = {
        ...formData,
        sources: sourcesArray
      };

      const res = await fetch(`/api/articles/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/admin/makaleler');
      } else {
        const data = await res.json();
        setError(data.error || 'Makale güncellenirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4 border-b border-border-primary pb-4">
        <Link href="/admin/makaleler" className="text-text-secondary hover:text-navy-primary transition-colors">
          &larr; Geri
        </Link>
        <h1 className="text-3xl font-serif font-bold text-text-primary">Makaleyi Düzenle</h1>
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
            />
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
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Görsel (Öne Çıkan)</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="flex-grow p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="bg-navy-primary/10 text-navy-primary hover:bg-navy-primary/20 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                {uploadingImage ? 'Yükleniyor...' : 'Görsel Yükle'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
            {formData.image && formData.image !== '/article-gavel.png' && (
              <div className="mt-2 h-20 w-32 relative rounded overflow-hidden border border-border-primary">
                <img src={formData.image} alt="Önizleme" className="object-cover w-full h-full" />
              </div>
            )}
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
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">İçerik (Zengin Metin)</label>
          <div className="border border-border-primary rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-navy-light focus-within:border-navy-light transition-all">
            <RichTextEditor 
              content={formData.content} 
              onChange={(html) => setFormData({ ...formData, content: html })} 
              placeholder="Makale içeriği..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Yasal Kaynaklar (Her satıra bir kaynak)</label>
          <textarea
            name="sources"
            rows={3}
            value={formData.sources}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-navy-primary hover:bg-navy-secondary disabled:bg-navy-light text-white px-8 py-3 rounded-lg font-bold transition-all"
          >
            {saving ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
