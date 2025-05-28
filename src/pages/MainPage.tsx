import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ItemStatistics from '../components/ItemStatistics';
import uspRoyalBlue from '../assets/usp-royal-blue.webp';

// Category icon components
const KnifeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
  </svg>
);

const GloveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const WeaponIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const StickerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const KeychainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const GrenadeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const GraffitiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const ContainerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const FragmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

// Sample featured items data
const featuredItems = [
  {
    id: 1,
    name: 'USP-S | Royal Blue',
    condition: 'Field-Tested',
    price: 'G 16.42',
    image: uspRoyalBlue,
    rarity: 'Industrial Grade',
    discount: '-15%'
  },
  {
    id: 2,
    name: 'AK-47 | Redline',
    condition: 'Field-Tested',
    price: 'G 45.76',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Classified',
    discount: '-8%'
  },
  {
    id: 3,
    name: 'AWP | Asiimov',
    condition: 'Battle-Scarred',
    price: 'G 86.30',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Covert',
    discount: '-12%'
  },
  {
    id: 4,
    name: 'M4A4 | Desolate Space',
    condition: 'Minimal Wear',
    price: 'G 32.15',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Classified',
    discount: ''
  }
];

// Sample trending items data
const trendingItems = [
  {
    id: 5,
    name: 'Butterfly Knife | Fade',
    condition: 'Factory New',
    price: 'G 1320.50',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Covert',
    change: '+2.5%'
  },
  {
    id: 6,
    name: 'Skeleton Knife | Crimson Web',
    condition: 'Minimal Wear',
    price: 'G 1856.75',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Covert',
    change: '+5.1%'
  },
  {
    id: 7,
    name: 'Sport Gloves | Pandora\'s Box',
    condition: 'Field-Tested',
    price: 'G 1243.20',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Extraordinary',
    change: '+3.8%'
  },
  {
    id: 8,
    name: 'AWP | Dragon Lore',
    condition: 'Field-Tested',
    price: 'G 3450.00',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Covert',
    change: '+1.2%'
  }
];

// Sample new items data
const newItems = [
  {
    id: 9,
    name: 'M4A1-S | Printstream',
    condition: 'Factory New',
    price: 'G 142.30',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Covert',
    addedDate: '3 days ago'
  },
  {
    id: 10,
    name: 'Karambit | Doppler',
    condition: 'Factory New',
    price: 'G 785.40',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Covert',
    addedDate: '5 days ago'
  },
  {
    id: 11,
    name: 'Glock-18 | Bullet Queen',
    condition: 'Minimal Wear',
    price: 'G 28.75',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Covert',
    addedDate: '1 week ago'
  },
  {
    id: 12,
    name: 'AK-47 | Slate',
    condition: 'Factory New',
    price: 'G 12.50',
    image: uspRoyalBlue, // Placeholder
    rarity: 'Mil-Spec',
    addedDate: '1 week ago'
  }
];

// Main categories
const categories = [
  { id: 'knives', name: 'Knives', icon: <KnifeIcon />, items: '1,240+' },
  { id: 'gloves', name: 'Gloves', icon: <GloveIcon />, items: '380+' },
  { id: 'weapons', name: 'Weapons', icon: <WeaponIcon />, items: '5,600+' },
  { id: 'stickers', name: 'Stickers', icon: <StickerIcon />, items: '2,300+' },
  { id: 'keychains', name: 'Keychains', icon: <KeychainIcon />, items: '450+' },
  { id: 'grenades', name: 'Grenades', icon: <GrenadeIcon />, items: '120+' },
  { id: 'graffiti', name: 'Graffiti', icon: <GraffitiIcon />, items: '980+' },
  { id: 'containers', name: 'Containers', icon: <ContainerIcon />, items: '320+' },
  { id: 'fragments', name: 'Fragments', icon: <FragmentIcon />, items: '90+' }
];

const MainPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'featured' | 'trending' | 'new'>('featured');

  // Function to get the active items based on the selected tab
  const getActiveItems = () => {
    switch (activeTab) {
      case 'featured':
        return featuredItems;
      case 'trending':
        return trendingItems;
      case 'new':
        return newItems;
      default:
        return featuredItems;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-3 md:py-8 md:px-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-csm-blue-primary to-csm-bg-card rounded-xl p-6 md:p-10 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {/* Pattern of small dots */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Welcome to standoffbook
            </h1>
            <p className="text-gray-300 mb-6 md:text-lg">
              Browse, collect, and trade thousands of exclusive Standoff 2 skins, knives, gloves and more. Safe and easy for all standoffbook fans.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/categories" className="bg-csm-blue-accent text-white py-2 px-6 rounded-md hover:bg-csm-blue-hover transition-colors">
                Browse Categories
              </Link>
              <Link to="/new-items" className="bg-csm-bg-darker text-white py-2 px-6 rounded-md hover:bg-csm-bg-lighter transition-colors">
                View New Items
              </Link>
            </div>
          </div>
        </div>

        {/* Item Statistics Section */}
        <ItemStatistics />

        {/* Featured/Trending/New Items Tabs */}
        <section className="mb-10">
          <div className="flex mb-6 border-b border-csm-border">
            <button
              className={`py-3 px-5 text-sm font-medium relative ${activeTab === 'featured' ? 'text-white' : 'text-csm-text-secondary hover:text-white'} transition-colors`}
              onClick={() => setActiveTab('featured')}
            >
              Featured Items
              {activeTab === 'featured' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-csm-blue-accent"></div>
              )}
            </button>
            <button
              className={`py-3 px-5 text-sm font-medium relative ${activeTab === 'trending' ? 'text-white' : 'text-csm-text-secondary hover:text-white'} transition-colors`}
              onClick={() => setActiveTab('trending')}
            >
              Trending Now
              {activeTab === 'trending' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-csm-blue-accent"></div>
              )}
            </button>
            <button
              className={`py-3 px-5 text-sm font-medium relative ${activeTab === 'new' ? 'text-white' : 'text-csm-text-secondary hover:text-white'} transition-colors`}
              onClick={() => setActiveTab('new')}
            >
              New Arrivals
              {activeTab === 'new' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-csm-blue-accent"></div>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getActiveItems().map(item => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="bg-csm-bg-card border border-csm-border rounded-xl overflow-hidden hover:border-csm-blue-accent transition-colors"
              >
                <div className="bg-gradient-to-b from-csm-bg-lighter to-csm-blue-primary/20 p-4 flex items-center justify-center h-40 relative">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full" />

                  {/* Discount or Change Badge */}
                  {'discount' in item && item.discount ? (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                      {item.discount}
                    </div>
                  ) : ('change' in item && item.change) ? (
                    <div className={`absolute top-2 left-2 ${item.change.startsWith('+') ? 'bg-green-500' : 'bg-red-500'} text-white text-xs font-medium px-2 py-1 rounded`}>
                      {item.change}
                    </div>
                  ) : ('addedDate' in item) ? (
                    <div className="absolute top-2 left-2 bg-csm-blue-accent text-white text-xs font-medium px-2 py-1 rounded">
                      New
                    </div>
                  ) : null}

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
                    {'addedDate' in item ? (
                      <span className="text-csm-text-secondary text-xs">{item.addedDate}</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Link
              to={activeTab === 'featured' ? '/featured' : activeTab === 'trending' ? '/trending' : '/new-items'}
              className="bg-csm-bg-lighter text-white py-2 px-6 rounded-md hover:bg-csm-bg-darker transition-colors"
            >
              View All {activeTab === 'featured' ? 'Featured' : activeTab === 'trending' ? 'Trending' : 'New'} Items
            </Link>
          </div>
        </section>

        {/* Market Stats Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Market Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-4">
              <h3 className="text-csm-text-secondary mb-1">Total Items</h3>
              <p className="text-2xl text-white font-bold">12,450+</p>
              <p className="text-csm-text-secondary text-sm mt-1">Updated daily</p>
            </div>
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-4">
              <h3 className="text-csm-text-secondary mb-1">Active Trades</h3>
              <p className="text-2xl text-white font-bold">2,800+</p>
              <p className="text-csm-text-secondary text-sm mt-1">Last 24 hours</p>
            </div>
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-4">
              <h3 className="text-csm-text-secondary mb-1">Users Online</h3>
              <p className="text-2xl text-white font-bold">5,200+</p>
              <p className="text-csm-text-secondary text-sm mt-1">Right now</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-5">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-5 relative">
              <div className="absolute -top-3 -left-3 bg-csm-blue-accent rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-white font-semibold mb-2 mt-3">Browse Items</h3>
              <p className="text-csm-text-secondary">Explore thousands of CS:GO skins from knives to stickers. Use filters to find exactly what you're looking for.</p>
            </div>
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-5 relative">
              <div className="absolute -top-3 -left-3 bg-csm-blue-accent rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-white font-semibold mb-2 mt-3">Select & Purchase</h3>
              <p className="text-csm-text-secondary">Choose your favorite items, add them to cart, and complete your purchase using our secure payment methods.</p>
            </div>
            <div className="bg-csm-bg-card border border-csm-border rounded-xl p-5 relative">
              <div className="absolute -top-3 -left-3 bg-csm-blue-accent rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-white font-semibold mb-2 mt-3">Receive & Enjoy</h3>
              <p className="text-csm-text-secondary">Your items are delivered to your inventory instantly. Start playing with your new skins right away!</p>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-6">
          <div className="bg-csm-bg-card border border-csm-border rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0 md:mr-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Stay Updated</h2>
                <p className="text-csm-text-secondary">Subscribe to our newsletter for the latest updates on CS:GO skins, prices, and exclusive offers.</p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="flex flex-col sm:flex-row">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="bg-csm-bg-darker text-white py-2 px-4 rounded-md w-full sm:w-64 mb-2 sm:mb-0 sm:mr-2 focus:outline-none focus:ring-1 focus:ring-csm-blue-accent"
                  />
                  <button className="bg-csm-blue-accent text-white py-2 px-4 rounded-md hover:bg-csm-blue-hover transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default MainPage;
