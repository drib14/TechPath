import api from '../lib/axios';
import type { SearchResults, ApiResponse } from '../types';

export const searchService = {
  async search(query: string): Promise<SearchResults> {
    const { data } = await api.get<ApiResponse<SearchResults>>('/search', {
      params: { q: query },
    });
    return data.data!;
  },
};
