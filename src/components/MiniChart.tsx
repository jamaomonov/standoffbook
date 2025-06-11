import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ChartData {
  date: string;
  price: number;
}

interface MiniChartProps {
  data: ChartData[];
  width: number;
  height: number;
}

const MiniChart: React.FC<MiniChartProps> = ({ data, width, height }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Уничтожаем предыдущий график если он существует
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const getOrCreateTooltip = () => {
      let tooltipEl = document.getElementById('chartjs-tooltip');

      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.style.background = '#171923';
        tooltipEl.style.borderRadius = '8px';
        tooltipEl.style.color = '#fff';
        tooltipEl.style.opacity = '0';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';
        tooltipEl.style.zIndex = '100';
        tooltipEl.style.border = '1px solid #2e3038';
        tooltipEl.style.padding = '16px';
        tooltipEl.style.minWidth = '120px';

        document.body.appendChild(tooltipEl);
      }

      return tooltipEl;
    };

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [{
          data: data.map(d => d.price),
          borderColor: '#4e84ff',
          backgroundColor: 'rgba(78, 132, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#4e84ff',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#4e84ff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
            external: (context) => {
              const { chart, tooltip } = context;
              const tooltipEl = getOrCreateTooltip();

              if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = '0';
                return;
              }

              if (tooltip.body) {
                const price = tooltip.dataPoints[0].parsed.y;
                const date = tooltip.dataPoints[0].label;
                const parts = date.split('/');
                let formattedDate = date;
                
                if (parts.length === 3) {
                  const [month, day, year] = parts;
                  formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                }

                const innerHtml = `
                  <div style="text-align: left;">
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">
                      Price: ${price ? price.toFixed(2) : '0.00'} G
                    </div>
                    <div style="text-align: left;">
                      Date: ${formattedDate}
                    </div>
                  </div>
                `;
                tooltipEl.innerHTML = innerHtml;
              }

              const position = chart.canvas.getBoundingClientRect();
              const bodyPosition = document.body.getBoundingClientRect();

              tooltipEl.style.opacity = '1';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY + 40 + 'px';
            }
          }
        },
        scales: {
          x: {
            display: false,
            grid: {
              display: false
            }
          },
          y: {
            display: false,
            grid: {
              display: false
            },
            min: Math.min(...data.map(d => d.price))
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const tooltipEl = document.getElementById('chartjs-tooltip');
      if (tooltipEl) {
        tooltipEl.remove();
      }
    };
  }, [data]);

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default MiniChart;
