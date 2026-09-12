import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ChevronLeft, Phone, MessageSquare, Zap, ArrowRight } from 'lucide-react';
import { blogPostsData, generateDynamicBlogContent } from '../blogData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const post = blogPostsData.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const phone = '7895321472';
  const whatsappPreFilledText = post.slug === 'why-ac-cooling-drops'
    ? 'नमस्ते, मेरा AC ठीक से कूलिंग नहीं कर रहा है, मुझे टेक्नीशियन चाहिए'
    : `Hi KS Electrical, I'd like to book a service after reading your blog about ${post.slug}.`;
  const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(whatsappPreFilledText)}`;

  return (
    <>
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://www.kselectrical.in/blog/${post.slug}`} />
      </Helmet>

      <Breadcrumbs 
        items={[
          { label: 'Blog & Guides', path: '/blog' },
          { label: post.title }
        ]} 
      />

      <section className="max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 text-left font-sans select-text">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            to="/blog"
            className="inline-flex items-center text-xs font-black text-gray-500 hover:text-brand-blue uppercase tracking-wider space-x-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} />
            <span>Back to blog</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <span className="bg-blue-50 text-brand-blue border border-blue-100 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* HERO / HEADER HIGHLIGHT BOX */}
          {(post.heroHighlight || post.slug === 'why-ac-cooling-drops') && (
            <div className="bg-gradient-to-br from-amber-500/10 via-blue-500/10 to-emerald-500/10 border-2 border-amber-400/90 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden my-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 shadow-sm mt-0.5">
                  <Zap size={20} className="fill-white" />
                </div>
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center text-[10px] font-black tracking-wider uppercase bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                      त्वरित सहायता (Quick Alert)
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full hidden sm:inline-block">
                      ✓ 45 मिनट में डोरस्टेप सर्विस
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug">
                    {post.heroHighlight || "क्या आपका AC हवा तो फेंक रहा है लेकिन कमरा ठंडा नहीं कर रहा? 90% मामलों में यह डस्ट ब्लॉकेज या गैस लीकेज होती है। खुद रिस्क न लें, 45 मिनट में वेरिफाइड टेक्नीशियन से चेक करवाएँ।"}
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-2.5">
                    <Link
                      to="/book"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <span>अभी AC चेकअप बुक करें (₹499)</span>
                      <ArrowRight size={14} />
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <MessageSquare size={14} />
                      <span>WhatsApp पर सलाह लें</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-extrabold uppercase tracking-wide border-y border-gray-100 py-3.5 select-none">
            <span className="flex items-center">
              <Calendar size={11} className="mr-1.5 shrink-0" />
              Published: {post.publishDate}
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center">
              <Clock size={11} className="mr-1.5 shrink-0" />
              {post.readTime}
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="text-emerald-600 font-black">
              Verified Advice
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden aspect-video bg-gray-150 mb-10 shadow-sm">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Post Body */}
          <div className="lg:col-span-2 space-y-6 prose prose-blue max-w-none text-gray-750 font-normal leading-relaxed text-sm sm:text-base">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content || generateDynamicBlogContent(post) }} 
              className="blog-content-renderer space-y-6"
            />
          </div>

          {/* Sidebar CTA Card */}
          <div className="lg:col-span-1 space-y-6 select-none">
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-white/5 space-y-4">
              <h3 className="font-black text-base tracking-tight leading-none">
                Need Professional Assistance?
              </h3>
              <p className="text-[11px] text-gray-300 font-semibold leading-relaxed">
                Our certified local technicians are available same-day for AC servicing, RO repairs, and electrical checks in your neighborhood.
              </p>

              <div className="space-y-2.5 pt-2">
                <a 
                  href={`tel:${phone}`}
                  className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <Phone size={13} />
                  <span>Call Dispatch</span>
                </a>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <MessageSquare size={13} className="text-emerald-400" />
                  <span>WhatsApp Now</span>
                </a>
                <Link 
                  to="/services"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95 block text-center"
                >
                  <span>Book Online</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* FLOATING MOBILE BOTTOM BAR (Sticky Bottom Action Bar) */}
      {(post.showStickyMobileBar || post.slug === 'why-ac-cooling-drops') && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl p-2.5 px-3 flex items-center gap-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <a 
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-2 rounded-xl shadow-sm text-xs sm:text-sm transition-all"
          >
            <Phone size={16} className="shrink-0" />
            <span>कॉल करें (Call Now)</span>
          </a>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 px-2 rounded-xl shadow-sm text-xs sm:text-sm transition-all"
          >
            <MessageSquare size={16} className="shrink-0" />
            <span>WhatsApp पर बात करें</span>
          </a>
        </div>
      )}
    </>
  );
};
export default BlogPostPage;
