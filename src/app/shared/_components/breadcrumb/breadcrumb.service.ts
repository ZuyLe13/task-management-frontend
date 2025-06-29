import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Params } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';
import { routerObject } from '../../constants/router.constants';
import { projectSettingsTabMap } from '../../constants/tabs.constants';

export interface BreadcrumbItem {
  label: string;
  path: string;
  queryParams?: Params;
}

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
    const [cleanPath, queryString] = url.split('?');
    const queryParams = new URLSearchParams(queryString);
    const tabParam = queryParams.get('tab');

    const segments = cleanPath.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    let accumulatedPath = '';

    for (const segment of segments) {
      accumulatedPath += (accumulatedPath ? '/' : '') + segment;
      const matched = this.findMatchingRoute(accumulatedPath);
      if (matched) {
        let actualPath = '/' + accumulatedPath;
        if ('defaultChild' in matched && matched.defaultChild) {
          actualPath = '/' + matched.path + '/' + matched.defaultChild;
        }

        breadcrumbs.push({ 
          label: matched.breadcrumb,
          path: actualPath,
          queryParams: undefined
        });
      }
    }

    // ✅ Breadcrumb cuối có query
    if (tabParam && projectSettingsTabMap[tabParam]) {
      breadcrumbs.push({
        label: projectSettingsTabMap[tabParam],
        path: cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath,
        queryParams: { tab: tabParam }
      });
    }

    return breadcrumbs;
  }


  private findMatchingRoute(path: string) {
    for (const key in routerObject) {
      if (Object.prototype.hasOwnProperty.call(routerObject, key)) {
        const route = routerObject[key as keyof typeof routerObject];
        const routePath = route.path;
        const regexPath = routePath.replace(/:\w+/g, '[^/]+');
        const regex = new RegExp(`^${regexPath}$`);
        if (regex.test(path)) {
          return {
            ...route,
            // Optional: Trả thêm param nếu cần (để custom breadcrumb sau này)
            matchedPath: path,
          };
        }
      }
    }
    return null;
  }
}
