import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'z-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent<T = any> {
  @Input() items: any[] = [];
  @Input() value: any;
  @Input() getName: (item: T) => string = (item) => String(item);
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  open = false;

  select(item: T) {
    if (!this.disabled && this.getValue(item) !== this.value) {
      this.valueChange.emit(this.getValue(item));
      this.open = false;
    }
  }

  getValue(item: T) {
    return (item as any)?.code ?? item;
  }

  getSelectedItemName(): string {
    const selectedItem = this.items?.find(i => this.getValue(i) === this.value);
    return selectedItem !== undefined ? this.getName(selectedItem) : String(this.value);
  }
}
