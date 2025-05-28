import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';
import uspRoyalBlue from '../assets/usp-royal-blue.webp';

// Define types for the data structures
type Subcategory = {
  id: string;
  name: string;
  items: string;
};

type CategoryInfo = {
  name: string;
  description: string;
  subcategories: Subcategory[];
};

type CategoryDataType = {
  [key: string]: CategoryInfo;
};

// Category data mapping (same as in CategoryPage)
const categoryData: CategoryDataType = {
  knives: {
    name: 'Knives',
    description: 'Browse our collection of rare and popular Standoff 2 knives',
    subcategories: [
      { id: 'karambit', name: 'Karambit', items: '240+' },
      { id: 'butterfly', name: 'Butterfly Knife', items: '210+' },
      { id: 'm9-bayonet', name: 'M9 Bayonet', items: '185+' },
      { id: 'flip', name: 'Flip Knife', items: '165+' },
      { id: 'gut', name: 'Gut Knife', items: '120+' },
      { id: 'huntsman', name: 'Huntsman Knife', items: '110+' },
      { id: 'falchion', name: 'Falchion Knife', items: '100+' },
      { id: 'bowie', name: 'Bowie Knife', items: '95+' }
    ]
  },
  gloves: {
    name: 'Gloves',
    description: 'Enhance your gameplay with premium Standoff 2 gloves',
    subcategories: [
      { id: 'sport', name: 'Sport Gloves', items: '85+' },
      { id: 'driver', name: 'Driver Gloves', items: '75+' },
      { id: 'specialist', name: 'Specialist Gloves', items: '70+' },
      { id: 'moto', name: 'Moto Gloves', items: '65+' },
      { id: 'hand', name: 'Hand Wraps', items: '50+' },
      { id: 'bloodhound', name: 'Bloodhound Gloves', items: '35+' }
    ]
  },
  weapons: {
    name: 'Weapons',
    description: 'Discover the best skins for all Standoff 2 weapons',
    subcategories: [
      { id: 'rifle', name: 'Rifles', items: '1,850+' },
      { id: 'pistol', name: 'Pistols', items: '1,420+' },
      { id: 'sniper', name: 'Sniper Rifles', items: '950+' },
      { id: 'smg', name: 'SMGs', items: '780+' },
      { id: 'shotgun', name: 'Shotguns', items: '420+' },
      { id: 'machinegun', name: 'Machine Guns', items: '180+' }
    ]
  },
  stickers: {
    name: 'Stickers',
    description: 'Customize your weapons with our wide selection of Standoff 2 stickers',
    subcategories: [
      { id: 'tournament', name: 'Tournament Stickers', items: '850+' },
      { id: 'team', name: 'Team Stickers', items: '600+' },
      { id: 'player', name: 'Player Autographs', items: '450+' },
      { id: 'holo', name: 'Holo Stickers', items: '240+' },
      { id: 'foil', name: 'Foil Stickers', items: '160+' }
    ]
  },
  keychains: {
    name: 'Keychains',
    description: 'Add style to your inventory with unique keychains',
    subcategories: [
      { id: 'weapon', name: 'Weapon Keychains', items: '180+' },
      { id: 'character', name: 'Character Keychains', items: '150+' },
      { id: 'special', name: 'Special Edition', items: '120+' }
    ]
  },
  grenades: {
    name: 'Grenades',
    description: 'Upgrade your utility with stylish grenade skins',
    subcategories: [
      { id: 'smoke', name: 'Smoke Grenades', items: '35+' },
      { id: 'flashbang', name: 'Flashbangs', items: '30+' },
      { id: 'molotov', name: 'Molotovs', items: '25+' },
      { id: 'he', name: 'HE Grenades', items: '20+' },
      { id: 'decoy', name: 'Decoy Grenades', items: '10+' }
    ]
  },
  graffiti: {
    name: 'Graffiti',
    description: 'Express yourself with our collection of Standoff 2 graffiti',
    subcategories: [
      { id: 'tournament', name: 'Tournament Graffiti', items: '300+' },
      { id: 'normal', name: 'Regular Graffiti', items: '450+' },
      { id: 'holo', name: 'Holo Graffiti', items: '130+' },
      { id: 'sealed', name: 'Sealed Graffiti', items: '100+' }
    ]
  },
  containers: {
    name: 'Containers',
    description: 'Explore our range of cases, capsules and packages',
    subcategories: [
      { id: 'cases', name: 'Weapon Cases', items: '140+' },
      { id: 'souvenir', name: 'Souvenir Packages', items: '85+' },
      { id: 'sticker-capsule', name: 'Sticker Capsules', items: '50+' },
      { id: 'music-kit', name: 'Music Kit Boxes', items: '25+' },
      { id: 'pins', name: 'Pin Capsules', items: '20+' }
    ]
  },
  fragments: {
    name: 'Fragments',
    description: 'Find the best fragments for your trade-up contracts',
    subcategories: [
      { id: 'weapon', name: 'Weapon Fragments', items: '45+' },
      { id: 'case', name: 'Case Fragments', items: '25+' },
      { id: 'operation', name: 'Operation Fragments', items: '20+' }
    ]
  }
};

// Sample item type
type ItemType = {
  id: number;
  name: string;
  condition: string;
  price: string;
  image: string;
  rarity: string;
  category: string;
  subcategory: string;
};

// Sample items for each subcategory (same as in CategoryPage)
const sampleItems: ItemType[] = [
  {
    id: 1,
    name: 'Karambit | Fade',
    condition: 'Factory New',
    price: 'G 1,245.50',
    image: uspRoyalBlue, // Use imported image
    rarity: 'Covert',
    category: 'knives',
    subcategory: 'karambit'
  },
  {
    id: 2,
    name: 'Butterfly Knife | Crimson Web',
    condition: 'Minimal Wear',
    price: 'G 950.75',
    image: uspRoyalBlue, // Use imported image
    rarity: 'Covert',
    category: 'knives',
    subcategory: 'butterfly'
  },
  {
    id: 3,
    name: 'Sport Gloves | Pandora\'s Box',
    condition: 'Field-Tested',
    price: 'G 1230.00',
    image: uspRoyalBlue, // Use imported image
    rarity: 'Extraordinary',
    category: 'gloves',
    subcategory: 'sport'
  },
  {
    id: 4,
    name: 'AWP | Dragon Lore',
    condition: 'Field-Tested',
    price: 'G 3200.25',
    image: uspRoyalBlue, // Use imported image
    rarity: 'Covert',
    category: 'weapons',
    subcategory: 'sniper'
  }
];

// Generate more sample items (at least 5 per subcategory)
const generateSampleItems = () => {
  let id = 5;
  const items: ItemType[] = [...sampleItems];

  // Generate items for each category and subcategory
  Object.entries(categoryData).forEach(([categoryKey, category]) => {
    category.subcategories.forEach(subcategory => {
      // Generate at least 5 items per subcategory
      const existingCount = items.filter(
        item => item.category === categoryKey && item.subcategory === subcategory.id
      ).length;

      const itemsToGenerate = Math.max(0, 5 - existingCount);

      for (let i = 0; i < itemsToGenerate; i++) {
        items.push({
          id: id++,
          name: `${subcategory.name} Item ${i + 1}`,
          condition: ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'][Math.floor(Math.random() * 5)],
          price: `G ${(Math.random() * 1000).toFixed(2)}`,
          image: uspRoyalBlue, // Use imported image
          rarity: ['Consumer Grade', 'Industrial Grade', 'Mil-Spec', 'Restricted', 'Classified', 'Covert', 'Extraordinary'][Math.floor(Math.random() * 7)],
          category: categoryKey,
          subcategory: subcategory.id
        });
      }
    });
  });

  return items;
};

const allItems = generateSampleItems();

const SubcategoryPage: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const { t } = useTranslation();
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]);
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Get category and subcategory data
  const category = categoryData[categoryId as keyof typeof categoryData];
  const subcategory = category?.subcategories.find(sub => sub.id === subcategoryId);

  // Set document title
  useEffect(() => {
    if (category && subcategory) {
      document.title = `${subcategory.name} | ${category.name} | CSMarketClone`;
    }
  }, [category, subcategory]);

  // Filter items based on the selected category and subcategory
  useEffect(() => {
    if (!categoryId || !subcategoryId) return;

    let items = allItems.filter(
      item => item.category === categoryId && item.subcategory === subcategoryId
    );

    // Apply sorting
    items = [...items].sort((a, b) => {
      if (sortOrder === 'price-asc') {
        return parseFloat(a.price.replace('G ', '').replace(',', '')) - parseFloat(b.price.replace('G ', '').replace(',', ''));
      } else if (sortOrder === 'price-desc') {
        return parseFloat(b.price.replace('G ', '').replace(',', '')) - parseFloat(a.price.replace('G ', '').replace(',', ''));
      } else {
        // For 'newest', we'll just use the ID for demo purposes
        return b.id - a.id;
      }
    });

    setFilteredItems(items);
  }, [categoryId, subcategoryId, sortOrder]);

  // Reset to page 1 on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, subcategoryId, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!category || !subcategory) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl text-white">Subcategory not found</h1>
          <Link to="/" className="text-csm-blue-accent hover:underline mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-3 md:py-8 md:px-0">
        {/* Breadcrumb navigation */}
        <div className="mb-4">
          <nav className="flex text-sm">
            <Link to="/" className="text-csm-text-secondary hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2 text-csm-text-secondary">/</span>
            <Link to={`/categories/${categoryId}`} className="text-csm-text-secondary hover:text-white transition-colors">
              {category.name}
            </Link>
            <span className="mx-2 text-csm-text-secondary">/</span>
            <span className="text-white">{subcategory.name}</span>
          </nav>
        </div>

        {/* Subcategory Header */}
        <div className="bg-gradient-to-r from-csm-blue-primary to-csm-bg-card rounded-xl p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{subcategory.name}</h1>
          <p className="text-gray-300">Browse our collection of {subcategory.name.toLowerCase()} from the {category.name.toLowerCase()} category.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-4 mb-4">
              <h2 className="text-white font-semibold mb-3">Browse {category.name}</h2>
              <div className="space-y-2">
                <Link
                  to={`/categories/${categoryId}`}
                  className="block w-full text-left px-3 py-2 rounded-md text-csm-text-secondary hover:bg-csm-bg-darker"
                >
                  ← Back to All {category.name}
                </Link>

                <hr className="border-csm-border my-2" />

                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/categories/${categoryId}/${sub.id}`}
                    className={`block w-full text-left px-3 py-2 rounded-md ${subcategoryId === sub.id ? 'bg-csm-blue-primary text-white' : 'text-csm-text-secondary hover:bg-csm-bg-darker'}`}
                  >
                    {sub.name}
                    <span className="float-right text-xs opacity-70">{sub.items}</span>
                  </Link>
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
                  {['Consumer Grade', 'Industrial Grade', 'Mil-Spec', 'Restricted', 'Classified', 'Covert', 'Extraordinary'].map(rarity => (
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
                {subcategory.name} ({filteredItems.length} items)
              </h2>

              <div className="flex items-center">
                <span className="text-csm-text-secondary mr-2 hidden sm:inline">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'price-asc' | 'price-desc' | 'newest')}
                  className="bg-csm-bg-darker text-white py-1 px-3 rounded border border-csm-border focus:outline-none focus:ring-1 focus:ring-csm-blue-accent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedItems.length > 0 ? (
                paginatedItems.map(item => (
                  <Link
                    key={item.id}
                    to={`/item/${item.id}`}
                    className="bg-csm-bg-card border border-csm-border rounded-xl overflow-hidden hover:border-csm-blue-accent transition-colors"
                  >
                    <div className="bg-gradient-to-b from-csm-bg-lighter to-csm-blue-primary/20 p-4 flex items-center justify-center h-40 relative">
                      <img src={item.image} alt={item.name} className="max-h-full max-w-full" />

                      {/* Rarity Badge */}
                      <div className="absolute top-2 right-2 bg-csm-bg-darker text-csm-text-secondary text-xs px-2 py-1 rounded">
                        {item.rarity}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-medium mb-1 truncate">{item.name}</h3>
                      <p className="text-csm-text-secondary text-sm mb-2">{item.condition}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-csm-blue-accent font-medium">{item.price}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center">
                  <p className="text-csm-text-secondary">No items found for this subcategory.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredItems.length > 0 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    className={`px-2 py-1 border border-csm-border rounded-l text-csm-text-secondary hover:bg-csm-bg-darker ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-1 border-t border-b border-csm-border ${currentPage === i + 1 ? 'bg-csm-blue-primary text-white' : 'text-csm-text-secondary hover:bg-csm-bg-darker'}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className={`px-2 py-1 border border-csm-border rounded-r text-csm-text-secondary hover:bg-csm-bg-darker ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubcategoryPage;
