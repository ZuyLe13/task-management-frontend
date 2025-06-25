import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { TranslateService } from '@ngx-translate/core';
import { routerObject } from '../../constants/router.constants';
import { InputComponent } from "../input/input.component";

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, BreadcrumbComponent, InputComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isSearchOpen = false;
  isOpen = false;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  viewProfile() {
    this.router.navigate([routerObject.profile.path]);
  }

  logout() {
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
