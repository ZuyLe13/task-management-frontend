import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';

export interface Action {
  label: string;
  icon: string;
  action: (row: any) => void;
}

@Component({
  selector: 'z-action',
  imports: [
    CommonModule
  ],
  templateUrl: './table-action.component.html',
  styleUrl: './table-action.component.scss'
})
export class TableActionComponent {
  @Input() actions: Action[] = [];
  @Input() row: any;
  isMenuOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
