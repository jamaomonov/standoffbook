import { API_URL } from './config';

export interface Rarity {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface SearchResult {
  id: number;
  name: string;
  photo: string;
  rarity: Rarity;
  category: Category;
  slug: string;
}

export const searchItems = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`${API_URL}/api/v1/items/search?name=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search request failed');
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}; 