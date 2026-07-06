import React from 'react';

interface SearchBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto mb-10 select-none px-4">
      {/* Category Pills Filter - Horizontal Scrollable on Mobile and Desktop */}
      <div className="flex items-center overflow-x-auto whitespace-nowrap no-scrollbar py-2 gap-3 font-sans w-full">
        
        {/* All Services Pill */}
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`h-10 px-5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 hover:-translate-y-0.5 active:scale-95 ${
            selectedCategory === 'ALL'
              ? 'bg-brand-blue border-brand-blue text-white shadow-button'
              : 'border-slate-300 text-slate-700 bg-white hover:text-slate-900 hover:bg-slate-50 hover:border-slate-400 shadow-sm'
          }`}
        >
          All Services
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`h-10 px-5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 hover:-translate-y-0.5 active:scale-95 ${
              selectedCategory === category
                ? 'bg-brand-blue border-brand-blue text-white shadow-button'
                : 'border-slate-300 text-slate-700 bg-white hover:text-slate-900 hover:bg-slate-50 hover:border-slate-400 shadow-sm'
            }`}
          >
            {category}
          </button>
        ))}

      </div>
    </div>
  );
};
