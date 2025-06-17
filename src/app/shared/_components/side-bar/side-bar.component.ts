import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  path: string;
}
@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  menuItems: MenuItem[] = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: '/assets/icons/dashboard.svg',
      active: true,
      path: '/dashboard'
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: '/assets/icons/task.svg',
      path: '/task-list'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '/assets/icons/setting.svg',
      path: '/settings'

    }
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
