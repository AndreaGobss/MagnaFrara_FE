export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginationParams {
  page?: number; // default: 1
  limit?: number; // default: 10
}

export interface SortParams {
  sortBy?: string; // campo per ordinamento
  sort?: 'asc' | 'desc'; // direzione ordinamento
}

export interface QueryParams extends PaginationParams, SortParams {
  // Può essere esteso per altri parametri di query specifici
}
