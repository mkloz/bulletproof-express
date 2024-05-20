import { Request } from 'express';
import { format } from 'url';

interface Data<T> {
  data: T;
}

export class Helper {
  private static instance: Helper;

  constructor() {
    if (Helper.instance) {
      return Helper.instance;
    }
    Helper.instance = this;
  }

  static getInstance() {
    return Helper.instance;
  }

  static getFullUrl(req: Request) {
    const [pathname] = req.originalUrl.split('?');

    return format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: pathname,
    });
  }

  public static objToQuery(
    obj: Record<string, string | number | boolean>,
  ): string {
    return Object.keys(obj)
      .map(
        (k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k] || '')}`,
      )
      .join('&');
  }

  public static wrapIntoDataField<T>(data: T): Data<T> {
    return { data };
  }
}
