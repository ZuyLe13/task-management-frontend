import { Component } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
   breadcrumbs$: Observable<any>;

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}
