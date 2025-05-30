import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';
import { ItemType } from '../types/ItemType';
import uspRoyalBlue from '../assets/usp-royal-blue.webp';

// Иконка для подкатегорий
const SubcategoryIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

// Типы для категорий
interface Subcategory {
  id: string;
  name: string;
  items: string;
}

interface CategoryInfo {
  name: string;
  description: string;
  subcategories: Subcategory[];
}

// Данные категорий
const categoryData: Record<string, CategoryInfo> = {
  knives: {
    name: 'Knives',
    description: 'Browse our collection of rare and popular Standoff 2 knives',
    subcategories: [
      { id: 'karambit', name: 'Karambit', items: '240+' },
      { id: 'butterfly', name: 'Butterfly Knife', items: '210+' },
      { id: 'm9-bayonet', name: 'M9 Bayonet', items: '185+' }
    ]
  },
  // Добавьте другие категории по аналогии
};

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useTranslation();
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]);
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const itemsPerPage = 12;

  const category = categoryId ? categoryData[categoryId] : null;

  // Эффект для фильтрации предметов
  useEffect(() => {
    if (!categoryId) return;

    // Здесь будет логика фильтрации
    // ...

  }, [categoryId, activeSubcategory, sortOrder]);

  if (!category) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl text-white">Category not found</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-3 md:py-8 md:px-0">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-csm-blue-primary to-csm-bg-card rounded-xl p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.name}</h1>
          <p className="text-gray-300">{category.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Mobile Filters Toggle Button */}
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="lg:hidden w-full flex items-center justify-between bg-csm-bg-card border border-csm-border rounded-xl p-4 text-white"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform transition-transform ${isFiltersVisible ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Filters Sidebar */}
          <div 
            className={`
              lg:w-1/4 
              ${isFiltersVisible ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'} 
              transition-all duration-300 ease-in-out overflow-hidden
            `}
          >
            {/* Subcategories */}
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-4 mb-4">
              <h2 className="text-white font-semibold mb-3">Subcategories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSubcategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${!activeSubcategory ? 'bg-csm-blue-primary text-white' : 'text-csm-text-secondary hover:bg-csm-bg-darker'}`}
                >
                  <SubcategoryIcon />
                  <span className="ml-2">All {category.name}</span>
                </button>
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => setActiveSubcategory(subcategory.id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeSubcategory === subcategory.id ? 'bg-csm-blue-primary text-white' : 'text-csm-text-secondary hover:bg-csm-bg-darker'}`}
                  >
                    <SubcategoryIcon />
                    <span className="ml-2">{subcategory.name}</span>
                    <span className="ml-auto text-xs opacity-70">{subcategory.items}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-4">
              <h2 className="text-white font-semibold mb-3">Filters</h2>

              {/* Price Range */}
              <div className="mb-4">
                <h3 className="text-csm-text-secondary text-sm mb-2">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Min"
                    className="bg-csm-bg-darker text-white py-1 px-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-csm-blue-accent"
                  />
                  <span className="text-csm-text-secondary">-</span>
                  <input
                    type="text"
                    placeholder="Max"
                    className="bg-csm-bg-darker text-white py-1 px-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-csm-blue-accent"
                  />
                </div>
              </div>

              {/* Wear/Condition */}
              <div className="mb-4">
                <h3 className="text-csm-text-secondary text-sm mb-2">Condition</h3>
                <div className="space-y-1">
                  {['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map(condition => (
                    <label key={condition} className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-csm-text-secondary">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rarity */}
              <div>
                <h3 className="text-csm-text-secondary text-sm mb-2">Rarity</h3>
                <div className="space-y-1">
                  {['Consumer Grade', 'Industrial Grade', 'Mil-Spec', 'Restricted', 'Classified', 'Covert'].map(rarity => (
                    <label key={rarity} className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-csm-text-secondary">{rarity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="lg:w-3/4">
            {/* Sorting Options */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white font-semibold">
                {activeSubcategory
                  ? category.subcategories.find(s => s.id === activeSubcategory)?.name
                  : `All ${category.name}`}
              </h2>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="bg-csm-bg-darker text-white py-1 px-3 rounded border border-csm-border focus:outline-none focus:ring-1 focus:ring-csm-blue-accent"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Здесь будет отображение предметов */}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryPage; 