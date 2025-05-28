import React from 'react';
import MiniChart from './MiniChart';
import uspRoyalBlue from '../assets/usp-royal-blue.webp';

interface PriceChange {
  price: string;
  change: string;
  isPositive: boolean;
}

interface ItemData {
  id: number;
  name: string;
  image: string;
  currentPrice: string;
  perDay: PriceChange;
  perWeek: PriceChange;
  perMonth: PriceChange;
  perYear: PriceChange;
  weekChart: Array<{ date: string; price: number }>;
}

// Sample data for demonstration
const itemsData: ItemData[] = [
  {
    id: 1,
    name: 'Karambit | Fade',
    image: uspRoyalBlue,
    currentPrice: '1,245.50 G',
    perDay: { price: '1,250.00 G', change: '+0.36%', isPositive: true },
    perWeek: { price: '1,280.00 G', change: '+2.77%', isPositive: true },
    perMonth: { price: '1,180.00 G', change: '+5.55%', isPositive: true },
    perYear: { price: '980.00 G', change: '+27.10%', isPositive: true },
    weekChart: [
      { date: '2024-01-01', price: 1180 },
      { date: '2024-01-02', price: 1200 },
      { date: '2024-01-03', price: 1190 },
      { date: '2024-01-04', price: 1220 },
      { date: '2024-01-05', price: 1235 },
      { date: '2024-01-06', price: 1240 },
      { date: '2024-01-07', price: 1245 }
    ]
  },
  {
    id: 2,
    name: 'AWP | Dragon Lore',
    image: uspRoyalBlue,
    currentPrice: '3,200.25 G',
    perDay: { price: '3,180.00 G', change: '+0.64%', isPositive: true },
    perWeek: { price: '3,350.00 G', change: '-4.47%', isPositive: false },
    perMonth: { price: '3,100.00 G', change: '+3.23%', isPositive: true },
    perYear: { price: '2,800.00 G', change: '+14.29%', isPositive: true },
    weekChart: [
      { date: '2024-01-01', price: 3350 },
      { date: '2024-01-02', price: 3320 },
      { date: '2024-01-03', price: 3280 },
      { date: '2024-01-04', price: 3250 },
      { date: '2024-01-05', price: 3220 },
      { date: '2024-01-06', price: 3210 },
      { date: '2024-01-07', price: 3200 }
    ]
  },
  {
    id: 3,
    name: 'Sport Gloves | Pandora\'s Box',
    image: uspRoyalBlue,
    currentPrice: '1,230.00 G',
    perDay: { price: '1,225.00 G', change: '+0.41%', isPositive: true },
    perWeek: { price: '1,200.00 G', change: '+2.50%', isPositive: true },
    perMonth: { price: '1,300.00 G', change: '-5.38%', isPositive: false },
    perYear: { price: '1,100.00 G', change: '+11.82%', isPositive: true },
    weekChart: [
      { date: '2024-01-01', price: 1200 },
      { date: '2024-01-02', price: 1210 },
      { date: '2024-01-03', price: 1205 },
      { date: '2024-01-04', price: 1215 },
      { date: '2024-01-05', price: 1225 },
      { date: '2024-01-06', price: 1228 },
      { date: '2024-01-07', price: 1230 }
    ]
  },
  {
    id: 4,
    name: 'Butterfly Knife | Crimson Web',
    image: uspRoyalBlue,
    currentPrice: '950.75 G',
    perDay: { price: '945.00 G', change: '+0.61%', isPositive: true },
    perWeek: { price: '920.00 G', change: '+3.34%', isPositive: true },
    perMonth: { price: '880.00 G', change: '+8.04%', isPositive: true },
    perYear: { price: '750.00 G', change: '+26.77%', isPositive: true },
    weekChart: [
      { date: '2024-01-01', price: 920 },
      { date: '2024-01-02', price: 925 },
      { date: '2024-01-03', price: 930 },
      { date: '2024-01-04', price: 935 },
      { date: '2024-01-05', price: 940 },
      { date: '2024-01-06', price: 945 },
      { date: '2024-01-07', price: 950 }
    ]
  },
  {
    id: 5,
    name: 'AK-47 | Redline',
    image: uspRoyalBlue,
    currentPrice: '45.76 G',
    perDay: { price: '46.20 G', change: '-0.95%', isPositive: false },
    perWeek: { price: '44.50 G', change: '+2.83%', isPositive: true },
    perMonth: { price: '42.00 G', change: '+8.95%', isPositive: true },
    perYear: { price: '38.00 G', change: '+20.42%', isPositive: true },
    weekChart: [
      { date: '2024-01-01', price: 44.5 },
      { date: '2024-01-02', price: 45.0 },
      { date: '2024-01-03', price: 46.2 },
      { date: '2024-01-04', price: 45.8 },
      { date: '2024-01-05', price: 45.5 },
      { date: '2024-01-06', price: 45.9 },
      { date: '2024-01-07', price: 45.76 }
    ]
  },
  {
    id: 6,
    name: 'M4A4 | Desolate Space',
    image: uspRoyalBlue,
    currentPrice: '32.15 G',
    perDay: { price: '32.50 G', change: '-1.08%', isPositive: false },
    perWeek: { price: '31.20 G', change: '+3.04%', isPositive: true },
    perMonth: { price: '29.80 G', change: '+7.89%', isPositive: true },
    perYear: { price: '26.50 G', change: '+21.32%', isPositive: true },
    weekChart: [
      { date: '2024-01-01', price: 31.2 },
      { date: '2024-01-02', price: 31.8 },
      { date: '2024-01-03', price: 32.5 },
      { date: '2024-01-04', price: 32.3 },
      { date: '2024-01-05', price: 32.0 },
      { date: '2024-01-06', price: 32.2 },
      { date: '2024-01-07', price: 32.15 }
    ]
  }
];

const ItemStatistics: React.FC = () => {
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
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base">Price</th>
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base">Per Day</th>
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base">Per Week</th>
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base">Per Month</th>
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base">Per Year</th>
                <th className="text-left p-3 lg:p-4 text-csm-text-secondary font-medium text-sm lg:text-base">Week Chart</th>
              </tr>
            </thead>
            <tbody>
              {itemsData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-csm-border hover:bg-csm-bg-darker transition-colors ${
                    index % 2 === 0 ? 'bg-csm-bg-card' : 'bg-csm-bg-darker/30'
                  }`}
                >
                  {/* Item Column */}
                  <td className="p-3 lg:p-4">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg object-cover"
                      />
                      <span className="text-white font-medium truncate max-w-[120px] lg:max-w-[200px] text-sm lg:text-base">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Current Price */}
                  <td className="p-3 lg:p-4">
                    <span className="text-csm-blue-accent font-medium text-sm lg:text-base">
                      {item.currentPrice}
                    </span>
                  </td>

                  {/* Per Day */}
                  <td className="p-3 lg:p-4">
                    <div className="flex flex-col">
                      <span className="text-white text-xs lg:text-sm">{item.perDay.price}</span>
                      <span className={`text-xs ${item.perDay.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {item.perDay.change}
                      </span>
                    </div>
                  </td>

                  {/* Per Week */}
                  <td className="p-3 lg:p-4">
                    <div className="flex flex-col">
                      <span className="text-white text-xs lg:text-sm">{item.perWeek.price}</span>
                      <span className={`text-xs ${item.perWeek.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {item.perWeek.change}
                      </span>
                    </div>
                  </td>

                  {/* Per Month */}
                  <td className="p-3 lg:p-4">
                    <div className="flex flex-col">
                      <span className="text-white text-xs lg:text-sm">{item.perMonth.price}</span>
                      <span className={`text-xs ${item.perMonth.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {item.perMonth.change}
                      </span>
                    </div>
                  </td>

                  {/* Per Year */}
                  <td className="p-3 lg:p-4">
                    <div className="flex flex-col">
                      <span className="text-white text-xs lg:text-sm">{item.perYear.price}</span>
                      <span className={`text-xs ${item.perYear.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {item.perYear.change}
                      </span>
                    </div>
                  </td>

                  {/* Week Chart */}
                  <td className="p-3 lg:p-4">
                    <div className="flex justify-center">
                      <MiniChart data={item.weekChart} width={60} height={30} />
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
            {itemsData.map((item) => (
              <div
                key={item.id}
                className="bg-csm-bg-card border border-csm-border rounded-xl p-4 w-72 flex-shrink-0"
              >
                {/* Item Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
                    <span className="text-csm-blue-accent font-medium text-lg">
                      {item.currentPrice}
                    </span>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="bg-csm-bg-darker rounded-lg p-3 mb-4">
                  <div className="text-csm-text-secondary text-xs mb-2">Week Chart</div>
                  <div className="flex justify-center">
                    <MiniChart data={item.weekChart} width={140} height={60} />
                  </div>
                </div>

                {/* Price Changes Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Day</div>
                    <div className="text-white text-xs">{item.perDay.price}</div>
                    <div className={`text-xs ${item.perDay.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {item.perDay.change}
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Week</div>
                    <div className="text-white text-xs">{item.perWeek.price}</div>
                    <div className={`text-xs ${item.perWeek.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {item.perWeek.change}
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Month</div>
                    <div className="text-white text-xs">{item.perMonth.price}</div>
                    <div className={`text-xs ${item.perMonth.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {item.perMonth.change}
                    </div>
                  </div>

                  <div className="bg-csm-bg-darker rounded-lg p-2">
                    <div className="text-csm-text-secondary text-xs mb-1">Per Year</div>
                    <div className="text-white text-xs">{item.perYear.price}</div>
                    <div className={`text-xs ${item.perYear.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {item.perYear.change}
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
    </section>
  );
};

export default ItemStatistics;
