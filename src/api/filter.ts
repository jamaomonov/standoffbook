import { API_URL } from "./config";

interface Filter {
  id: number;
  name: string;
}

interface FilterParamsResponse {
  types: Filter[];
  collections: Filter[];
  rarities: Filter[];
  categories: Filter[];
  weapons: Filter[];
}

interface FilterParams {
  type_id?: number;
  collection_id?: number;
  rarity_id?: number;
  category_id?: number;
  weapon_id?: number;
  page?: number;
  page_size?: number;
}

interface FilteredItem {
  id: number;
  item_name: string;
  slug: string;
  photo: string;
  rarity: string;
  category: string;
  collection: string;
}

interface FilteredItemResponse {
  total: number;
  items: FilteredItem[];
}

export const getFilterParams = async (signal?: AbortSignal): Promise<FilterParamsResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/filter-params`, {
      method: 'GET',
      signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request was aborted');
      }
      throw new Error(`Failed to fetch filter params: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
};

export const getFilteredItems = async (params: FilterParams, signal?: AbortSignal): Promise<FilteredItemResponse> => {
  try {
    // Создаем URLSearchParams для query string
    const searchParams = new URLSearchParams();
    
    // Добавляем только определенные параметры
    if (params.type_id) searchParams.append('type_id', params.type_id.toString());
    if (params.collection_id) searchParams.append('collection_id', params.collection_id.toString());
    if (params.rarity_id) searchParams.append('rarity_id', params.rarity_id.toString());
    if (params.category_id) searchParams.append('category_id', params.category_id.toString());
    if (params.weapon_id) searchParams.append('weapon_id', params.weapon_id.toString());
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.page_size) searchParams.append('page_size', params.page_size.toString());

    const response = await fetch(`${API_URL}/api/v1/filter?${searchParams.toString()}`, {
      method: 'GET',
      signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.status === 404) {
      return { total: 0, items: [] }; // Возвращаем пустой результат если ничего не найдено
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request was aborted');
      }
      throw new Error(`Failed to fetch filtered items: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
};
  