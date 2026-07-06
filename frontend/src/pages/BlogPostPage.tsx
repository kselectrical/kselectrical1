import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ChevronLeft, Phone, MessageSquare } from 'lucide-react';
import { blogPostsData } from '../blogData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const post = blogPostsData.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const phone = '7895321472';
  const whatsappUrl = `https://wa.me/91${phone}?text=Hi%20KS%20Electrical,%20I'd%20like%20to%20book%20a%20service%20after%20reading%2520your%2520blog%2520about%2520${post.slug}.`;

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

      <section className="max-w-4xl mx-auto px-6 py-8 text-left font-sans select-text">
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
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Post Body */}
          <div className="lg:col-span-2 space-y-6 prose prose-blue max-w-none text-gray-750 font-normal leading-relaxed text-sm sm:text-base">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }} 
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
    </>
  );
};
export default BlogPostPage;
