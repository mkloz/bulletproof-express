export class PaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export class PaginationLinks {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;
}

export class Paginated<TData extends object> {
  items: TData[];
  meta: PaginationMeta;
  links: PaginationLinks;
}
