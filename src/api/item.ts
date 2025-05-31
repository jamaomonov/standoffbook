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

export const getItemDetails = async (slug: string): Promise<ItemDetails> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/item/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch item details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching item details:', error);
    throw error;
  }
}; 