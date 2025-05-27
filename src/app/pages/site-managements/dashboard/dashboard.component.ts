import { Component } from '@angular/core';
import { SideBarComponent } from '../../../shared/_components/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [SideBarComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isCollapsed = false;

  onSidebarToggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
