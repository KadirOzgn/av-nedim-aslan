"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchArea();
  }, []);

  const fetchArea = async () => {
    try {
      const res = await fetch(`/api/practice-areas/${unwrappedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        
        let parsedItemsTr = '';
        let parsedItemsEn = '';
        
        try {
          if (data.itemsTr) parsedItemsTr = JSON.parse(data.itemsTr).join('\n');
          if (data.itemsEn) parsedItemsEn = JSON.parse(data.itemsEn).join('\n');
        } catch (e) {}

        setFormData({
          iconId: data.iconId || 1,
          titleTr: data.titleTr || '',
          titleEn: data.titleEn || '',
          briefTr: data.briefTr || '',
          briefEn: data.briefEn || '',
          descriptionTr: data.descriptionTr || '',
          descriptionEn: data.descriptionEn || '',
          itemsTr: parsedItemsTr,
          itemsEn: parsedItemsEn
        });
      } else {
        setError('Alan bulunamadı.');
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

      const res = await fetch(`/api/practice-areas/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/admin/faaliyet-alanlari');
      } else {
        const data = await res.json();
        setError(data.error || 'Alan güncellenirken bir hata oluştu.');
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
        <Link href="/admin/faaliyet-alanlari" className="text-text-secondary hover:text-navy-primary transition-colors">
          &larr; Geri
        </Link>
        <h1 className="text-3xl font-serif font-bold text-text-primary">Faaliyet Alanını Düzenle</h1>
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
              <label className="block text-sm font-semibold text-text-primary mb-2">Kısa Açıklama</label>
              <textarea
                name="briefTr"
                rows={2}
                value={formData.briefTr}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:border-navy-light focus:ring-1 focus:ring-navy-light transition-all"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Detaylı Açıklama *</label>
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
            {saving ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
