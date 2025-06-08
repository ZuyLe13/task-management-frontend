import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// interface MenuItem {
//   icon: string;
//   label: string;
//   children?: MenuItem[];
//   isOpen?: boolean;
// }

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
    { id: 'overview', label: 'Overview', icon: 'grid', active: true },
    { id: 'tasks', label: 'Tasks', icon: 'clipboard' },
    { id: 'settings', label: 'Settings', icon: 'cog' }
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
