import { Helper } from '../../utils/helpers/helper';
import { Paginated, PaginationLinks, PaginationMeta } from './paginated.dto';
import { PaginationOptionsDto } from './pagination-options.dto';

export interface IPag<TData> extends PaginationOptionsDto {
  data: TData[];
  count: number;
  route: string;
}

export class Paginator {
  private static createMeta<TData extends object>(
    opt: IPag<TData>,
  ): PaginationMeta {
    return {
      itemCount: opt.count,
      totalItems: opt.data.length,
      itemsPerPage: opt.limit,
      currentPage: opt.page,
    };
  }

  private static createLinks<TData extends object>(
    opt: IPag<TData>,
    extraQuery?: Record<string, string | number>,
  ): PaginationLinks {
    const pageCount = Math.ceil(opt.count / opt.limit) | 0;
    const extra: string = extraQuery ? `&${Helper.objToQuery(extraQuery)}` : '';

    return {
      first: `${opt.route}?limit=${opt.limit}${extra}`,
      previous:
        opt.page > 1
          ? `${opt.route}?page=${opt.page - 1}&limit=${opt.limit}${extra}`
          : null,
      next:
        opt.page < pageCount
          ? `${opt.route}?page=${opt.page + 1}&limit=${opt.limit}${extra}`
          : null,
      last: `${opt.route}?page=${pageCount}&limit=${opt.limit}${extra}`,
    };
  }

  public static paginate<TData extends object>(
    opt: IPag<TData>,
    extraQuery?: Record<string, string | number>,
  ): Paginated<TData> {
    return {
      items: opt.data,
      links: Paginator.createLinks(opt, extraQuery),
      meta: Paginator.createMeta(opt),
    };
  }
}
