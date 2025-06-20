import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';
import { routerObject } from '../../constants/router.constants';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  constructor(private router: Router) {}

  get breadcrumbs$(): Observable<any[]> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(new NavigationEnd(0, this.router.url, this.router.url)),
      map(() => this.buildBreadcrumb(this.router.url))
    );
  }

  private buildBreadcrumb(url: string): any[] {
    if (url === '/' || url === '') {
      return [{ label: routerObject.dashboard.breadcrumb, url: routerObject.dashboard.path }];
    }

    const segments = url.split('/').filter(Boolean);
    const breadcrumbs: any[] = [];
    let accumulatedUrl = '';

    for (const segment of segments) {
      accumulatedUrl += `/${segment}`;
      const matched = this.findMatchingRoute(accumulatedUrl);
      if (matched) {
        breadcrumbs.push({ label: matched.breadcrumb, url: accumulatedUrl });
      }
    }
    return breadcrumbs;
  }

  private findMatchingRoute(path: string) {
    for (const key in routerObject) {
      if (Object.prototype.hasOwnProperty.call(routerObject, key)) {
        const route = routerObject[key as keyof typeof routerObject];
        const regexPath = route.path.replace(/:\w+/g, '[^/]+');
        const regex = new RegExp(`^${regexPath}$`);
        if (regex.test(path)) return route;
      }
    }
    return null;
  }
}
