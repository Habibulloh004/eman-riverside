import apiClient from './client';

export interface EstateImage {
  dir_id: number;
  dir_name: string;
  file_id: number;
  file_name: string;
  file_ext: string;
  file_url: string;
  is_title: number;
  img_type?: string;
}

export interface EstateImageGroup {
  id: number;
  name: string;
  images: EstateImage[];
}

export interface Estate {
  id: number;
  parent_id: number;
  complex_id: number;
  plan_id: number;
  type: string;
  activity: string;
  category: string;
  category_name: string;
  status: string;
  status_name: string;
  is_published: boolean;
  is_reserved: boolean;
  is_sold: boolean;
  is_hot: boolean;
  estate_price: number;
  estate_price_human: string;
  estate_price_m2: number;
  estate_currency: string;
  estate_area: number;
  estate_rooms: number;
  estate_floor: number;
  estate_floors_in_house: number;
  address: string;
  title: string;
  title_image: string;
  plan_image: string;
  images: EstateImageGroup[];
  description: string;
  estate_inServiceDate_human: string;
  company_name: string;
  contact_phones: string[];
  [key: string]: unknown;
}

export interface EstateFilters {
  type?: string;
  activity?: string;
  category?: string;
  rooms?: number | number[];
  price_from?: number;
  price_to?: number;
  area_from?: number;
  area_to?: number;
  floor?: number | number[];
  floor_from?: number;
  floor_to?: number;
  limit?: number;
  offset?: number;
}

export interface EstateListResponse {
  items: Estate[];
  total: number;
}

export const estatesApi = {
  list: async (filters?: EstateFilters): Promise<Estate[]> => {
    const searchParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle arrays (rooms, floor)
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    const query = searchParams.toString();
    // Macro API returns array directly, not wrapped in {data: [...]}
    const response = await apiClient.get<Estate[]>(`/api/estate/list${query ? `?${query}` : ''}`);
    return Array.isArray(response) ? response : [];
  },

  // Paginated list with total count
  listPaginated: async (filters?: EstateFilters): Promise<EstateListResponse> => {
    const searchParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    const query = searchParams.toString();
    const response = await apiClient.get<Estate[] | EstateListResponse>(`/api/estate/list${query ? `?${query}` : ''}`);

    // Handle both array response and paginated response
    if (Array.isArray(response)) {
      return { items: response, total: response.length };
    }
    return response;
  },

  getById: async (id: number): Promise<Estate | null> => {
    // Macro API doesn't have getById, so we fetch all and filter
    // Use same params as catalog list page
    const response = await apiClient.get<Estate[]>(`/api/estate/list?type=living`);
    const estates = Array.isArray(response) ? response : [];
    // Compare as numbers to handle string/number type mismatch
    return estates.find(e => Number(e.id) === Number(id)) || null;
  },
};
