"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateAreaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    iconId: 1,
    titleTr: '',
    titleEn: '',
    briefTr: '',
    briefEn: '',
    descriptionTr: '',
    descriptionEn: '',
    itemsTr: '',
    itemsEn: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const itemsTrArray = formData.itemsTr.split('\n').filter(i => i.trim() !== '');
      const itemsEnArray = formData.itemsEn.split('\n').filter(i => i.trim() !== '');

      const payload = {
        ...formData,
        iconId: parseInt(formData.iconId.toString()),
        itemsTr: JSON.stringify(itemsTrArray),
        itemsEn: JSON.stringify(itemsEnArray),
      };

      const res = await fetch('/api/practice-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/admin/faaliyet-alanlari');
      } else {
        const data = await res.json();
        setError(data.error || 'Alan eklenirken bir hata oluştu.');
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
        <Link href="/admin/faaliyet-alanlari" className="text-text-secondary hover:text-navy-primary transition-colors">
          &larr; Geri
        </Link>
        <h1 className="text-3xl font-serif font-bold text-text-primary">Yeni Faaliyet Alanı Ekle</h1>
      </div>

      {error && (
        <div className="bg-accent-red/10 border-l-4 border-accent-red p-4 rounded text-accent-red">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-bg-secondary p-6 rounded-xl border border-border-primary">
        
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">İkon ID (1-6 arası)</label>
          <select
            name="iconId"
            value={formData.iconId}
            onChange={handleChange}
            className="w-full md:w-1/3 p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
          >
            <option value={1}>1 - Tokmak (Ceza/Genel)</option>
            <option value={2}>2 - Kalp (Aile)</option>
            <option value={3}>3 - Çanta (Şirketler/İş)</option>
            <option value={4}>4 - Dosya (İdare/Sözleşme)</option>
            <option value={5}>5 - Ev (Gayrimenkul)</option>
            <option value={6}>6 - Belge Onay (Vergi/Bilişim)</option>
          </select>
          <p className="text-xs text-text-muted mt-2">İkon tasarımı arayüzde otomatik olarak seçilir.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 border-r border-border-primary pr-4">
            <h2 className="text-xl font-serif font-bold text-navy-primary">Türkçe (TR)</h2>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Başlık *</label>
              <input
                type="text"
                name="titleTr"
                required
                value={formData.titleTr}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Kısa Açıklama (Kart Üzerindeki)</label>
              <textarea
                name="briefTr"
                rows={2}
                value={formData.briefTr}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Detaylı Açıklama (Modal İçindeki) *</label>
              <textarea
                name="descriptionTr"
                required
                rows={4}
                value={formData.descriptionTr}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Alt Hizmetler (Her satıra bir tane)</label>
              <textarea
                name="itemsTr"
                rows={5}
                value={formData.itemsTr}
                onChange={handleChange}
                placeholder="Örn:&#10;Ağır Ceza Davaları&#10;Asliye Ceza Davaları"
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
          </div>

          <div className="space-y-4 pl-4">
            <h2 className="text-xl font-serif font-bold text-navy-primary">İngilizce (EN)</h2>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Başlık (Title)</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Kısa Açıklama (Brief)</label>
              <textarea
                name="briefEn"
                rows={2}
                value={formData.briefEn}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Detaylı Açıklama (Description)</label>
              <textarea
                name="descriptionEn"
                rows={4}
                value={formData.descriptionEn}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Alt Hizmetler (Items - 1 per line)</label>
              <textarea
                name="itemsEn"
                rows={5}
                value={formData.itemsEn}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-navy-primary hover:bg-navy-secondary disabled:bg-navy-light text-white px-8 py-3 rounded-lg font-bold transition-all"
          >
            {saving ? 'Ekleniyor...' : 'Alan Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
}
