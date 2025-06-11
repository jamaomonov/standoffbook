import React from 'react';
import CustomSelect from './CustomSelect';

interface FilterOption {
  name: string;
}

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onCancel: () => void;
  filters: {
    types: FilterOption[];
    rarities: FilterOption[];
    categories: FilterOption[];
    collections: FilterOption[];
    weapons: FilterOption[];
  };
  selectedFilters: {
    type: string | null;
    rarity: string | null;
    category: string | null;
    collection: string | null;
    weapon: string | null;
  };
  onFilterChange: {
    setSelectedType: (value: string | null) => void;
    setSelectedRarity: (value: string | null) => void;
    setSelectedCategory: (value: string | null) => void;
    setSelectedCollection: (value: string | null) => void;
    setSelectedWeapon: (value: string | null) => void;
  };
}

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onCancel,
  filters,
  selectedFilters,
  onFilterChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center p-4">
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Модальное окно */}
      <div className="relative w-full max-w-md bg-csm-bg-card/95 backdrop-blur-sm rounded-xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-csm-border/50">
          <h2 className="text-lg font-semibold text-csm-text-primary">Filters</h2>
          <button
            onClick={onClose}
            className="text-csm-text-muted hover:text-csm-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Содержимое */}
        <div className="overflow-y-auto custom-scrollbar flex-1 p-4">
          {/* Тип */}
          <div className="mb-4">
            <label className="block text-csm-text-primary font-semibold mb-2">Type</label>
            <CustomSelect
              options={filters.types}
              value={selectedFilters.type}
              onChange={onFilterChange.setSelectedType}
              placeholder="All Types"
            />
          </div>

          {/* Редкость */}
          <div className="mb-4">
            <label className="block text-csm-text-primary font-semibold mb-2">Rarity</label>
            <CustomSelect
              options={filters.rarities}
              value={selectedFilters.rarity}
              onChange={onFilterChange.setSelectedRarity}
              placeholder="All Rarities"
            />
          </div>

          {/* Категория */}
          <div className="mb-4">
            <label className="block text-csm-text-primary font-semibold mb-2">Category</label>
            <CustomSelect
              options={filters.categories}
              value={selectedFilters.category}
              onChange={onFilterChange.setSelectedCategory}
              placeholder="All Categories"
            />
          </div>

          {/* Коллекция */}
          <div className="mb-4">
            <label className="block text-csm-text-primary font-semibold mb-2">Collection</label>
            <CustomSelect
              options={filters.collections}
              value={selectedFilters.collection}
              onChange={onFilterChange.setSelectedCollection}
              placeholder="All Collections"
            />
          </div>

          {/* Оружие */}
          <div className="mb-6">
            <label className="block text-csm-text-primary font-semibold mb-2">Weapon</label>
            <CustomSelect
              options={filters.weapons}
              value={selectedFilters.weapon}
              onChange={onFilterChange.setSelectedWeapon}
              placeholder="All Weapons"
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="p-4 border-t border-csm-border/50">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 rounded font-medium text-white bg-csm-bg-lighter/80 border border-csm-border hover:bg-csm-bg-dark transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onApply}
              className="flex-1 py-2.5 px-4 rounded font-medium text-white bg-csm-blue-primary/90 hover:bg-csm-blue-hover transition-all duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterModal; 