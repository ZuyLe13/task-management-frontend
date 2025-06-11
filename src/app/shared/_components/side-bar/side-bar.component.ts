import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}
@Component({
  selector: 'app-side-bar',
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  menuItems: MenuItem[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: '/assets/icons/dashboard.svg',
      active: true 
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: '/assets/icons/task.svg' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '/assets/icons/setting.svg' 

    }
  ];
  isCollapsed = false;

  onMenuClick(item: MenuItem) {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
  }

  onAddClick() {
    console.log('Add button clicked');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
