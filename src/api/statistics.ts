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

export interface ItemStatistic {
  id: number;
  name: string;
  slug: string;
  photo: string;
  rarity: string;
  price: ItemPrice;
  week_data: WeekData[];
}

export type SortBy = 'price_now' | 'per_day' | 'per_week' | 'per_month' | 'per_year';

export const getItemsStatistics = async (
  page: number = 1,
  pageSize: number = 10,
  sortBy: SortBy = 'per_week'
): Promise<ItemStatistic[]> => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/items/statistics?page=${page}&page_size=${pageSize}&sort_by=${sortBy}`
    );
    if (!response.ok) throw new Error('Failed to fetch items statistics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching items statistics:', error);
    throw error;
  }
}; 