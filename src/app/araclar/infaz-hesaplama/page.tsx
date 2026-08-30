import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InfazIframe from '@/components/InfazIframe';

export const metadata = {
  title: 'İnfaz Hesaplama | Aslan Hukuk Bürosu',
  description: 'Kesinleşmiş hapis cezasına göre infaz sürelerini hesaplama aracı.',
};

export default function InfazHesaplamaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24 pb-0 flex flex-col">
        <InfazIframe />
      </main>
      <Footer />
    </>
  );
}
