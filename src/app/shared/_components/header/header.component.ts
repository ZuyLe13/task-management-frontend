import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, BreadcrumbComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isSearchOpen = false;
  isOpen = false;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {}

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  closeSearch() {
    this.isSearchOpen = false;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  viewProfile() {
    console.log('Go to Profile Page');
  }

  logout() {
    console.log('Logout');
    this.authService.signOut();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper')) {
      this.closeDropdown();
    }
  }

  switchLang(lang: string) {
    this.translateService.use(lang);
  }
}
