import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PracticeAreas from '@/components/PracticeAreas';

export default function PracticeAreasPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-12 transition-colors duration-300">
        <PracticeAreas />
      </main>
      <Footer />
    </>
  );
}
