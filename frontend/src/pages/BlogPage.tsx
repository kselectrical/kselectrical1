import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPostsData } from '../blogData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BlogPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Blog & Expert Maintenance Advice | KS Electrical and AC Services</title>
        <meta name="description" content="Read expert guides on AC Service, AC Repair, RO Water Purifier maintenance, and electrical safety. Tips to save power bills and improve appliance lifespan." />
        <link rel="canonical" href="https://www.kselectrical.in/blog" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Blog & Guides' }]} />

      <section className="max-w-6xl mx-auto px-6 py-12 text-left font-sans">
        
        {/* Header section */}
        <div className="mb-12 text-center sm:text-left">
          <span className="text-[10px] text-brand-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
            Expert Insights & Tips
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mt-3 mb-4">
            KS Electrical Blog & Maintenance Guides
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-semibold leading-relaxed max-w-2xl">
            Learn how to maintain your home appliances, save on power bills, and resolve common faults with our certified technicians' step-by-step guides.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogPostsData.map((post) => (
            <article 
              key={post.slug}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-150">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-brand-blue text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  {post.category}
                </span>
              </div>

              {/* Text Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Meta stats */}
                  <div className="flex items-center space-x-4 text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                    <span className="flex items-center">
                      <Calendar size={11} className="mr-1 shrink-0" />
                      {post.publishDate}
                    </span>
                    <span className="flex items-center">
                      <Clock size={11} className="mr-1 shrink-0" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-gray-900 font-black text-lg sm:text-xl leading-snug group-hover:text-brand-blue transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-500 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="text-brand-blue hover:text-brand-blue-dark text-xs font-black uppercase tracking-wider inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </section>
    </>
  );
};
export default BlogPage;
