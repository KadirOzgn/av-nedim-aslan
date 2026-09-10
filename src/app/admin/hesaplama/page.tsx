import InfazIframe from '@/components/InfazIframe';
import prisma from '@/lib/prisma';

export default async function AdminHesaplamaPage() {
  const tool = await prisma.tool.findUnique({
    where: { slug: 'infaz-hesaplama' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border-primary pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">İnfaz Hesaplama</h1>
          <p className="text-text-secondary mt-1">
            Müvekkilleriniz için hızlıca yatar süresi ve koşullu salıverilme hesabı yapabilirsiniz.
          </p>
        </div>
      </div>
      
      <div className="bg-bg-primary rounded-xl border border-border-primary overflow-hidden shadow-sm">
        <InfazIframe versionInfo={tool?.versionInfo} />
      </div>
    </div>
  );
}
