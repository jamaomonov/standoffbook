import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import { fetchItemPriceHistory } from '../api/prices';

interface PriceHistoryChartProps {
  data?: Array<{ date: string; price: number }>;
  height?: number;
  itemName?: string;
}

type PeriodType = '7d' | '1m' | '3m' | '6m' | '1y' | 'all';

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ 
  data = [], 
  height = 400,
  itemName = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allData, setAllData] = useState<Array<{ date: string; price: number }>>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const periods: { label: string; value: PeriodType; days: number }[] = [
    { label: '7Д', value: '7d', days: 7 },
    { label: '1М', value: '1m', days: 30 },
    { label: '3М', value: '3m', days: 90 },
    { label: '6М', value: '6m', days: 180 },
    { label: '1Г', value: '1y', days: 365 },
    { label: 'Все', value: 'all', days: 0 },
  ];

  const filteredData = useMemo(() => {
    if (selectedPeriod === 'all') {
      return allData;
    }

    const period = periods.find(p => p.value === selectedPeriod);
    if (!period) return allData;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period.days);

    return allData.filter(item => new Date(item.date) >= cutoffDate);
  }, [allData, selectedPeriod]);

  const fetchPriceHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiData = await fetchItemPriceHistory(itemName);
      // Сортируем данные по дате
      const sortedData = apiData.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setAllData(sortedData);
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Error fetching price history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  const handleShare = () => {
    if (!chartInstance.current) return;
    
    const dataUrl = chartInstance.current.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#1f2937'
    });

    const shareData = {
      title: `График ${itemName} - standoffbook.com`,
      text: `Посмотрите историю цен для ${itemName} на standoffbook.com`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(textToCopy)
        .then(() => alert('Ссылка скопирована в буфер обмена'))
        .catch(console.error);
    }
  };

  const handleScreenshot = () => {
    if (!chartInstance.current) return;
    
    const dataUrl = chartInstance.current.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#1f2937'
    });

    const link = document.createElement('a');
    link.download = `${itemName}-price-history-standoffbook.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchPriceHistory();
  }, [itemName]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!chartRef.current || isLoading) return;

    chartInstance.current = echarts.init(chartRef.current, 'dark');

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '',
        textStyle: {
          color: '#ffffff'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        textStyle: {
          color: '#ffffff',
          fontSize: isMobile ? 12 : 14
        },
        formatter: function (params: any) {
          const data = params[0];
          return `
            <div style="padding: 6px;">
              <div style="margin-bottom: 4px; color: #9ca3af; font-size: ${isMobile ? '10px' : '12px'};">
                ${data.value[0]}
              </div>
              <div style="color: #60a5fa; font-weight: bold; font-size: ${isMobile ? '12px' : '14px'};">
                ${data.value[1]} G
              </div>
            </div>
          `;
        }
      },
      toolbox: {
        show: !isMobile,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
            icon: {
              zoom: 'path://M0,0 L1,1',
              back: 'path://M0,0 L1,1'
            }
          },
          restore: {},
          saveAsImage: { show: false }
        },
        iconStyle: {
          borderColor: '#60a5fa'
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomLock: false,
          throttle: 50,
          minValueSpan: 3600 * 24 * 1000 * 3,
          rangeMode: ['value', 'value'],
          preventDefaultMouseMove: false,
          moveOnMouseMove: true,
          zoomOnMouseWheel: true,
          moveOnMouseWheel: false,
          orient: 'horizontal',
          filterMode: 'filter'
        },
        {
          show: true,
          type: 'slider',
          start: 0,
          end: 100,
          height: isMobile ? 25 : 20,
          bottom: 0,
          brushSelect: false,
          handleSize: isMobile ? 25 : 20,
          handleStyle: {
            color: '#60a5fa',
            borderColor: '#60a5fa',
            borderWidth: 1,
            shadowBlur: 2,
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 0
          },
          moveHandleSize: isMobile ? 25 : 20,
          moveHandleStyle: {
            color: '#60a5fa',
            opacity: 0.7
          },
          emphasis: {
            handleStyle: {
              borderWidth: 2,
              color: '#3b82f6'
            }
          },
          backgroundColor: 'rgba(26,29,36,0.3)',
          fillerColor: 'rgba(96,165,250,0.1)',
          borderColor: 'transparent',
          textStyle: {
            color: '#9ca3af',
            fontSize: isMobile ? 10 : 11
          }
        }
      ],
      grid: {
        left: isMobile ? '8%' : '3%',
        right: isMobile ? '5%' : '4%',
        bottom: isMobile ? '40px' : '40px',
        top: isMobile ? '15%' : '10%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#374151'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#9ca3af',
            fontSize: isMobile ? 10 : 11
          },
          formatter: function (value: any) {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#9ca3af',
            fontSize: isMobile ? 10 : 11
          },
          formatter: '{value} G'
        },
        splitLine: {
          lineStyle: {
            color: '#374151',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: 'Price',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: '#60a5fa',
            width: isMobile ? 1 : 1.5
          },
          itemStyle: {
            color: '#60a5fa'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(96, 165, 250, 0.2)'
                },
                {
                  offset: 1,
                  color: 'rgba(96, 165, 250, 0.02)'
                }
              ]
            }
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: '#3b82f6',
              shadowBlur: 10,
              shadowColor: 'rgba(96, 165, 250, 0.5)'
            }
          },
          data: filteredData.map(item => [item.date, item.price])
        }
      ]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [filteredData, isMobile]);

  return (
    <div className="relative flex flex-col h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="text-red-500">{error}</div>
        </div>
      )}
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={handleScreenshot}
          className="px-2 py-2 md:px-3 md:py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs md:text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="hidden md:inline">Скриншот</span>
        </button>
        <button
          onClick={handleShare}
          className="px-2 py-2 md:px-3 md:py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs md:text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="hidden md:inline">Поделиться</span>
        </button>
      </div>

      <div 
        ref={chartRef} 
        style={{ 
          width: '100%', 
          height: isMobile ? `${height * 0.8}px` : `${height}px`,
          backgroundColor: 'transparent'
        }}
        className="touch-pan-x touch-pan-y flex-grow"
      />

      <div className="justify-center md:hidden mt-4 space-y-1.5">
        <div className="grid grid-cols-3 gap-1.5 max-w-[360px]">
          {periods.slice(0, 3).map(period => (
            <button
              key={period.value}
              onClick={() => handlePeriodChange(period.value)}
              className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-indigo-700 text-white'
                  : 'bg-[#1a1d24] text-gray-300 hover:bg-[#1a1d24]/80'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5 max-w-[360px]">
          {periods.slice(3).map(period => (
            <button
              key={period.value}
              onClick={() => handlePeriodChange(period.value)}
              className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-indigo-700 text-white'
                  : 'bg-[#1a1d24] text-gray-300 hover:bg-[#1a1d24]/80'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Десктопная версия кнопок периодов */}
      <div className="justify-center hidden md:flex md:space-x-2 mt-7">
        {periods.map(period => (
          <button
            key={period.value}
            onClick={() => handlePeriodChange(period.value)}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              selectedPeriod === period.value
                ? 'bg-indigo-700 text-white'
                : 'bg-indigo-900 text-gray-300 hover:bg-indigo-700 text-white'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceHistoryChart;