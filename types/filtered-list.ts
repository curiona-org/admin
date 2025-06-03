export type FilteredList<T = unknown> = {
  total: number;
  total_pages: number;
  current_page: number;
  items: T[];
};
