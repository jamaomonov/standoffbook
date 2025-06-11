import { API_URL } from './config';

export interface WeekData {
  Date: string;
  Name: string;
  purchase_price: string;
}

export interface ItemPrice {
  price_now: number;
  per_day_percent: number;
  per_day_gold: number;
  per_week_percent: number;
  per_week_gold: number;
  per_month_percent: number;
  per_month_gold: number;
  per_year_percent: number;
  per_year_gold: number;
}

export interface ItemCategory {
  name: string;
}

export interface ItemStatistic {
  id: number;
  name: string;
  slug: string;
  photo: string;
  category: string;
  rarity: string;
  collection: string;
  price: ItemPrice;
  week_data: WeekData[];
}

export interface StatisticsResponse {
  total_items: number;
  items: ItemStatistic[];
}

export type SortBy = 'price_now' | 'per_day' | 'per_week' | 'per_month' | 'per_year';
export type SortOrder = 'asc' | 'desc';

// Хранилище для активных запросов
const activeRequests = new Map<string, AbortController>();

export const getItemsStatistics = async (
  page: number = 1,
  pageSize: number = 10,
  sortBy: SortBy = 'per_week',
  sortOrder: SortOrder = 'desc'
): Promise<StatisticsResponse> => {
  const requestKey = `${page}-${pageSize}-${sortBy}-${sortOrder}`;
  
  // Отменяем предыдущий запрос с такими же параметрами, если он существует
  if (activeRequests.has(requestKey)) {
    activeRequests.get(requestKey)?.abort();
    activeRequests.delete(requestKey);
  }

  // Создаем новый контроллер для текущего запроса
  const controller = new AbortController();
  activeRequests.set(requestKey, controller);

  try {
    const response = await fetch(
      `${API_URL}/api/v1/items/statistics?page=${page}&page_size=${pageSize}&sort_by=${sortBy}&sort_order=${sortOrder}`,
      {
        signal: controller.signal
      }
    );
    
    // Удаляем контроллер после успешного выполнения запроса
    activeRequests.delete(requestKey);
    
    if (!response.ok) throw new Error('Failed to fetch items statistics');
    return await response.json();
  } catch (error) {
    // Если ошибка вызвана отменой запроса, не выбрасываем её
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    console.error('Error fetching items statistics:', error);
    throw error;
  }
}; 