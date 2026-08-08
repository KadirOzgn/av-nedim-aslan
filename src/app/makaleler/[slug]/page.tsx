import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, History, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AISummaryButton from '@/components/AISummaryButton';
import { getArticleBySlug, getArticles } from '@/lib/mdx';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { metadata } = article;
  
  const isEn = slug.endsWith('-en');
  const locale = isEn ? 'en-US' : 'tr-TR';
  const labels = {
    backBtn: isEn ? "Return to All Articles" : "Tüm Makalelere Dön",
    published: isEn ? "Published" : "Yayınlanma",
    historyTitle: isEn ? "Update History" : "Sürüm Geçmişi",
    firstPublished: isEn ? "First Published" : "İlk Yayın",
    lastUpdated: isEn ? "Last Updated" : "Son Güncelleme",
    sourcesTitle: isEn ? "Legal Sources" : "Hukuki Dayanaklar",
    disclaimer: isEn 
      ? "This article is for informational purposes only. Legal rules may vary depending on each concrete case. To avoid loss of rights, it is recommended to seek direct legal assistance from an attorney for your legal problems."
      : "Bu makale sadece bilgilendirme amaçlıdır. Hukuk kuralları her somut olaya göre farklılık gösterebilir. Hak kaybı yaşamamak adına hukuki sorunlarınızda doğrudan avukat desteği almanız önerilir.",
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary pt-32 pb-24 relative transition-colors duration-300">
        {/* Red Thread vertical detail */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-burgundy-primary/20"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-12">
            <Link 
              href="/#articles"
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-wider text-burgundy-primary uppercase hover:translate-x-[-4px] transition-transform duration-200 mb-6"
            >
              <ArrowLeft size={14} /> {labels.backBtn}
            </Link>

            {/* Article Top Metadata */}
            <div className="flex flex-wrap gap-4 items-center text-[0.65rem] text-text-muted font-sans font-medium uppercase tracking-wider mb-4">
              <span className="text-burgundy-primary">{metadata.category}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700"></span>
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {labels.published}: {new Date(metadata.date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight max-w-4xl">
              {metadata.title}
            </h1>
          </div>

          {/* Featured Image */}
          <div className="relative h-64 md:h-[400px] w-full border border-burgundy-primary/10 rounded-sm overflow-hidden mb-12 shadow-sm">
            <Image 
              src={metadata.image} 
              alt={metadata.title} 
              fill
              priority
              className="object-cover transition-all duration-700"
            />
          </div>

          {/* Grid Layout: Asymmetrical 70% Body Text / 30% Sticky Edge Notes Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-12 items-start">
            
            {/* 70% Article Content Column */}
            <div className="article-body">
              <ReactMarkdown
                components={{
                  h1: (props) => <h1 className="text-2xl font-serif font-bold text-text-primary mt-8 mb-4 border-b border-burgundy-primary/5 pb-2" {...props} />,
                  h2: (props) => <h2 className="text-xl font-serif font-bold text-text-primary mt-8 mb-4 border-b border-burgundy-primary/5 pb-2" {...props} />,
                  h3: (props) => <h3 className="text-lg font-serif font-semibold text-text-primary mt-6 mb-2" {...props} />,
                  h4: (props) => <h4 className="text-base font-serif font-semibold text-text-primary mt-4 mb-2" {...props} />,
                  p: (props) => <p className="text-sm text-text-secondary font-light leading-relaxed mb-5 text-justify" {...props} />,
                  ul: (props) => <ul className="list-disc pl-5 mb-5 text-xs text-text-secondary flex flex-col gap-2 font-light" {...props} />,
                  ol: (props) => <ol className="list-decimal pl-5 mb-5 text-xs text-text-secondary flex flex-col gap-2 font-light" {...props} />,
                  li: (props) => <li className="pl-1" {...props} />,
                  strong: (props) => <strong className="font-semibold text-text-primary" {...props} />,
                  em: (props) => <em className="italic text-text-secondary" {...props} />,
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* 30% Sticky Edge-note Sidebar Column */}
            <aside className="lg:sticky lg:top-24 flex flex-col gap-8">
              
              {/* Sürüm Geçmişi (Update History) - Edge Notes style */}
              <div className="p-5 border border-burgundy-primary/10 bg-burgundy-bg/25 dark:bg-burgundy-bg/10 rounded-sm">
                <h4 className="font-sans font-semibold text-[0.65rem] tracking-widest text-text-primary uppercase mb-4 flex items-center gap-2">
                  <History size={12} className="text-burgundy-primary" />
                  {labels.historyTitle}
                </h4>
                <div className="flex flex-col gap-3 text-[0.7rem] text-text-secondary font-light">
                  <div className="flex justify-between py-1 border-b border-burgundy-primary/5">
                    <span>{labels.firstPublished}</span>
                    <span>{new Date(metadata.date).toLocaleDateString(locale)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-burgundy-primary/5">
                    <span>{labels.lastUpdated}</span>
                    <span>{new Date(metadata.updateDate).toLocaleDateString(locale)}</span>
                  </div>
                </div>
              </div>

              {/* Kaynaklar (Sources) */}
              {metadata.sources && metadata.sources.length > 0 && (
                <div className="p-5 border border-burgundy-primary/10 bg-burgundy-bg/25 dark:bg-burgundy-bg/10 rounded-sm">
                  <h4 className="font-sans font-semibold text-[0.65rem] tracking-widest text-text-primary uppercase mb-4 flex items-center gap-2">
                    <FileText size={12} className="text-burgundy-primary" />
                    {labels.sourcesTitle}
                  </h4>
                  <ul className="list-none pl-0 flex flex-col gap-2 text-[0.7rem] text-text-secondary font-light m-0">
                    {metadata.sources.map((source, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <span className="text-burgundy-primary">•</span>
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Summarizer Button */}
              <AISummaryButton />

              {/* Legal Disclaimer Info Card */}
              <div className="p-5 border border-burgundy-primary/10 bg-stone-100/50 dark:bg-stone-900/10 rounded-sm flex gap-3 items-start">
                <Info size={16} className="text-burgundy-primary flex-shrink-0 mt-0.5" />
                <div className="text-[0.62rem] text-text-muted leading-relaxed text-justify font-light">
                  {labels.disclaimer}
                </div>
              </div>

            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
