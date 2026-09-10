import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PracticeAreas from '@/components/PracticeAreas';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function PracticeAreasPage() {
  const areas = await prisma.practiceArea.findMany({
    orderBy: { iconId: 'asc' }
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-12 transition-colors duration-300">
        <PracticeAreas areas={areas} />
      </main>
      <Footer />
    </>
  );
}
