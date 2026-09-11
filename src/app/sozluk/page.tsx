import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import GlossaryClient from './GlossaryClient';

export const metadata = {
  title: 'Hukuk Sözlüğü | Aslan Hukuk Bürosu',
  description: 'Müvekkillerimizin ve vatandaşlarımızın hukuki süreçlerde sıkça karşılaştığı temel kavramları ve anlamlarını derledik.',
};

// Force dynamic since DB can change
export const dynamic = 'force-dynamic';

export default async function DictionaryPage() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { kavramTr: 'asc' }
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 relative transition-colors duration-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-navy-primary/20"></div>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12 2xl:px-16 relative z-10">
          <GlossaryClient sozlukData={terms} />
        </div>
      </main>

      <Footer />
    </>
  );
}
