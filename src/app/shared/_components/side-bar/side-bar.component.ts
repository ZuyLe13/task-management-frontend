import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { ZI18nComponent } from '../z-i18n/z-i18n.component';
import { MatTooltipModule } from '@angular/material/tooltip';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  active?: boolean;
  children?: MenuItem[];
  expanded?: boolean;
}
@Component({
  selector: 'app-side-bar',
  imports: [
    CommonModule, 
    RouterModule,
    ZI18nComponent,
    MatTooltipModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  menuItems: MenuItem[] = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: 'grid_view',
      active: true,
      path: '/dashboard'
    },
    { 
      id: 'timeline', 
      label: 'Timeline', 
      icon: 'view_timeline',
      path: '/timeline'
    },
    { 
      id: 'taskManagement', 
      label: 'Task Management', 
      icon: 'docs',
      path: '/task-mngt',
      expanded: false,
      children: [
        {
          id: 'task-list',
          label: 'Task List',
          icon: 'view_kanban',
          path: '/task-mngt/task-list'
        },
        {
          id: 'project-settings',
          label: 'Project Settings',
          icon: 'settings',
          path: '/task-mngt/project-settings'
        }
      ]
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: 'send',
      path: '/messages'
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: 'drive_folder_upload',
      path: '/documents'
    },
    { 
      id: 'myProfile', 
      label: 'My Profile', 
      icon: 'account_circle',
      path: '/profile'
    },
  ];
  isCollapsed = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveMenu(event.urlAfterRedirects);
      });

    this.updateActiveMenu(this.router.url);
  }

  updateActiveMenu(currentUrl: string) {
    this.menuItems.forEach(item => {
      item.active = false;
      item.expanded = false;

      if (item.children) {
        item.children.forEach(child => {
          child.active = !!child.path && currentUrl.startsWith(child.path);
          if (child.active) {
            item.expanded = true; // mở submenu chứa route hiện tại
          }
        });
      } else {
        item.active = !!item.path && currentUrl.startsWith(item.path);
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubmenu(item: MenuItem) {
    item.expanded = !item.expanded;
    if (item.expanded && (item.children?.length ?? 0) > 0) {
      const defaultChildPath = item.children![0].path;
      if (defaultChildPath) {
        this.router.navigateByUrl(defaultChildPath);
      }
    }
  }
}
