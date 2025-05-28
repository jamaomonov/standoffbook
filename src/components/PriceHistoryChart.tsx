import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PriceHistoryChartProps {
  data?: Array<{ date: string; price: number }>;
  height?: number;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  data = [],
  height = 400
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Default sample data if none provided
  const defaultData = [
    {
      purchase_price: 14.8,
      Date: "2023-07-18 05:55:55"
    },
    {
      purchase_price: 14.3,
      Date: "2023-07-19 05:55:55"
    },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
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
          color: '#ffffff'
        },
        formatter: function (params: any) {
          const data = params[0];
          return `
            <div style="padding: 8px;">
              <div style="margin-bottom: 4px; color: #9ca3af; font-size: 12px;">
                ${new Date(data.axisValue).toLocaleDateString()}
              </div>
              <div style="color: #60a5fa; font-weight: bold; font-size: 14px;">
                ${data.value} G
              </div>
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
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
            fontSize: 11
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
            fontSize: 11
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
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#60a5fa',
            width: 3
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
                  color: 'rgba(96, 165, 250, 0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(96, 165, 250, 0.05)'
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
          data: chartData.map(item => [item.date, item.price])
        }
      ]
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [chartData]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'transparent'
      }}
    />
  );
};

export default PriceHistoryChart;
