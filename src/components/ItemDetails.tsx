import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import WeaponStats from './WeaponStats';
import DamageStats from './DamageStats';
import PriceHistoryChart from './PriceHistoryChart';
import { getItemDetails, type ItemDetails } from '../api/item';
import { API_URL } from '../api/config';
import uspInGameView from '../assets/usp-ingame-view.webp';
import gradientIcon from '../assets/icons/gradient.png';
import stattrackIcon from '../assets/icons/stattrack.png';
import patternIcon from '../assets/icons/pattern.png';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline fill-yellow-400" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const PriceChange: React.FC<{ value: number | undefined; percentage: number | undefined }> = ({ value, percentage }) => {
  if (value === undefined || value === null || percentage === undefined || percentage === null) {
    return <div className="text-csm-text-muted">—</div>;
  }
  
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
  const prefix = isPositive ? '+' : '';

  return (
    <div className={colorClass}>
      <div className="text-sm lg:text-base">
        <Icon /> {value >= 0 ? '+' : ''}{percentage.toFixed(2)}%
      </div>
      <div className="text-xs text-csm-text-muted">
        ({value >= 0 ? '+' : ''}{value.toFixed(2)} G)
      </div>
    </div>
  );
};

// Добавляем вспомогательную функцию для определения иконок
const getItemIcons = (categoryName: string | undefined) => {
  if (!categoryName) return [];
  
  switch (categoryName) {
    case 'StatTrack':
      return [stattrackIcon];
    case 'Pattern':
      return [patternIcon];
    case 'Gradient':
      return [gradientIcon];
    case 'Pattern and StatTrack':
      return [patternIcon, stattrackIcon];
    case 'Gradient and StatTrack':
      return [gradientIcon, stattrackIcon];
    case 'Regular':
    default:
      return [];
  }
};

// Функция для определения цвета по редкости
const getRarityColor = (rarityName: string) => {
  switch (rarityName.toLowerCase()) {
    case "common":
      return "bg-gradient-to-r from-[#b0b0b0] to-[#5a5a5a]";
    case "uncommon":
      return "bg-gradient-to-r from-[#6bd1ff] to-[#247aa5]"; // голубой, как в игре
    case "rare":
      return "bg-gradient-to-r from-[#3f74ff] to-[#0d1d66]"; // синий, ближе к глубокому индиго
    case "epic":
      return "bg-gradient-to-r from-[#a649ff] to-[#4e1a99]"; // фиолетовый, насыщенный
    case "legendary":
      return "bg-gradient-to-r from-[#ff4c91] to-[#94164d]"; // розово-красный, ближе к цвету легендарки
    case "arcane":
      return "bg-gradient-to-r from-[#ff3434] to-[#7a0000]"; // ярко-красный с тёмным переходом
    case "nameless":
      return "bg-gradient-to-b from-yellow-600 to-amber-800";
    default:
      return "bg-transparent";
  }
};

const ItemDetails: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  
  // Все состояния объявляем в начале компонента
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7D' | '1M' | '3M' | '6M' | '1Y' | 'All'>('7D');
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

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


  // Функции-обработчики
  const openFullscreen = useCallback((image: {src: string, alt: string}) => {
    setSelectedImage(image);
  }, []);

  const closeFullscreen = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Эффект для загрузки данных
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!slug) {
        console.log('No slug provided');
        return;
      }
      
      console.log('Fetching details for slug:', slug);
      try {
        setIsLoading(true);
        const data = await getItemDetails(slug);
        console.log('Received data:', JSON.stringify(data, null, 2));
        setItemDetails(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to load item details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [slug]);

  // Эффект для модального окна
  useEffect(() => {
    if (selectedImage) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedImage]);

  // Эффект для клавиши Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeFullscreen();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage, closeFullscreen]);

  if (isLoading) {
    return <div className="container mx-auto py-8 text-white">Loading...</div>;
  }

  if (error || !itemDetails || !itemDetails.type || !itemDetails.rarity || !itemDetails.collection) {
    return <div className="container mx-auto py-8 text-red-500">{error || 'Failed to load item details'}</div>;
  }

  return (
    <div className="py-6 px-3 md:py-8 md:px-0">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center mb-4 md:mb-6 text-sm overflow-x-auto whitespace-nowrap">
          <a href="/" className="text-csm-text-secondary hover:text-white">{t('header.main')}</a>
          <span className="mx-2 text-csm-text-secondary">/</span>
          <a href={`/${itemDetails.type.name.toLowerCase()}`} className="text-csm-text-secondary hover:text-white">{itemDetails.type.name}</a>
          <span className="mx-2 text-csm-text-secondary">/</span>
          <span className="text-csm-text-secondary">{itemDetails.name}</span>
        </div>

        {/* Item Header */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Item Image */}
          <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center rounded-xl p-6">
            <div className="relative">
              <img
                src={API_URL + itemDetails.photo}
                alt={itemDetails.name}
                className="max-w-full h-auto max-h-52 md:max-h-64 rounded-xl"
              />
              <div className={`absolute top-0 right-0 w-11 md:w-15 h-11 md:h-15 rounded-bl-[3rem] ${getRarityColor(itemDetails.rarity.name)}`}></div>
              {getItemIcons(itemDetails.category?.name).length > 0 && (
                <div className="absolute left-4 bottom-3 flex items-center space-x-1">
                  {getItemIcons(itemDetails.category?.name).map((icon, index) => (
                    <img key={index} src={icon} alt="Item property" className="w-7 h-7 object-contain" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Item Info */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <div className="bg-csm-bg-card rounded-xl p-4 md:p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h1 className="text-xl md:text-2xl lg:text-3xl text-white mt-3">{itemDetails.name}</h1>
                  <h6 className="text-csm-text-muted mt-1">{itemDetails.collection.name}</h6>
                </div>

                <div className="grid grid-cols-2 gap-5 md:gap-5 mb-4">
                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">{t('itemDetails.community_rating')}</h3>
                    <div className="text-white">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <span className="text-csm-text-secondary inline-block ml-1">4.31</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">Current Price</h3>
                    <div className="text-yellow-300">{itemDetails.prices?.price_now} G</div>
                  </div>

                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">Day</h3>
                    <PriceChange 
                      value={itemDetails.prices?.per_day_gold} 
                      percentage={itemDetails.prices?.per_day_percent} 
                    />
                  </div>

                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">{t('itemDetails.from_last_week')}</h3>
                    <PriceChange 
                      value={itemDetails.prices?.per_week_gold} 
                      percentage={itemDetails.prices?.per_week_percent}
                    />
                  </div>

                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">{t('itemDetails.from_last_month')}</h3>
                    <PriceChange 
                      value={itemDetails.prices?.per_month_gold} 
                      percentage={itemDetails.prices?.per_month_percent}
                    />
                  </div>

                  <div>
                    <h3 className="text-csm-text-muted text-xs md:text-sm">Year</h3>
                    <PriceChange 
                      value={itemDetails.prices?.per_year_gold} 
                      percentage={itemDetails.prices?.per_year_percent}
                    />
                  </div>

                </div>

                {/* <div className="mt-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mt-4">
                    <button className="btn-primary rounded-md">{t('itemDetails.view_in_game')}</button>
                    <button className="btn-secondary rounded-md">{t('itemDetails.check_float')}</button>
                    <button className="btn-secondary rounded-md">{t('itemDetails.add_to_favorites')}</button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Price History */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('priceHistory.title')}</h2>
          <div className="bg-csm-bg-card rounded-xl p-4 md:p-6">
            <PriceHistoryChart height={400} item_id={itemDetails.id} item_name={itemDetails.name} />
          </div>
        </div>

        <h6 className="text-csm-text-muted text-xs text-center mt-4 md:text-sm">Данные исключительно берутся из <a href="https://standoff-2.com/" target="_blank" className="text-indigo-700">standoff-2.com</a></h6>

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

        {/* Characteristics */}
        {itemDetails.weapon && (
          <div className="mb-6 md:mb-8 mt-5">
            <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('characteristics.title')}</h2>
            <div className="bg-csm-bg-card rounded-xl p-4 md:p-6">
              {/* Team */}
              <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
                <span className="text-csm-text-muted text-base md:text-lg">{t('characteristics.team')}</span>
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
                <span className="text-csm-text-muted text-base md:text-lg ">{t('characteristics.magazine_capacity')}</span>
                <span className="text-white text-base md:text-lg font-semibold">{itemDetails.weapon?.ammo}</span>
              </div>

              {/* Rate of Fire */}
              <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
                <span className="text-csm-text-muted text-base md:text-lg">{t('characteristics.rate_of_fire')}</span>
                <span className="text-white text-base md:text-lg font-semibold">{itemDetails.weapon?.fire_rate}</span>
              </div>

              {/* Movement Speed */}
              <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
                <span className="text-csm-text-muted text-base md:text-lg">{t('characteristics.movement_speed')}</span>
                <span className="text-white text-base md:text-lg font-semibold">215 RP</span>
              </div>

              {/* Kill Reward */}
              <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-csm-border">
                <span className="text-csm-text-muted text-base md:text-lg">{t('characteristics.kill_reward')}</span>
                <span className="text-white text-base md:text-lg font-semibold">null</span>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4">
                <span className="text-csm-text-muted text-base md:text-lg">{t('characteristics.price')}</span>
                <span className="text-white text-base md:text-lg font-semibold">$ {itemDetails.weapon?.cost}</span>
              </div>
            </div>
          </div>
        )}

        {/* Damage Stats Section with real data */}
        {itemDetails.weapon?.damage_info && <DamageStats damageInfo={itemDetails.weapon.damage_info} />}

        {/* Weapon Stats (Shooting Pattern) */}
        {itemDetails.weapon && <WeaponStats />}

        {/* Gallery - only show if there are images */}
        {itemDetails?.gallery.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('gallery.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {itemDetails?.gallery.map((image, index) => (
                <div
                  key={index}
                  className="gallery-card rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <div className="gallery-image-container">
                    <img
                      src={API_URL + image}
                      alt={`${itemDetails.name} - Gallery ${index + 1}`}
                      className="gallery-image aspect-[16/9]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Skins */}
        {/* <div className="mb-6 md:mb-8">
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
        </div> */}

        {/* Description */}
        {/* <div className="mb-6 md:mb-8">
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
          </div> */}
        {/* </div> */}
      </div>

      {/* Fullscreen Image Modal */}
      
    </div>
  );
};

export default ItemDetails;
