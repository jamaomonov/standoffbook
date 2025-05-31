import React, { useState, useEffect } from 'react';
import MiniChart from './MiniChart';
import { getItemsStatistics, type ItemStatistic, type SortBy } from '../api/statistics';
import { API_URL } from '../api/config';
import ResponsivePagination from 'react-responsive-pagination';
import '../styles/pagination.css';

const ItemStatistics: React.FC = () => {
  const [items, setItems] = useState<ItemStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('per_week');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getItemsStatistics(currentPage, 10, sortBy);
        setItems(data);
        setTotalPages(10);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sortBy, currentPage]);

  const handleSort = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

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
      <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Item Statistics</h2>

      {/* Desktop + Tablet Table (md and up) */}
      <div className="hidden md:block bg-csm-bg-card border border-csm-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-csm-bg-darker border-b border-csm-border">
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base">Item</th>
                <th 
                  className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base cursor-pointer hover:text-white"
                  onClick={() => handleSort('price_now')}
                >
                  Price
                </th>
                <th 
                  className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base cursor-pointer hover:text-white"
                  onClick={() => handleSort('per_day')}
                >
                  Per Day
                </th>
                <th 
                  className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base cursor-pointer hover:text-white"
                  onClick={() => handleSort('per_week')}
                >
                  Per Week
                </th>
                <th 
                  className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base cursor-pointer hover:text-white"
                  onClick={() => handleSort('per_month')}
                >
                  Per Month
                </th>
                <th 
                  className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base cursor-pointer hover:text-white"
                  onClick={() => handleSort('per_year')}
                >
                  Per Year
                </th>
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base">Week Chart</th>
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
                        <img
                          src={API_URL + item.photo}
                          alt={item.name}
                          className="w-20 lg:w-24 rounded-lg object-cover"
                        />
                        <div>
                          <span className="text-white truncate max-w-[120px] lg:max-w-[200px] text-sm lg:text-base block">
                            {item.name}
                          </span>
                          <span className="text-csm-text-secondary text-xs">
                            {item.rarity}
                          </span>
                        </div>
                      </div>
                    </a>
                  </td>
                  {/* Current Price */}
                  <td className="p-3 lg:p-4">
                    <span className="text-csm-blue-accent font-medium text-sm lg:text-base">
                      {(item.price?.price_now || 0).toFixed(2)} G
                    </span>
                  </td>

                  {/* Per Day */}
                  <td className="p-3 lg:p-4">
                    <div className={`flex flex-col ${(item.price?.per_day_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="text-xs lg:text-sm">{(item.price?.per_day_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_day_gold || 0).toFixed(2)} G</span>
                      <span className="text-xs">
                        {(item.price?.per_day_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_day_percent || 0).toFixed(2)}%
                      </span>
                    </div>
                  </td>

                  {/* Per Week */}
                  <td className="p-3 lg:p-4">
                    <div className={`flex flex-col ${(item.price?.per_week_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="text-xs lg:text-sm">{(item.price?.per_week_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_week_gold || 0).toFixed(2)} G</span>
                      <span className="text-xs">
                        {(item.price?.per_week_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_week_percent || 0).toFixed(2)}%
                      </span>
                    </div>
                  </td>

                  {/* Per Month */}
                  <td className="p-3 lg:p-4">
                    <div className={`flex flex-col ${(item.price?.per_month_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="text-xs lg:text-sm">{(item.price?.per_month_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_month_gold || 0).toFixed(2)} G</span>
                      <span className="text-xs">
                        {(item.price?.per_month_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_month_percent || 0).toFixed(2)}%
                      </span>
                    </div>
                  </td>

                  {/* Per Year */}
                  <td className="p-3 lg:p-4">
                    <div className={`flex flex-col ${(item.price?.per_year_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="text-xs lg:text-sm">{(item.price?.per_year_gold || 0) >= 0 ? '+' : ''}{(item.price?.per_year_gold || 0).toFixed(2)} G</span>
                      <span className="text-xs">
                        {(item.price?.per_year_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_year_percent || 0).toFixed(2)}%
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

      {/* Mobile Horizontal Scrollable Cards (sm and below) */}
      <div className="md:hidden">
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 w-max">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-csm-bg-card border border-csm-border rounded-xl p-4 w-72 flex-shrink-0"
              >
                {/* Item Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={API_URL + item.photo}
                    alt={item.name}
                    className="w-32 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
                    <span className="text-csm-text-secondary text-xs">{item.rarity}</span>
                    <span className="text-csm-blue-accent font-medium text-lg block">
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
                    <div className="text-white text-xs">{(item.price?.per_day_gold || 0).toFixed(2)} G</div>
                    <div className={`text-xs ${(item.price?.per_day_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.price?.per_day_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_day_percent || 0).toFixed(2)}%
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Week</div>
                    <div className="text-white text-xs">{(item.price?.per_week_gold || 0).toFixed(2)} G</div>
                    <div className={`text-xs ${(item.price?.per_week_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.price?.per_week_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_week_percent || 0).toFixed(2)}%
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Month</div>
                    <div className="text-white text-xs">{(item.price?.per_month_gold || 0).toFixed(2)} G</div>
                    <div className={`text-xs ${(item.price?.per_month_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.price?.per_month_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_month_percent || 0).toFixed(2)}%
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Year</div>
                    <div className="text-white text-xs">{(item.price?.per_year_gold || 0).toFixed(2)} G</div>
                    <div className={`text-xs ${(item.price?.per_year_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.price?.per_year_percent || 0) >= 0 ? '+' : ''}{(item.price?.per_year_percent || 0).toFixed(2)}%
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
