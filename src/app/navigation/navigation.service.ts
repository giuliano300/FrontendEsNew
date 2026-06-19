import { Injectable } from '@angular/core';
import {
  BreadcrumbItem,
  mainNavigation,
  NavigationItem,
  NavigationSearchItem,
  routeTitles,
  userNavigation
} from './navigation.model';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly mainNavigation = mainNavigation;
  readonly userNavigation = userNavigation;
  readonly searchableItems = this.buildSearchIndex([...mainNavigation, ...userNavigation]);

  getBreadcrumbs(url: string): BreadcrumbItem[] {
    const path = this.normalizePath(url);

    if (!path || path === 'dashboard') {
      return [{ label: 'Home', path: '/dashboard' }];
    }

    const navTrail = this.findTrail(path, mainNavigation) ?? this.findTrail(path, userNavigation);
    if (navTrail) {
      return [{ label: 'Home', path: '/dashboard' }, ...navTrail];
    }

    return this.inferBreadcrumbs(path);
  }

  isActive(item: NavigationItem, url: string): boolean {
    const path = this.normalizePath(url);

    if (item.children?.some(child => this.isActive(child, url))) {
      return true;
    }

    if (!item.path) {
      return false;
    }

    const itemPath = this.normalizePath(item.path);
    return item.exact ? path === itemPath : path === itemPath || path.startsWith(`${itemPath}/`);
  }

  search(query: string, limit = 8): NavigationSearchItem[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return this.searchableItems
      .filter(item => {
        const haystack = `${item.group} ${item.label} ${item.keywords.join(' ')}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, limit);
  }

  private inferBreadcrumbs(path: string): BreadcrumbItem[] {
    const [base] = path.split('/');
    const title = routeTitles[base] ?? this.toTitle(base);
    const parent = this.inferParent(base);

    return [
      { label: 'Home', path: '/dashboard' },
      ...(parent ? [parent] : []),
      { label: title }
    ];
  }

  private inferParent(base: string): BreadcrumbItem | null {
    if (base.includes('Raccomandata') || base.includes('Lettera') || base.includes('Agol') || base.includes('Telegramma') || base.includes('Pacco') || base.includes('Visura') || ['compilaBollettino', 'calcoloPreventivo', 'riepilogoSpedizione'].includes(base)) {
      return { label: 'Nuova spedizione', path: '/nuovaSpedizione' };
    }

    if (['addSender', 'modSender', 'addRecipient', 'modRecipient', 'addUser', 'modUser', 'addLogo'].includes(base)) {
      return { label: 'Area personale', path: '/datiPersonali' };
    }

    if (base.startsWith('dettaglio') || base.startsWith('archivio')) {
      return { label: 'Archivio', path: '/archivioSpedizioni' };
    }

    return null;
  }

  private findTrail(path: string, items: NavigationItem[], parent?: NavigationItem): BreadcrumbItem[] | null {
    for (const item of items) {
      const itemPath = item.path ? this.normalizePath(item.path) : '';

      if (itemPath && (path === itemPath || path.startsWith(`${itemPath}/`))) {
        return [
          ...(parent ? [{ label: parent.label, path: parent.path }] : []),
          { label: item.label, path: item.path }
        ];
      }

      if (item.children) {
        const childTrail = this.findTrail(path, item.children, item);

        if (childTrail) {
          return childTrail;
        }
      }
    }

    return null;
  }

  private buildSearchIndex(items: NavigationItem[], parentLabel = ''): NavigationSearchItem[] {
    return items.flatMap(item => {
      const group = parentLabel || item.label;
      const ownItem = item.path
        ? [{
            label: item.label,
            path: item.path,
            group,
            keywords: item.keywords ?? []
          }]
        : [];

      return [
        ...ownItem,
        ...(item.children ? this.buildSearchIndex(item.children, item.label) : [])
      ];
    });
  }

  private normalizePath(url: string): string {
    return url.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '');
  }

  private toTitle(value: string): string {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, char => char.toUpperCase());
  }
}
