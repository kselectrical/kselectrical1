import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, BookOpen } from 'lucide-react';
import { blogPostsData } from '../blogData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return blogPostsData.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'AC Services', 'RO Services', 'Electrician', 'Washing Machine', 'Refrigerator', 'Kitchen Chimney', 'Geyser', 'Lighting', 'Microwave'];

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <>
      <Helmet>
        <title>Home Appliance Care Blog & Troubleshooting Guides | KS Electrical</title>
        <meta name="description" content="Browse our complete catalog of 1000+ expert maintenance articles. Learn troubleshooting tips for AC jet service, RO filter replacements, electrical tripping, and geysers." />
        <link rel="canonical" href="https://www.kselectrical.in/blog" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Blog & Guides' }]} />

      <section className="max-w-6xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left space-y-3">
          <span className="text-[10px] text-brand-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none inline-block">
            Expert Insights & Tips
          </span>
          <h1 className="text-gray-900 font-black text-3xl sm:text-4xl tracking-tight leading-none">
            KS Electrical Blog & Maintenance Library
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-semibold leading-relaxed max-w-2xl">
            Search our comprehensive database of 1000+ troubleshooting guides and care checklists written by our certified service engineers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search 1000+ articles (e.g. AC service, fridge cooling, MCB)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(10); // Reset count during typing
            }}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-brand-blue rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 outline-none transition-all shadow-xs"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(10);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredPosts.slice(0, visibleCount).map((post) => (
                <article 
                  key={post.slug}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group text-left"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-150">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = '/svc_ac_repair.webp'; }}
                    />
                    <span className="absolute top-4 left-4 bg-brand-blue text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  {/* Text Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta stats */}
                      <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                        <span className="flex items-center">
                          <Calendar size={11} className="mr-1.5 shrink-0" />
                          {post.publishDate}
                        </span>
                        <span className="flex items-center">
                          <Clock size={11} className="mr-1.5 shrink-0" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-slate-900 font-black text-base sm:text-lg leading-snug group-hover:text-brand-orange transition-colors">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between select-none">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-brand-blue hover:text-brand-orange text-xs font-black uppercase tracking-wider inline-flex items-center space-x-1.5 cursor-pointer"
                      >
                        <span>Read Article</span>
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredPosts.length && (
              <div className="mt-12 text-center select-none">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-300 rounded-3xl max-w-4xl space-y-3">
            <BookOpen size={32} className="text-slate-400 mx-auto animate-pulse" />
            <h3 className="text-slate-700 font-bold text-base">No Matching Articles Found</h3>
            <p className="text-slate-400 text-xs font-semibold">
              Try searching for different keywords or select a different category filter.
            </p>
          </div>
        )}

      </section>
    </>
  );
};

export default BlogPage;
