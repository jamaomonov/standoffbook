import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import WeaponStats from './WeaponStats';
import DamageStats from './DamageStats';
import PriceHistoryChart from './PriceHistoryChart';
import uspInGameView from '../assets/usp-ingame-view.webp';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline fill-yellow-400" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ItemDetails: React.FC = () => {
  const { t } = useTranslation();

  // Add state for the price chart time range
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7D' | '1M' | '3M' | '6M' | '1Y' | 'All'>('7D');

  // Gallery images - all using the same in-game view image
  const galleryImages = [
    {
      id: 1,
      src: uspInGameView,
      alt: "USP-S In-Game View"
    },
    {
      id: 2,
      src: uspInGameView,
      alt: "USP-S In-Game View"
    },
    {
      id: 3,
      src: uspInGameView,
      alt: "USP-S In-Game View"
    },
    {
      id: 4,
      src: uspInGameView,
      alt: "USP-S In-Game View"
    }
  ];

  // State for fullscreen image modal
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

  // Handle image click for fullscreen view
  const openFullscreen = (image: {src: string, alt: string}) => {
    setSelectedImage(image);
  };

  // Close fullscreen modal
  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  // Add/remove modal-open class to body when modal opens/closes
  useEffect(() => {
    if (selectedImage) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup function to ensure class is removed when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedImage]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeFullscreen();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage]);

  return (
    <div className="py-6 px-3 md:py-8 md:px-0">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center mb-4 md:mb-6 text-sm overflow-x-auto whitespace-nowrap">
          <a href="/" className="text-csm-text-secondary hover:text-white">{t('header.main')}</a>
          <span className="mx-2 text-csm-text-secondary">/</span>
          <a href="/weapons/usp-s" className="text-csm-text-secondary hover:text-white">USP-S</a>
          <span className="mx-2 text-csm-text-secondary">/</span>
          <a href="/item/usp-s-royal-blue" className="text-csm-text-secondary hover:text-white">USP-S | Royal Blue</a>
        </div>

        {/* Item Header */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Item Image - Without Background */}
          <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center item-image-container">
            <img
              src="/src/assets/usp-royal-blue-transparent.png"
              alt="USP-S Royal Blue (Field-Tested)"
              className="max-w-full h-auto max-h-52 md:max-h-64"
            />
          </div>

          {/* Item Info */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <div className="bg-csm-bg-card rounded-xl p-4 md:p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-csm-blue-primary text-white text-xs rounded-full mb-2">
                    {t('itemDetails.industrial_grade')}
                  </span>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">USP-S | Royal Blue (Field-Tested)</h1>
                  <p className="text-csm-text-secondary mt-2 text-sm md:text-base">
                    {t('itemDetails.fan_favorite')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">{t('itemDetails.community_rating')}</h3>
                    <div className="text-white">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <span className="text-csm-text-secondary inline-block ml-1">4.31</span>
                      <span className="text-csm-text-muted text-xs ml-2">695 {t('itemDetails.votes')}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">{t('itemDetails.from_last_week')}</h3>
                    <div className="text-red-500">- 8.70 (-34.83%)</div>
                  </div>

                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">{t('itemDetails.from_last_month')}</h3>
                    <div className="text-red-500">- 3.51 (-17.75%)</div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mt-4">
                    <button className="btn-primary rounded-md">{t('itemDetails.view_in_game')}</button>
                    <button className="btn-secondary rounded-md">{t('itemDetails.check_float')}</button>
                    <button className="btn-secondary rounded-md">{t('itemDetails.add_to_favorites')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price History */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('priceHistory.title')}</h2>
          <div className="card rounded-xl p-4 md:p-6">
            {/* Replace placeholder with actual chart */}
            <PriceHistoryChart height={400} />

            {/* Time period buttons */}
            <div className="flex flex-wrap justify-center mt-4 gap-1 md:gap-0">
              <button
                className={`px-3 py-2 md:px-4 md:py-2 md:mx-2 rounded-md ${selectedTimeRange === '7D'
                  ? 'bg-csm-blue-primary text-white'
                  : 'bg-csm-bg-lighter text-csm-text-secondary hover:bg-csm-blue-primary hover:text-white'}`}
                onClick={() => setSelectedTimeRange('7D')}
              >
                7D
              </button>
              <button
                className={`px-3 py-2 md:px-4 md:py-2 md:mx-2 rounded-md ${selectedTimeRange === '1M'
                  ? 'bg-csm-blue-primary text-white'
                  : 'bg-csm-bg-lighter text-csm-text-secondary hover:bg-csm-blue-primary hover:text-white'}`}
                onClick={() => setSelectedTimeRange('1M')}
              >
                1M
              </button>
              <button
                className={`px-3 py-2 md:px-4 md:py-2 md:mx-2 rounded-md ${selectedTimeRange === '3M'
                  ? 'bg-csm-blue-primary text-white'
                  : 'bg-csm-bg-lighter text-csm-text-secondary hover:bg-csm-blue-primary hover:text-white'}`}
                onClick={() => setSelectedTimeRange('3M')}
              >
                3M
              </button>
              <button
                className={`px-3 py-2 md:px-4 md:py-2 md:mx-2 rounded-md ${selectedTimeRange === '6M'
                  ? 'bg-csm-blue-primary text-white'
                  : 'bg-csm-bg-lighter text-csm-text-secondary hover:bg-csm-blue-primary hover:text-white'}`}
                onClick={() => setSelectedTimeRange('6M')}
              >
                6M
              </button>
              <button
                className={`px-3 py-2 md:px-4 md:py-2 md:mx-2 rounded-md ${selectedTimeRange === '1Y'
                  ? 'bg-csm-blue-primary text-white'
                  : 'bg-csm-bg-lighter text-csm-text-secondary hover:bg-csm-blue-primary hover:text-white'}`}
                onClick={() => setSelectedTimeRange('1Y')}
              >
                1Y
              </button>
              <button
                className={`px-3 py-2 md:px-4 md:py-2 md:mx-2 rounded-md ${selectedTimeRange === 'All'
                  ? 'bg-csm-blue-primary text-white'
                  : 'bg-csm-bg-lighter text-csm-text-secondary hover:bg-csm-blue-primary hover:text-white'}`}
                onClick={() => setSelectedTimeRange('All')}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Characteristics */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('characteristics.title')}</h2>
          <div className="bg-[#171923] rounded-xl overflow-hidden">
            {/* Team */}
            <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
              <span className="text-csm-text-secondary text-base md:text-lg">{t('characteristics.team')}</span>
              <div className="flex items-center">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-8 md:h-8">
                  <path d="M20.9997 8L11.8943 12.2484L16.3314 16L20.9997 8Z" fill="#F7C729"/>
                  <path d="M5.33301 16.9657L11.8943 12.2484L16.3314 16L5.33301 24L5.33301 16.9657Z" fill="#F7C729"/>
                  <path d="M26.6663 24L16.3314 16L20.9997 8L26.6663 16.6371V24Z" fill="#F7C729"/>
                  <path d="M16.3314 16L5.33301 24H26.6663L16.3314 16Z" fill="#F7C729"/>
                </svg>
              </div>
            </div>

            {/* Magazine Capacity */}
            <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
              <span className="text-csm-text-secondary text-base md:text-lg">{t('characteristics.magazine_capacity')}</span>
              <span className="text-white text-base md:text-lg font-semibold">30/90</span>
            </div>

            {/* Rate of Fire */}
            <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
              <span className="text-csm-text-secondary text-base md:text-lg">{t('characteristics.rate_of_fire')}</span>
              <span className="text-white text-base md:text-lg font-semibold">600</span>
            </div>

            {/* Movement Speed */}
            <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
              <span className="text-csm-text-secondary text-base md:text-lg">{t('characteristics.movement_speed')}</span>
              <span className="text-white text-base md:text-lg font-semibold">215 RPM</span>
            </div>

            {/* Kill Reward */}
            <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
              <span className="text-csm-text-secondary text-base md:text-lg">{t('characteristics.kill_reward')}</span>
              <span className="text-white text-base md:text-lg font-semibold">G 300.00</span>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4">
              <span className="text-csm-text-secondary text-base md:text-lg">{t('characteristics.price')}</span>
              <span className="text-white text-base md:text-lg font-semibold">G 2700.00</span>
            </div>
          </div>
        </div>

        {/* Damage Stats Section */}
        <DamageStats />

        {/* Weapon Stats (Shooting Pattern) */}
        <WeaponStats />

        {/* Gallery */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('gallery.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="gallery-card rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openFullscreen(image)}
              >
                <div className="gallery-image-container">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="gallery-image aspect-[16/9]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Skins */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('similarSkins.title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-csm-bg-card border border-csm-border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-b from-csm-bg-lighter to-csm-blue-primary/20 p-2 md:p-3 flex items-center justify-center h-24 md:h-32">
                  <img src="/src/assets/usp-royal-blue.webp" alt="Similar skin" className="max-w-full h-auto" />
                </div>
                <div className="p-2 md:p-3">
                  <h3 className="text-white text-xs md:text-sm font-medium truncate">USP-S | Neo-Noir</h3>
                  <p className="text-csm-text-secondary text-xs">{t('similarSkins.factory_new')}</p>
                  <p className="text-csm-blue-accent text-xs md:text-sm font-medium mt-1">G 32.84</p>
                  <button className="bg-csm-blue-accent text-white text-xs w-full py-1 rounded-md mt-2 hover:bg-csm-blue-hover">
                    {t('similarSkins.view')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button className="btn-secondary rounded-lg">{t('similarSkins.show_all')}</button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('description.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="card rounded-xl">
              <h3 className="text-white font-semibold mb-2 md:mb-3 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-csm-blue-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {t('description.overview.title')}
              </h3>
              <p className="text-csm-text-secondary text-xs md:text-sm">
                {t('description.overview.content')}
              </p>
            </div>

            <div className="card rounded-xl">
              <h3 className="text-white font-semibold mb-2 md:mb-3 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-csm-blue-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                {t('description.rarity.title')}
              </h3>
              <p className="text-csm-text-secondary text-xs md:text-sm">
                {t('description.rarity.content')}
              </p>
            </div>

            <div className="card rounded-xl">
              <h3 className="text-white font-semibold mb-2 md:mb-3 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-csm-blue-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {t('description.history.title')}
              </h3>
              <p className="text-csm-text-secondary text-xs md:text-sm">
                {t('description.history.content')}
              </p>
            </div>

            <div className="card rounded-xl">
              <h3 className="text-white font-semibold mb-2 md:mb-3 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-csm-blue-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {t('description.popularity.title')}
              </h3>
              <p className="text-csm-text-secondary text-xs md:text-sm">
                {t('description.popularity.content')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fullscreen-modal"
          onClick={closeFullscreen}
        >
          <div className="relative max-w-7xl max-h-screen">
            <button
              className="modal-close-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                closeFullscreen();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="fullscreen-image"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
