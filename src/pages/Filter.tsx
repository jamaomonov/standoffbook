import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';
import CustomSelect from '../components/CustomSelect';
import MobileFilterModal from '../components/MobileFilterModal';
import { getFilterParams, getFilteredItems } from '../api/filter';
import { API_URL } from '../api/config';
import gradientIcon from '../assets/icons/gradient.png';
import stattrackIcon from '../assets/icons/stattrack.png';
import patternIcon from '../assets/icons/pattern.png';

interface FilterOption {
  id: number;
  name: string;
}

interface FilteredItem {
  id: number;
  item_name: string;
  slug: string;
  photo: string;
  rarity: string;
  category: string;
  collection: string;
}

const getItemIcons = (categoryName: string | null | undefined) => {
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

const FilterPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<FilterOption | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<FilterOption | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FilterOption | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<FilterOption | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<FilterOption | null>(null);
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isItemsLoading, setIsItemsLoading] = useState(false);

  // Состояния для фильтров из API
  const [filterOptions, setFilterOptions] = useState<{
    types: FilterOption[];
    collections: FilterOption[];
    rarities: FilterOption[];
    categories: FilterOption[];
    weapons: FilterOption[];
  }>({
    types: [],
    collections: [],
    rarities: [],
    categories: [],
    weapons: [],
  });

  // Загрузка фильтров из API
  useEffect(() => {
    const abortController = new AbortController();

    const fetchFilters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getFilterParams(abortController.signal);
        setFilterOptions(data);
        
        setIsItemsLoading(true);
        const response = await getFilteredItems({
          page: 1,
          page_size: 12
        }, abortController.signal);
        
        setTotalItems(response.total);
        setFilteredItems(response.items);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Произошла ошибка при загрузке данных');
        }
      } finally {
        setIsLoading(false);
        setIsItemsLoading(false);
      }
    };

    fetchFilters();

    return () => {
      abortController.abort();
    };
  }, []);

  // Сохраняем предыдущие значения фильтров для возможности отмены
  const [previousFilters, setPreviousFilters] = useState({
    type: null as FilterOption | null,
    rarity: null as FilterOption | null,
    category: null as FilterOption | null,
    collection: null as FilterOption | null,
    weapon: null as FilterOption | null
  });

  // Функция для сброса фильтров к предыдущим значениям
  const handleCancel = () => {
    setSelectedType(previousFilters.type);
    setSelectedRarity(previousFilters.rarity);
    setSelectedCategory(previousFilters.category);
    setSelectedCollection(previousFilters.collection);
    setSelectedWeapon(previousFilters.weapon);
    setIsFiltersVisible(false);
    setIsMobileModalOpen(false);
  };

  // Загрузка предметов при изменении страницы
  useEffect(() => {
    if (isLoading) return;

    const loadItems = async () => {
      try {
        setIsItemsLoading(true);
        setError(null);
        
        const response = await getFilteredItems({
          type_id: selectedType?.id,
          rarity_id: selectedRarity?.id,
          category_id: selectedCategory?.id,
          collection_id: selectedCollection?.id,
          weapon_id: selectedWeapon?.id,
          page: currentPage,
          page_size: 12
        });

        setTotalItems(response.total);
        setFilteredItems(response.items);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Произошла ошибка при загрузке предметов');
        }
      } finally {
        setIsItemsLoading(false);
      }
    };

    loadItems();
  }, [currentPage]);

  // Функция для применения фильтров
  const handleApply = async () => {
    setPreviousFilters({
      type: selectedType,
      rarity: selectedRarity,
      category: selectedCategory,
      collection: selectedCollection,
      weapon: selectedWeapon
    });

    try {
      setIsItemsLoading(true);
      setError(null);
      setCurrentPage(1);
      
      const response = await getFilteredItems({
        type_id: selectedType?.id,
        rarity_id: selectedRarity?.id,
        category_id: selectedCategory?.id,
        collection_id: selectedCollection?.id,
        weapon_id: selectedWeapon?.id,
        page: 1,
        page_size: 12
      });

      setTotalItems(response.total);
      setFilteredItems(response.items);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при загрузке предметов');
      }
    } finally {
      setIsItemsLoading(false);
      setIsFiltersVisible(false);
      setIsMobileModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-3 md:py-8 md:px-0">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-csm-blue-primary to-csm-bg-card rounded-xl p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-csm-text-primary mb-2">Item Filter</h1>
          <p className="text-csm-text-secondary">Find the perfect items for your inventory</p>
        </div>

        {/* Состояние загрузки фильтров */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-csm-blue-primary"></div>
            <p className="mt-2 text-csm-text-muted">Загрузка фильтров...</p>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-csm-blue-primary hover:text-csm-blue-hover"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Мобильная кнопка фильтров */}
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className="lg:hidden w-auto bg-csm-bg-card border border-csm-border rounded px-4 py-2 text-csm-text-primary mb-4 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Десктопные фильтры */}
              <div className="hidden lg:block lg:w-1/4">
                <div className="bg-csm-bg-card border border-csm-border rounded-xl p-4">
                  {/* Тип */}
                  <div className="mb-4">
                    <label className="block text-csm-text-primary font-semibold mb-2">Type</label>
                    <CustomSelect
                      options={filterOptions.types}
                      value={selectedType?.name || null}
                      onChange={(value) => setSelectedType(filterOptions.types.find(t => t.name === value) || null)}
                      placeholder="All Types"
                    />
                  </div>

                  {/* Редкость */}
                  <div className="mb-4">
                    <label className="block text-csm-text-primary font-semibold mb-2">Rarity</label>
                    <CustomSelect
                      options={filterOptions.rarities}
                      value={selectedRarity?.name || null}
                      onChange={(value) => setSelectedRarity(filterOptions.rarities.find(r => r.name === value) || null)}
                      placeholder="All Rarities"
                    />
                  </div>

                  {/* Категория */}
                  <div className="mb-4">
                    <label className="block text-csm-text-primary font-semibold mb-2">Category</label>
                    <CustomSelect
                      options={filterOptions.categories}
                      value={selectedCategory?.name || null}
                      onChange={(value) => setSelectedCategory(filterOptions.categories.find(c => c.name === value) || null)}
                      placeholder="All Categories"
                    />
                  </div>

                  {/* Коллекция */}
                  <div className="mb-4">
                    <label className="block text-csm-text-primary font-semibold mb-2">Collection</label>
                    <CustomSelect
                      options={filterOptions.collections}
                      value={selectedCollection?.name || null}
                      onChange={(value) => setSelectedCollection(filterOptions.collections.find(c => c.name === value) || null)}
                      placeholder="All Collections"
                    />
                  </div>

                  {/* Оружие */}
                  <div className="mb-6">
                    <label className="block text-csm-text-primary font-semibold mb-2">Weapon</label>
                    <CustomSelect
                      options={filterOptions.weapons}
                      value={selectedWeapon?.name || null}
                      onChange={(value) => setSelectedWeapon(filterOptions.weapons.find(w => w.name === value) || null)}
                      placeholder="All Weapons"
                    />
                  </div>

                  {/* Кнопки */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-2.5 px-4 rounded font-medium text-white bg-csm-bg-lighter border border-csm-border hover:bg-csm-bg-dark transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApply}
                      className="flex-1 py-2.5 px-4 rounded font-medium text-white bg-csm-blue-primary hover:bg-csm-blue-hover transition-all duration-200"
                      disabled={isItemsLoading}
                    >
                      {isItemsLoading ? 'Loading...' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Контент */}
              <div className="lg:w-3/4">
                {/* Сортировка и количество */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-csm-text-primary font-semibold">
                    {totalItems} items found
                  </h2>
                </div>

                {/* Состояние загрузки предметов */}
                {isItemsLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-csm-blue-primary"></div>
                    <p className="mt-2 text-csm-text-muted">Загрузка предметов...</p>
                  </div>
                )}

                {/* Сетка предметов */}
                {!isItemsLoading && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <Link
                          key={item.id}
                          to={`/item/${item.slug}`}
                          className="bg-csm-bg-card border border-csm-border rounded-xl overflow-hidden hover:border-csm-blue-accent transition-colors"
                        >
                          <div className={`flex items-center justify-center relative ${getRarityColor(item.rarity)}`}>
                            <img 
                              src={`${API_URL}${item.photo}`} 
                              alt={item.item_name} 
                              className="w-full h-full object-contain" 
                            />
                            {getItemIcons(item.category).length > 0 && (
                              <div className="absolute left-1 bottom-1 flex items-center space-x-1">
                                {getItemIcons(item.category).map((icon, index) => (
                                  <img key={index} src={icon} alt="Item property" className="lg:w-5 lg:h-5 lg:mb-1 lg:ml-2 w-4 h-4 mb-0.5 ml-1 object-contain" />
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="text-csm-text-primary font-medium mb-1 truncate">{item.item_name}</h3>
                            <div className="flex justify-between items-center">
                              <span className="text-csm-text-muted text-sm truncate">{item.collection}</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full py-8 text-center">
                        <p className="text-csm-text-muted">No items found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Пагинация */}
                {filteredItems.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || isItemsLoading}
                        className={`px-2 py-1 border border-csm-border rounded-l text-csm-text-muted hover:bg-csm-bg-dark ${(currentPage === 1 || isItemsLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={filteredItems.length < 12 || currentPage * 12 >= totalItems || isItemsLoading}
                        className={`px-2 py-1 border border-csm-border rounded-r text-csm-text-muted hover:bg-csm-bg-dark ${(filteredItems.length < 12 || currentPage * 12 >= totalItems || isItemsLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>

            {/* Мобильное модальное окно с фильтрами */}
            <MobileFilterModal
              isOpen={isMobileModalOpen}
              onClose={() => setIsMobileModalOpen(false)}
              onApply={handleApply}
              onCancel={handleCancel}
              filters={filterOptions}
              selectedFilters={{
                type: selectedType?.name || null,
                rarity: selectedRarity?.name || null,
                category: selectedCategory?.name || null,
                collection: selectedCollection?.name || null,
                weapon: selectedWeapon?.name || null
              }}
              onFilterChange={{
                setSelectedType: (value) => setSelectedType(filterOptions.types.find(t => t.name === value) || null),
                setSelectedRarity: (value) => setSelectedRarity(filterOptions.rarities.find(r => r.name === value) || null),
                setSelectedCategory: (value) => setSelectedCategory(filterOptions.categories.find(c => c.name === value) || null),
                setSelectedCollection: (value) => setSelectedCollection(filterOptions.collections.find(c => c.name === value) || null),
                setSelectedWeapon: (value) => setSelectedWeapon(filterOptions.weapons.find(w => w.name === value) || null)
              }}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default FilterPage; 