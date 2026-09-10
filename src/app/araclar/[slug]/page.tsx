import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InfazIframe from '@/components/InfazIframe';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tool = await prisma.tool.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
  });

  if (!tool) {
    return { title: 'Araç Bulunamadı | Aslan Hukuk' };
  }

  return {
    title: `${tool.title} | Aslan Hukuk`,
    description: tool.description || `${tool.title} aracı`,
  };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const tool = await prisma.tool.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
  });

  if (!tool) {
    notFound();
  }

  // Özel durum: İnfaz hesaplama aracının kendi tam ekran arayüzü var.
  // Ancak admin panelinden girilen "Nasıl kullanılır" rehberini (content)
  // hesaplama aracının hemen üstünde göstereceğiz.
  if (resolvedParams.slug === 'infaz-hesaplama' || resolvedParams.slug === 'infaz-hesaplama-en') {
    return (
      <>
        <Navbar />
        <div className="bg-bg-primary pt-24">
          {tool.content && tool.content.trim() !== '<p></p>' && (
            <article className="max-w-4xl mx-auto px-6 md:px-12 pb-8">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-navy-primary prose-a:text-accent-blue hover:prose-a:text-navy-primary"
                dangerouslySetInnerHTML={{ __html: tool.content }}
              />
            </article>
          )}
        </div>
        <main className="min-h-screen bg-bg-primary pb-0 flex flex-col">
          <InfazIframe versionInfo={tool.versionInfo} lang={resolvedParams.slug === 'infaz-hesaplama-en' ? 'en' : 'tr'} />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-bg-primary pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-6 md:px-12">
          
          {/* Breadcrumbs & Header */}
          <header className="mb-10 border-b border-border-primary pb-8">
            <nav className="flex items-center text-sm text-text-secondary mb-6 font-medium">
              <Link href="/" className="hover:text-navy-primary transition-colors">Ana Sayfa</Link>
              <span className="mx-2 text-border-strong">/</span>
              <Link href="/araclar" className="hover:text-navy-primary transition-colors">Hukuki Araçlar</Link>
              <span className="mx-2 text-border-strong">/</span>
              <span className="text-text-primary">{tool.title}</span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4 leading-tight">
              {tool.title}
            </h1>
            
            {tool.description && (
              <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">
                {tool.description}
              </p>
            )}
          </header>

          {/* User Content from Admin Panel */}
          {tool.content && (
            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-navy-primary prose-a:text-accent-blue hover:prose-a:text-navy-primary mb-12"
              dangerouslySetInnerHTML={{ __html: tool.content }}
            />
          )}

        </article>
      </main>

      <Footer />
    </>
  );
}
