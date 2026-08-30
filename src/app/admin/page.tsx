export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-text-primary border-b border-border-primary pb-4">
        Yönetici Paneline Hoş Geldiniz
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-secondary p-6 rounded-xl border border-border-primary shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-serif font-bold text-text-primary mb-2">Makaleler</h2>
          <p className="text-text-secondary text-sm mb-4">
            Hukuk notları ve blog yazılarını buradan ekleyebilir, silebilir ve güncelleyebilirsiniz.
          </p>
          <a href="/admin/makaleler" className="text-accent-blue font-medium hover:underline">
            Makaleleri Yönet &rarr;
          </a>
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl border border-border-primary shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-serif font-bold text-text-primary mb-2">Araçlar</h2>
          <p className="text-text-secondary text-sm mb-4">
            Sitede yayınlanacak hesaplama araçlarını vb. araçları buradan listeleyebilir ve yönetebilirsiniz.
          </p>
          <a href="/admin/araclar" className="text-accent-blue font-medium hover:underline">
            Araçları Yönet &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
