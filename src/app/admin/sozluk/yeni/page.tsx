"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTermPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    slug: '',
    kavramTr: '',
    kavramEn: '',
    harfTr: '',
    harfEn: '',
    tanimTr: '',
    tanimEn: '',
    dayanakTr: '',
    dayanakEn: '',
    kategoriTr: '',
    kategoriEn: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/glossary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/admin/sozluk');
      } else {
        const data = await res.json();
        setError(data.error || 'Terim eklenirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4 border-b border-border-primary pb-4">
        <Link href="/admin/sozluk" className="text-text-secondary hover:text-navy-primary transition-colors">
          &larr; Geri
        </Link>
        <h1 className="text-3xl font-serif font-bold text-text-primary">Yeni Terim Ekle</h1>
      </div>

      {error && (
        <div className="bg-accent-red/10 border-l-4 border-accent-red p-4 rounded text-accent-red">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-bg-secondary p-6 rounded-xl border border-border-primary">
        
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">URL Uzantısı (Slug) *</label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
            placeholder="ornek-terim"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 border-r border-border-primary pr-4">
            <h2 className="text-xl font-serif font-bold text-navy-primary">Türkçe (TR)</h2>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Kavram *</label>
              <input
                type="text"
                name="kavramTr"
                required
                value={formData.kavramTr}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Harf</label>
              <input
                type="text"
                name="harfTr"
                value={formData.harfTr}
                onChange={handleChange}
                maxLength={1}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Tanım *</label>
              <textarea
                name="tanimTr"
                required
                rows={4}
                value={formData.tanimTr}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Dayanak</label>
              <input
                type="text"
                name="dayanakTr"
                value={formData.dayanakTr}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Kategori</label>
              <input
                type="text"
                name="kategoriTr"
                value={formData.kategoriTr}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 pl-4">
            <h2 className="text-xl font-serif font-bold text-navy-primary">İngilizce (EN)</h2>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Kavram (Term)</label>
              <input
                type="text"
                name="kavramEn"
                value={formData.kavramEn}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Harf (Letter)</label>
              <input
                type="text"
                name="harfEn"
                value={formData.harfEn}
                onChange={handleChange}
                maxLength={1}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Tanım (Definition)</label>
              <textarea
                name="tanimEn"
                rows={4}
                value={formData.tanimEn}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Dayanak (Legal Basis)</label>
              <input
                type="text"
                name="dayanakEn"
                value={formData.dayanakEn}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Kategori (Category)</label>
              <input
                type="text"
                name="kategoriEn"
                value={formData.kategoriEn}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-navy-primary hover:bg-navy-secondary disabled:bg-navy-light text-white px-8 py-3 rounded-lg font-bold transition-all"
          >
            {saving ? 'Ekleniyor...' : 'Terim Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
}
