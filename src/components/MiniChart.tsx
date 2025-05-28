import React from 'react';

interface DataPoint {
  date: string;
  price: number;
}

interface MiniChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({ data, width = 80, height = 40 }) => {
  if (data.length === 0) return null;

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice || 1;

  // Generate SVG path
  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((point.price - minPrice) / priceRange) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Determine color based on trend
  const firstPrice = data[0].price;
  const lastPrice = data[data.length - 1].price;
  const isPositive = lastPrice >= firstPrice;
  const strokeColor = isPositive ? '#10b981' : '#ef4444'; // green for up, red for down

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Background area */}
      <defs>
        <linearGradient id={`gradient-${Math.random()}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#gradient-${Math.random()})`}
      />

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((point, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((point.price - minPrice) / priceRange) * height;
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill={strokeColor}
            className="opacity-80"
          />
        );
      })}
    </svg>
  );
};

export default MiniChart;
