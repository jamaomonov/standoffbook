import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import standoffbookLogo from '../assets/standoffbook-logo.png';
import LanguageSwitcher from './LanguageSwitcher';
import LoginModal from './LoginModal';
import { useAuth } from '../contexts/AuthContext';
import defaultAvatar from '../assets/default-avatar.jpg';
import { searchItems, type SearchResult } from '../api/search';
import { API_URL } from '../api/config';
import gradientIcon from '../assets/icons/gradient.png';
import stattrackIcon from '../assets/icons/stattrack.png';
import patternIcon from '../assets/icons/pattern.png';

// Icons for navigation
const ItemsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const ForumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// User icon component
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Category-specific icons
const KnivesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
  </svg>
);

const GlovesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const WeaponsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const StickersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const KeychainsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const OtherIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
  isLink: boolean;
  path?: string;
  items?: string[];
}

// Category data with icons
const categories: Category[] = [
  {
    id: 'knives',
    name: 'Knives',
    icon: <KnivesIcon />,
    isLink: true,
    path: '/knives'
  },
  {
    id: 'gloves',
    name: 'Gloves',
    icon: <GlovesIcon />,
    isLink: true,
    path: '/gloves'
  },
  {
    id: 'weapons',
    name: 'Weapons',
    icon: <WeaponsIcon />,
    isLink: true,
    path: '/weapons'
  },
  {
    id: 'stickers',
    name: 'Stickers',
    icon: <StickersIcon />,
    isLink: true,
    path: '/stickers'
  },
  {
    id: 'charms',
    name: 'Charms',
    icon: <KeychainsIcon />,
    isLink: true,
    path: '/charms'
  },
  {
    id: 'other',
    name: 'Other',
    icon: <OtherIcon />,
    isLink: false,
    items: ['Conatainers', 'Grafitties', 'Grenades', 'Fragments']
  }
];

// Добавляем вспомогательную функцию для определения иконок
const getItemIcons = (categoryName: string | null) => {
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

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Добавляем состояния для поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleDropdown = (categoryId: string) => {
    if (activeDropdown === categoryId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(categoryId);
    }
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Функция debounce
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Обновляем функцию поиска
  const searchItemsWithLoading = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchItems(query);
      setSearchResults(results);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Создаем debounced версию функции поиска
  const debouncedSearch = useCallback(
    debounce((query: string) => searchItemsWithLoading(query), 500),
    []
  );

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Обработчик клика по результату поиска
  const handleResultClick = (slug: string) => {
    navigate(`/item/${slug}`);
    setSearchQuery('');
    setShowResults(false);
    setIsSearchOpen(false);
  };

  // Закрываем результаты при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Функция для открытия фильтров
  const handleFilterClick = () => {
    // Если мы уже на странице фильтров, просто открываем модальное окно
    if (location.pathname === '/filter') {
      // Здесь нужно будет добавить глобальное состояние или контекст
      // для управления модальным окном фильтров
      // Пока просто навигируем
      return;
    }
    // Если мы на другой странице, переходим на страницу фильтров
    navigate('/filter');
  };

  return (
    <header className="bg-csm-bg-card border-b border-csm-border">
      {/* Top navigation bar */}
      <div className="py-2 border-b border-csm-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img src={standoffbookLogo} alt="standoffbook Logo" className="h-8 w-auto" />

              {/* Desktop Navigation - Updated categories */}
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="navbar-link flex items-center space-x-2">
                  <ItemsIcon />
                  <span className="text-white">{t('header.mobile.main')}</span>
                </Link>
                <Link to="/news" className="navbar-link flex items-center space-x-2">
                  <NewsIcon />
                  <span>{t('header.mobile.news')}</span>
                </Link>
                <Link to="/forum" className="navbar-link flex items-center space-x-2">
                  <ForumIcon />
                  <span>{t('header.mobile.forum')}</span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              {/* Desktop Search - обновляем с добавлением кнопки фильтров */}
              <div className="hidden md:block">
                <div className="relative search-container">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={t('header.search')}
                    className="bg-csm-bg-card text-white py-2 pl-10 pr-24 rounded border border-[#2e3038] w-64 focus:outline focus:text-white  hover:border-[#4e84ff] transition-colors"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8a92a1]">
                    <SearchIcon />
                  </div>
                  
                  {/* Добавляем разделитель и кнопку фильтров */}
                  <div className="absolute right-0 top-0 h-full flex items-center">
                    {isLoading ? (
                      <div className="px-3">
                        <svg className="animate-spin h-5 w-5 text-csm-blue-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : (
                      <>
                        <div className="w-px h-5 bg-[#2e3038] mx-2"></div>
                        <button
                          onClick={handleFilterClick}
                          className="p-2 text-[#8a92a1] hover:text-white transition-colors"
                          title="Open filters"
                        >
                          <FilterIcon />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Выпадающий список результатов */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-csm-bg-card border border-csm-border rounded-md shadow-lg overflow-hidden z-50">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.slug)}
                          className="w-full flex items-center space-x-3 p-3 rounded border border-[#2e3038] hover:border-csm-blue-accent transition-colors"
                        >
                          <div className="relative h-12">
                            <img src={API_URL + result.photo} alt={result.name} className="h-12 rounded" />
                            <div className={`absolute top-0 right-0 w-3 h-3 rounded-bl-[1.5rem] ${getRarityColor(result.rarity.name)}`}></div>
                            {getItemIcons(result.category?.name).length > 0 && (
                              <div className="absolute left-1 bottom-1 flex items-center space-x-1">
                                {getItemIcons(result.category?.name).map((icon, index) => (
                                  <img key={index} src={icon} alt="Item property" className="w-3 h-3 object-contain" />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-start flex-1 min-w-0">
                            <span className="text-white text-left truncate w-full">{result.name}</span>
                            <span className="text-csm-text-muted text-xs">{result.rarity.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Mobile Search Button - updated style */}
              <button
                onClick={toggleSearch}
                className="md:hidden text-[#8a92a1] hover:text-white p-2 transition-colors"
                aria-label="Search"
              >
                <SearchIcon />
              </button>

              {/* Login/Profile Button */}
              {currentUser ? (
                <div className="relative group">
                  <Link
                    to="/profile"
                    className="hidden md:block"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-csm-border hover:border-csm-blue-accent transition-colors">
                      <img
                        src={currentUser.avatar || defaultAvatar}
                        alt={currentUser.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Mobile Profile Link (in header, not menu) */}
                  <Link
                    to="/profile"
                    className="md:hidden"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-csm-border">
                      <img
                        src={currentUser.avatar || defaultAvatar}
                        alt={currentUser.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="hidden md:block bg-indigo-700 hover:bg-indigo-900 text-white py-2 px-4 rounded transition-colors"
                >
                  {t('header.login')}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden text-white p-2 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Categories Bar */}
      <div className="hidden md:block py-1 border-b border-csm-border bg-csm-bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 text-sm">
            {/* "Item types" as a simple text link with green color */}
            <h1
              className="py-2 text-[#4e84ff]"
            >
              ITEM TYPES
            </h1>

            {/* Categories */}
            {categories.map((category) => (
              <div key={category.id} className="relative">
                {category.isLink && category.path ? (
                  <Link
                    to={category.path}
                    className="flex items-center space-x-1 py-2 text-white hover:text-csm-blue-accent transition-colors"
                  >
                    <span className="mr-1">{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      className="flex items-center space-x-1 py-2 text-white hover:text-csm-blue-accent transition-colors"
                      onClick={() => toggleDropdown(category.id)}
                      aria-expanded={activeDropdown === category.id}
                      aria-haspopup="true"
                    >
                      <span className="mr-1">{category.icon}</span>
                      <span>{category.name}</span>
                    </button>

                    {/* Dropdown Menu только для Other */}
                    {activeDropdown === category.id && category.items && (
                      <div className="absolute left-0 top-full mt-1 w-48 bg-csm-bg-card rounded-md shadow-lg overflow-hidden z-20">
                        <div className="py-1">
                          {category.items.map((item, index) => (
                            <a
                              key={index}
                              href="#"
                              className="block px-4 py-2 text-sm text-csm-text-secondary hover:bg-csm-bg-lighter hover:text-white"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 pt-4 pb-6 px-4 bg-csm-bg-card">
          <nav className="flex flex-col space-y-5">
            {/* Mobile categories with icons */}
            <Link to="/" className="flex items-center space-x-2 navbar-link">
              <ItemsIcon />
              <span>{t('header.mobile.main')}</span>
            </Link>
            <Link to="/news" className="flex items-center space-x-2 navbar-link">
              <NewsIcon />
              <span>{t('header.mobile.news')}</span>
            </Link>
            <Link to="/forum" className="flex items-center space-x-2 navbar-link">
              <ForumIcon />
              <span>{t('header.mobile.forum')}</span>
            </Link>

            {/* Mobile Categories */}
            <div className="pt-2 border-t border-csm-border">

              {/* "Item types" as simple link */}
              <h1
                className="block py-2 text-[#4e84ff]"
              >
                ITEM TYPES
              </h1>

              {/* Categories */}
              {categories.map((category) => (
                <div key={category.id} className="mb-2 ml-2">
                  {category.isLink && category.path ? (
                    <Link
                      to={category.path}
                      className="flex items-center py-2 text-white hover:text-csm-blue-accent"
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        className="flex items-center justify-between w-full py-2 text-left text-white"
                        onClick={() => toggleDropdown(category.id)}
                        aria-expanded={activeDropdown === category.id}
                      >
                        <span className="flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                        <span className={`transform transition-transform ${activeDropdown === category.id ? 'rotate-180' : ''}`}>
                          <ChevronDownIcon />
                        </span>
                      </button>

                      {activeDropdown === category.id && category.items && (
                        <div className="pl-4 pt-2 pb-1">
                          {category.items.map((item, index) => (
                            <a
                              key={index}
                              href="#"
                              className="block py-2 text-sm text-csm-text-secondary hover:text-white"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Login/Logout Button */}
            {currentUser ? (
              <div className="pt-4 border-t border-csm-border">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-csm-bg-darker mr-3">
                    <img
                      src={currentUser.avatar || defaultAvatar}
                      alt={currentUser.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white font-medium">{currentUser.displayName}</div>
                    <div className="text-csm-text-secondary text-sm">@{currentUser.username}</div>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <Link to="/profile" className="text-white hover:text-csm-blue-accent transition-colors">
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-400 transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-indigo-700 hover:bg-indigo-900 text-white py-2 px-4 rounded flex justify-center items-center mt-4"
              >
                {t('header.login')}
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Mobile Search Modal - обновляем с добавлением кнопки фильтров */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col p-4">
          <div className="relative bg-csm-bg-card rounded-xl p-4 w-full max-w-lg mx-auto mt-16">
            <button
              onClick={toggleSearch}
              className="absolute top-3 right-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-white text-lg mb-4">{t('header.search')}</h3>
            <div className="relative search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('header.search_items')}
                className="bg-csm-bg-card text-white py-3 pl-10 pr-24 rounded border border-[#2e3038] w-full focus:outline-none focus:text-white hover:border-[#4e84ff] transition-colors"
                autoFocus
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8a92a1]">
                <SearchIcon />
              </div>

              {/* Добавляем разделитель и кнопку фильтров */}
              <div className="absolute right-0 top-0 h-full flex items-center">
                {isLoading ? (
                  <div className="px-3">
                    <svg className="animate-spin h-5 w-5 text-csm-blue-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <>
                    <div className="w-px h-5 bg-[#2e3038] mx-2"></div>
                    <button
                      onClick={handleFilterClick}
                      className="p-2 text-[#8a92a1] hover:text-white transition-colors"
                      title="Open filters"
                    >
                      <FilterIcon />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Результаты поиска для мобильной версии */}
            {showResults && searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full flex items-center space-x-3 p-3 rounded border border-[#2e3038] hover:border-csm-blue-accent transition-colors"
                  >
                    <div className="relative h-12">
                      <img src={API_URL + result.photo} alt={result.name} className="h-12 rounded" />
                      <div className={`absolute top-0 right-0 w-3 h-3 rounded-bl-[1.5rem] ${getRarityColor(result.rarity.name)}`}></div>
                      {getItemIcons(result.category?.name).length > 0 && (
                        <div className="absolute left-1 bottom-1 flex items-center space-x-1">
                          {getItemIcons(result.category?.name).map((icon, index) => (
                            <img key={index} src={icon} alt="Item property" className="w-3 h-3 object-contain" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="text-white text-left truncate w-full">{result.name}</span>
                      <span className="text-csm-text-muted text-xs">{result.rarity.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4">
              <p className="text-csm-text-secondary text-sm">{t('header.popular_searches')}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button className="bg-csm-bg-card border border-[#2e3038] rounded px-3 py-1 text-sm text-[#8a92a1] hover:text-white hover:border-[#4e84ff] transition-colors">AKR</button>
                <button className="bg-csm-bg-card border border-[#2e3038] rounded px-3 py-1 text-sm text-[#8a92a1] hover:text-white hover:border-[#4e84ff] transition-colors">AWM</button>
                <button className="bg-csm-bg-card border border-[#2e3038] rounded px-3 py-1 text-sm text-[#8a92a1] hover:text-white hover:border-[#4e84ff] transition-colors">USP</button>
                <button className="bg-csm-bg-card border border-[#2e3038] rounded px-3 py-1 text-sm text-[#8a92a1] hover:text-white hover:border-[#4e84ff] transition-colors">Karambit</button>
                <button className="bg-csm-bg-card border border-[#2e3038] rounded px-3 py-1 text-sm text-[#8a92a1] hover:text-white hover:border-[#4e84ff] transition-colors">Gloves</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;
