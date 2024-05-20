export const DEFAULT_ITEMS_LIMIT = 10;
export const DEFAULT_PAGE = 1;

export class PaginationOptionsDto {
  page: number = DEFAULT_PAGE;
  limit: number = DEFAULT_ITEMS_LIMIT;
}
