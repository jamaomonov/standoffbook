import React, { useState, useEffect } from 'react';
import MiniChart from './MiniChart';
import { getItemsStatistics, type ItemStatistic, type SortBy, type SortOrder } from '../api/statistics';
import { API_URL } from '../api/config';
import ResponsivePagination from 'react-responsive-pagination';
import '../styles/pagination.css';
import gradientIcon from '../assets/icons/gradient.png';
import stattrackIcon from '../assets/icons/stattrack.png';
import patternIcon from '../assets/icons/pattern.png';

const ITEMS_PER_PAGE = 10;

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

const ItemStatistics: React.FC = () => {
  const [items, setItems] = useState<ItemStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('per_week');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getItemsStatistics(currentPage, ITEMS_PER_PAGE, sortBy, sortOrder);
        setItems(response.items);
        setTotalPages(Math.ceil(response.total_items / ITEMS_PER_PAGE));
        setError(null);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sortBy, sortOrder, currentPage]);

  const handleSort = (newSortBy: SortBy) => {
    if (newSortBy === sortBy) {
      // Если тот же столбец, меняем направление сортировки
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      // Если новый столбец, устанавливаем desc по умолчанию
    setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const SortArrow: React.FC<{ isActive: boolean, order: SortOrder }> = ({ isActive, order }) => (
    <svg 
      className={`w-4 h-4 transition-transform ${isActive && order === 'asc' ? 'rotate-180' : ''}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M7 10L12 15L17 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <section className="mb-10">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Item Statistics</h2>
        
        {/* Кнопки переключения вида (только для мобильных) */}
        <div className="flex space-x-2 md:hidden">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              viewMode === 'table'
                ? 'bg-[#4e84ff] text-white'
                : 'bg-[#171923] text-csm-text-muted hover:text-white'
            }`}
          >
            Таблица
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              viewMode === 'cards'
                ? 'bg-[#4e84ff] text-white'
                : 'bg-[#171923] text-csm-text-muted hover:text-white'
            }`}
          >
            Карточки
          </button>
        </div>
      </div>

      {/* Desktop + Tablet Table (md and up) */}
      <div className="hidden md:block bg-csm-bg-card border border-csm-border rounded-xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-csm-bg-darker border-b border-csm-border">
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary text-sm lg:text-base">Item</th>
                <th 
                  className={`text-left p-3 lg:p-4 text-sm lg:text-base cursor-pointer hover:text-white ${
                    sortBy === 'price_now' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                  }`}
                  onClick={() => handleSort('price_now')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    <SortArrow isActive={sortBy === 'price_now'} order={sortOrder} />
                  </div>
                </th>
                <th 
                  className={`text-left p-3 lg:p-4 text-sm lg:text-base cursor-pointer hover:text-white ${
                    sortBy === 'per_day' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                  }`}
                  onClick={() => handleSort('per_day')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Per Day</span>
                    <SortArrow isActive={sortBy === 'per_day'} order={sortOrder} />
                  </div>
                </th>
                <th 
                  className={`text-left p-3 lg:p-4 text-sm lg:text-base cursor-pointer hover:text-white ${
                    sortBy === 'per_week' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                  }`}
                  onClick={() => handleSort('per_week')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Per Week</span>
                    <SortArrow isActive={sortBy === 'per_week'} order={sortOrder} />
                  </div>
                </th>
                <th 
                  className={`text-left p-3 lg:p-4 text-sm lg:text-base cursor-pointer hover:text-white ${
                    sortBy === 'per_month' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                  }`}
                  onClick={() => handleSort('per_month')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Per Month</span>
                    <SortArrow isActive={sortBy === 'per_month'} order={sortOrder} />
                  </div>
                </th>
                <th 
                  className={`text-left p-3 lg:p-4 text-sm lg:text-base cursor-pointer hover:text-white ${
                    sortBy === 'per_year' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                  }`}
                  onClick={() => handleSort('per_year')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Per Year</span>
                    <SortArrow isActive={sortBy === 'per_year'} order={sortOrder} />
                  </div>
                </th>
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary text-sm lg:text-base">Week Chart</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-csm-border hover:bg-csm-bg-darker transition-colors ${
                    index % 2 === 0 ? 'bg-csm-bg-card' : 'bg-csm-bg-darker/30'
                  }`}
                >
                  {/* Item Column */}
                  <td className="p-3 lg:p-4">
                    <a href={`/item/${item?.slug}`} className="hover:underline">
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <div className="relative">
                          <img
                            src={API_URL + item.photo}
                            alt={item.name}
                            className="w-20 lg:w-24 rounded object-cover"
                          />
                          <div className={`absolute top-0 right-0 w-2 lg:w-4 h-2 lg:h-4 rounded-bl-[2rem] ${getRarityColor(item.rarity)}`}></div>
                          {getItemIcons(item?.category).length > 0 && (
                            <div className="absolute left-1 bottom-1 flex items-center space-x-1">
                              {getItemIcons(item?.category).map((icon, index) => (
                                <img key={index} src={icon} alt="Item property" className="w-3 h-3 object-contain" />
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-white truncate max-w-[120px] lg:max-w-[200px] text-sm lg:text-base block">
                            {item.name}
                          </span>
                          <span className="text-csm-text-muted text-xs">
                            {item.collection}
                          </span>
                        </div>
                      </div>
                    </a>
                  </td>
                  {/* Current Price */}
                  <td className="p-3 lg:p-4">
                    <span className="text-csm-blue-accent text-sm lg:text-base">
                      {(item.price?.price_now || 0).toFixed(2)} G
                    </span>
                  </td>

                  {/* Per Day */}
                  <td className="p-3 lg:p-4">
                    <div className={`flex flex-col ${(item.price?.per_day_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="text-sm lg:text-base">
                        {(item.price?.per_day_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_day_percent || 0).toFixed(2)}%
                      </span>
                      <span className="text-xs text-csm-text-muted">
                        ({(item.price?.per_day_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_day_gold || 0).toFixed(2)} G)
                      </span>
                    </div>
                  </td>

                  {/* Per Week */}
                  <td className="p-3 lg:p-4">
                    <div className={`flex flex-col ${(item.price?.per_week_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="text-sm lg:text-base">
                        {(item.price?.per_week_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_week_percent || 0).toFixed(2)}%
                      </span>
                      <span className="text-xs text-csm-text-muted">
                        ({(item.price?.per_week_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_week_gold || 0).toFixed(2)} G)
                      </span>
                    </div>
                  </td>

                  {/* Per Month */}
                  <td className="p-3 lg:p-4">
                    <div className={`flex flex-col ${(item.price?.per_month_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="text-sm lg:text-base">
                        {(item.price?.per_month_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_month_percent || 0).toFixed(2)}%
                      </span>
                      <span className="text-xs text-csm-text-muted">
                        ({(item.price?.per_month_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_month_gold || 0).toFixed(2)} G)
                      </span>
                    </div>
                  </td>

                  {/* Per Year */}
                  <td className="p-3 lg:p-4">
                    <div className={`flex flex-col ${(item.price?.per_year_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="text-sm lg:text-base">
                        {(item.price?.per_year_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_year_percent || 0).toFixed(2)}%
                      </span>
                      <span className="text-xs text-csm-text-muted">
                        ({(item.price?.per_year_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_year_gold || 0).toFixed(2)} G)
                      </span>
                    </div>
                  </td>

                  {/* Week Chart */}
                  <td className="p-3 lg:p-4">
                    <div className="flex justify-left">
                      <MiniChart 
                        data={(item.week_data || []).map(d => ({
                          date: d.Date,
                          price: parseFloat(d.purchase_price || '0')
                        }))} 
                        width={80} 
                        height={40} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden mt-4">
        {viewMode === 'table' ? (
          <div className="bg-csm-bg-card border border-csm-border rounded-xl overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-csm-bg-darker border-b border-csm-border">
                    <th className="text-left p-4 text-csm-text-secondary text-sm whitespace-nowrap">Item</th>
                    <th 
                      className={`text-left p-4 text-csm-text-secondary text-sm cursor-pointer hover:text-white whitespace-nowrap ${
                        sortBy === 'price_now' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                      }`}
                      onClick={() => handleSort('price_now')}
                    >
                      <div className="flex items-center space-x-1 pl-8">
                        <span>Price</span>
                        <SortArrow isActive={sortBy === 'price_now'} order={sortOrder} />
                      </div>
                    </th>
                    <th 
                      className={`text-left p-4 text-sm cursor-pointer hover:text-white whitespace-nowrap ${
                        sortBy === 'per_day' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                      }`}
                      onClick={() => handleSort('per_day')}
                    >
                      <div className="flex items-center space-x-1 pl-8">
                        <span>Per Day</span>
                        <SortArrow isActive={sortBy === 'per_day'} order={sortOrder} />
                      </div>
                    </th>
                    <th 
                      className={`text-left p-4 text-sm cursor-pointer hover:text-white whitespace-nowrap ${
                        sortBy === 'per_week' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                      }`}
                      onClick={() => handleSort('per_week')}
                    >
                      <div className="flex items-center space-x-1 pl-8">
                        <span>Per Week</span>
                        <SortArrow isActive={sortBy === 'per_week'} order={sortOrder} />
                      </div>
                    </th>
                    <th 
                      className={`text-left p-4 text-sm cursor-pointer hover:text-white whitespace-nowrap ${
                        sortBy === 'per_month' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                      }`}
                      onClick={() => handleSort('per_month')}
                    >
                      <div className="flex items-center space-x-1 pl-8">
                        <span>Per Month</span>
                        <SortArrow isActive={sortBy === 'per_month'} order={sortOrder} />
                      </div>
                    </th>
                    <th 
                      className={`text-left p-4 text-sm cursor-pointer hover:text-white whitespace-nowrap ${
                        sortBy === 'per_year' ? 'text-[#4e84ff]' : 'text-csm-text-secondary'
                      }`}
                      onClick={() => handleSort('per_year')}
                    >
                      <div className="flex items-center space-x-1 pl-8">
                        <span>Per Year</span>
                        <SortArrow isActive={sortBy === 'per_year'} order={sortOrder} />
                      </div>
                    </th>
                    <th className="text-left p-4 text-csm-text-secondary text-sm whitespace-nowrap pl-8">Week Chart</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-csm-border hover:bg-csm-bg-darker transition-colors ${
                        index % 2 === 0 ? 'bg-csm-bg-card' : 'bg-csm-bg-darker/30'
                      }`}
                    >
                      <td className="p-4 min-w-[280px]">
                        <a href={`/item/${item?.slug}`} className="hover:underline">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={API_URL + item.photo}
                                alt={item.name}
                                className="w-20 rounded object-contain"
                              />
                              <div className={`absolute top-0 right-0 w-3 lg:w-4 h-3 lg:h-4 rounded-bl-[2rem] ${getRarityColor(item.rarity)}`}></div>
                              {getItemIcons(item?.category).length > 0 && (
                                <div className="absolute left-1 bottom-1 flex items-center space-x-1">
                                  {getItemIcons(item?.category).map((icon, index) => (
                                    <img key={index} src={icon} alt="Item property" className="w-3 h-3 object-contain" />
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-[180px]">
                              <span className="text-white text-sm block truncate">
                                {item.name}
                              </span>
                              <span className="text-csm-text-muted text-xs">
                                {item.collection}
                              </span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td className="p-4 pl-8 whitespace-nowrap">
                        <span className="text-csm-blue-accent text-sm">
                          {(item.price?.price_now || 0).toFixed(2)} G
                        </span>
                      </td>
                      <td className="p-4 pl-8 whitespace-nowrap">
                        <div className={`flex flex-col ${(item.price?.per_day_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className={`text-sm ${(item.price?.per_day_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(item.price?.per_day_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_day_percent || 0).toFixed(2)}%
                          </div>
                          <div className="text-xs text-csm-text-muted">
                            ({(item.price?.per_day_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_day_gold || 0).toFixed(2)} G)
                          </div>
                        </div>
                      </td>
                      <td className="p-4 pl-8 whitespace-nowrap">
                        <div className={`flex flex-col ${(item.price?.per_week_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className={`text-sm ${(item.price?.per_week_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(item.price?.per_week_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_week_percent || 0).toFixed(2)}%
                          </div>
                          <div className="text-xs text-csm-text-muted">
                            ({(item.price?.per_week_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_week_gold || 0).toFixed(2)} G)
                          </div>
                        </div>
                      </td>
                      <td className="p-4 pl-8 whitespace-nowrap">
                        <div className={`flex flex-col ${(item.price?.per_month_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className={`text-sm ${(item.price?.per_month_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(item.price?.per_month_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_month_percent || 0).toFixed(2)}%
                          </div>
                          <div className="text-xs text-csm-text-muted">
                            ({(item.price?.per_month_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_month_gold || 0).toFixed(2)} G)
                          </div>
                        </div>
                      </td>
                      <td className="p-4 pl-8 whitespace-nowrap">
                        <div className={`flex flex-col ${(item.price?.per_year_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className={`text-sm ${(item.price?.per_year_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(item.price?.per_year_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_year_percent || 0).toFixed(2)}%
                          </div>
                          <div className="text-xs text-csm-text-muted">
                            ({(item.price?.per_year_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_year_gold || 0).toFixed(2)} G)
                          </div>
                        </div>
                      </td>
                      <td className="p-4 pl-8">
                        <div className="flex justify-left">
                          <MiniChart 
                            data={(item.week_data || []).map(d => ({
                              date: d.Date,
                              price: parseFloat(d.purchase_price || '0')
                            }))} 
                            width={60} 
                            height={30} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 w-max">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-csm-bg-card border border-csm-border rounded-xl p-4 w-72 flex-shrink-0"
              >
                {/* Item Header */}
                <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                  <img
                    src={API_URL + item.photo}
                    alt={item.name}
                    className="w-32 rounded-lg object-cover"
                  />
                        <div className={`absolute top-0 right-0 w-5 h-5 rounded-bl-[2rem] ${getRarityColor(item.rarity)}`}></div>
                        {getItemIcons(item?.category).length > 0 && (
                          <div className="absolute left-1 bottom-1 flex items-center space-x-1">
                            {getItemIcons(item?.category).map((icon, index) => (
                              <img key={index} src={icon} alt="Item property" className="w-3 h-3 object-contain" />
                            ))}
                          </div>
                        )}
                      </div>
                  <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm truncate">{item.name}</h3>
                    <span className="text-csm-text-muted text-xs">{item.collection}</span>
                        <span className="text-csm-blue-accent text-lg block">
                      {item.price.price_now.toFixed(2)} G
                    </span>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="bg-csm-bg-darker rounded-lg p-3 mb-4">
                  <div className="text-csm-text-secondary text-xs mb-2">Week Chart</div>
                  <div className="flex justify-left">
                    <MiniChart 
                      data={(item.week_data || []).map(d => ({
                        date: d.Date,
                        price: parseFloat(d.purchase_price || '0')
                      }))} 
                      width={140} 
                      height={60} 
                    />
                  </div>
                </div>

                {/* Price Changes Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Day</div>
                    <div className={`text-sm ${(item.price?.per_day_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.price?.per_day_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_day_percent || 0).toFixed(2)}%
                    </div>
                    <div className="text-xs text-csm-text-muted">
                      ({(item.price?.per_day_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_day_gold || 0).toFixed(2)} G)
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Week</div>
                    <div className={`text-sm ${(item.price?.per_week_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.price?.per_week_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_week_percent || 0).toFixed(2)}%
                    </div>
                    <div className="text-xs text-csm-text-muted">
                      ({(item.price?.per_week_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_week_gold || 0).toFixed(2)} G)
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Month</div>
                    <div className={`text-sm ${(item.price?.per_month_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.price?.per_month_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_month_percent || 0).toFixed(2)}%
                    </div>
                    <div className="text-xs text-csm-text-muted">
                      ({(item.price?.per_month_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_month_gold || 0).toFixed(2)} G)
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Year</div>
                    <div className={`text-sm ${(item.price?.per_year_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.price?.per_year_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_year_percent || 0).toFixed(2)}%
                    </div>
                    <div className="text-xs text-csm-text-muted">
                      ({(item.price?.per_year_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_year_gold || 0).toFixed(2)} G)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-2">
          <div className="text-csm-text-secondary text-xs flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Swipe to see more
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Пагинация */}
      <div className="mt-6">
        <ResponsivePagination
          total={totalPages}
          current={currentPage}
          onPageChange={handlePageChange}
          previousLabel="←"
          nextLabel="→"
        />
      </div>
    </section>
  );
};

export default ItemStatistics;
