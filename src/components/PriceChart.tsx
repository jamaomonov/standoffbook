import React, { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';

// Define props for the component
interface PriceChartProps {
  timeRange?: '7D' | '1M' | '3M' | '6M' | '1Y' | 'All';
}

// Icons for the chart controls
const FullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// Sample price data generator
const generateSampleData = (timeRange: string) => {
  const basePrice = 2.0;
  const dates = [];
  const prices = [];

  // Determine number of days to display based on timeRange
  let days = 30; // Default for 1M

  switch(timeRange) {
    case '7D':
      days = 7;
      break;
    case '1M':
      days = 30;
      break;
    case '3M':
      days = 90;
      break;
    case '6M':
      days = 180;
      break;
    case '1Y':
      days = 365;
      break;
    case 'All':
      days = 500;
      break;
  }

  // Create dates for the selected period
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Format as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    dates.push(formattedDate);

    // Generate a somewhat realistic price fluctuation
    let randomFactor = Math.random() * 0.2 - 0.1; // Random between -0.1 and 0.1

    // Add a price spike for certain date ranges (visual interest)
    if (timeRange === '1M' && i === 23) {
      randomFactor = 0.5; // Big spike for 1M view
    } else if (timeRange === '3M' && i === 45) {
      randomFactor = 0.7; // Big spike for 3M view
    } else if (timeRange === '6M' && i === 90) {
      randomFactor = 0.8; // Big spike for 6M view
    }

    const price = basePrice + randomFactor;
    // Convert to number but ensure we have exactly two decimal places
    prices.push(parseFloat(price.toFixed(2)));
  }

  return { dates, prices };
};

const PriceChart: React.FC<PriceChartProps> = ({ timeRange = '1M' }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Refresh chart data
  const refreshChart = () => {
    if (chartRef.current && chartInstance.current) {
      // Destroy and recreate the chart to refresh with new data
      chartInstance.current.destroy();
      createChart();
    }
  };

  // Download chart as image
  const downloadChart = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `price-chart-${timeRange}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = chartRef.current.toDataURL('image/png');
      link.click();
    }
  };

  // Create chart function wrapped in useCallback
  const createChart = useCallback(() => {
    if (!chartRef.current) return;

    // Generate data based on the selected time range
    const { dates, prices } = generateSampleData(timeRange);

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Price',
          data: prices,
          borderColor: '#40e0d0', // Teal/Aqua color
          backgroundColor: 'rgba(64, 224, 208, 0.05)',
          pointBackgroundColor: '#40e0d0',
          pointBorderColor: '#40e0d0',
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.1,
          fill: false,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'rgba(70, 70, 70, 0.2)',
            },
            ticks: {
              maxRotation: 0,
              color: 'rgba(138, 146, 161, 0.8)',
              font: {
                size: 11,
              },
              callback: function(value, index, values) {
                // Show fewer x-axis labels depending on the range
                const skipFactor = Math.ceil(dates.length / 7);
                return index % skipFactor === 0 ? dates[index] : '';
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(70, 70, 70, 0.2)',
            },
            ticks: {
              color: 'rgba(138, 146, 161, 0.8)',
              font: {
                size: 12,
              },
              // Replace $ with G and ensure two decimal places
              callback: function(value) {
                // Ensure value is a number before using toFixed
                const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                return 'G ' + numValue.toFixed(2);
              }
            },
            min: Math.min(...prices) - 0.5,
            max: Math.max(...prices) + 0.5,
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(16, 18, 26, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 10,
            displayColors: false,
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                // Replace $ with G and ensure two decimal places
                return 'G ' + parseFloat(context.formattedValue).toFixed(2);
              }
            }
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        elements: {
          line: {
            tension: 0.1,
          },
          point: {
            radius: 2,
            hitRadius: 10,
            hoverRadius: 5,
          },
        },
      }
    });
  }, [timeRange]); // Add timeRange as dependency for useCallback

  useEffect(() => {
    // Clear existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    createChart();

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [timeRange, createChart]); // Add createChart to dependencies

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-csm-bg-dark p-4' : 'h-56 md:h-64 lg:h-80 w-full'}`}>
      {/* Chart controls */}
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          className="bg-csm-bg-darker p-2 rounded hover:bg-csm-bg-lighter text-csm-text-secondary transition-colors"
          onClick={toggleFullscreen}
          title="Toggle fullscreen"
        >
          <FullscreenIcon />
        </button>
        <button
          className="bg-csm-bg-darker p-2 rounded hover:bg-csm-bg-lighter text-csm-text-secondary transition-colors"
          onClick={refreshChart}
          title="Refresh data"
        >
          <RefreshIcon />
        </button>
        <button
          className="bg-csm-bg-darker p-2 rounded hover:bg-csm-bg-lighter text-csm-text-secondary transition-colors"
          onClick={downloadChart}
          title="Download chart"
        >
          <DownloadIcon />
        </button>
      </div>

      {/* Chart canvas */}
      <canvas ref={chartRef}></canvas>

      {/* Fullscreen close button */}
      {isFullscreen && (
        <button
          className="absolute top-4 right-4 p-2 bg-csm-bg-darker rounded-full text-white"
          onClick={toggleFullscreen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PriceChart;
