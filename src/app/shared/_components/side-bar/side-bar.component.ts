import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { ZI18nComponent } from '../z-i18n/z-i18n.component';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  path: string;
}
@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterModule, ZI18nComponent],
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
      id: 'tasks', 
      label: 'Tasks', 
      icon: 'docs',
      path: '/task-list'
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
      icon: 'settings',
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
      item.active = currentUrl.startsWith(item.path);
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  onAddClick() {
    console.log('Add button clicked');
  }
}
