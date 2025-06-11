import axios from 'axios';
import { API_URL } from './config';

interface PriceHistoryResponse {
  data: Array<{
    purchase_price: number;
    Date: string;

  }>;
  stats: {
    price: number;
    per_day: { gold: number; percent: number };
    per_week: { gold: number; percent: number };
    per_month: { gold: number; percent: number };
    per_year: { gold: number; percent: number };
  };
}

export const fetchItemPriceHistory = async (item_id: number) => {
  const encodedName = encodeURIComponent(item_id);
  
  try {
    const response = await axios.get<PriceHistoryResponse>(
      `${API_URL}/api/v1/prices?item_id=${encodedName}`
    );
    
    return response.data.data.map(item => ({
      date: item.Date,
      price: item.purchase_price,
      stats: response.data.stats
    }));
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
}; 