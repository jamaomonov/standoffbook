import { API_URL } from './config';

interface WeaponDamageInfo {
  arms: number;
  head: number;
  legs: number;
  chest: number;
  stomach: number;
}

interface WeaponDamage {
  armor: WeaponDamageInfo;
  no_armor: WeaponDamageInfo;
}

interface Weapon {
  name: string;
  type_id: number;
  damage: number;
  fire_rate: number;
  recoil: number;
  range: number;
  mobility: number;
  armor_penetration: number;
  penetration_power: number;
  ammo: number;
  cost: number;
  damage_info: WeaponDamage;
}

export interface PriceStats {
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

export interface ItemDetails {
  id: number;
  name: string;
  photo: string;
  type: {
    name: string;
  };
  rarity: {
    name: string;
  };
  category?: {
    name: string;
  } | null;
  collection: {
    name: string;
  };
  weapon: Weapon | null;
  gallery: string[];
  prices?: PriceStats;
}

// Хранилище для активных запросов
const activeRequests = new Map<string, AbortController>();

export const getItemDetails = async (slug: string): Promise<ItemDetails> => {
  // Отменяем предыдущий запрос для этого же slug, если он существует
  if (activeRequests.has(slug)) {
    activeRequests.get(slug)?.abort();
    activeRequests.delete(slug);
  }

  // Создаем новый контроллер для текущего запроса
  const controller = new AbortController();
  activeRequests.set(slug, controller);

  try {
    const response = await fetch(
      `${API_URL}/api/v1/item/${slug}`,
      {
        signal: controller.signal
      }
    );
    
    // Удаляем контроллер после успешного выполнения запроса
    activeRequests.delete(slug);
    
    if (!response.ok) throw new Error('Failed to fetch item details');
    return await response.json();
  } catch (error) {
    // Если ошибка вызвана отменой запроса, не выбрасываем её
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    console.error('Error fetching item details:', error);
    throw error;
  }
}; 