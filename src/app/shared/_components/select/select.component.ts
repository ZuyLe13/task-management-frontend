import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { startWith, map } from 'rxjs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ZI18nComponent } from "../z-i18n/z-i18n.component";

@Component({
  selector: 'z-select',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    ZI18nComponent
],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnInit {
  @Input() options: any[] = [];
  @Input() placeholder: string = 'Chọn giá trị';
  @Input() labelKey = 'label';
  @Input() valueKey = 'value';
  @Input() disabled = false;

  @Input() value: any[] = [];
  @Output() valueChange = new EventEmitter<any[]>();

  inputControl = new FormControl('');
  filteredOptions: any[] = [];
  dropdownOpen = false;
  selectedValues: any[] = [];

  ngOnInit() {
    this.selectedValues = [...this.value];
    this.filterOptions('');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && changes['value'].currentValue !== changes['value'].previousValue) {
      this.selectedValues = [...(changes['value'].currentValue || [])];
      this.filterOptions(this.inputControl.value || '');
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.select-container'); // Thêm class cho container của z-select

    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  filterOptions(search: string) {
    const lowerSearch = search.toLowerCase();
    this.filteredOptions = this.options.filter(
      opt =>
        opt[this.labelKey].toLowerCase().includes(lowerSearch) &&
        !this.selectedValues.includes(opt[this.valueKey])
    );
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.filterOptions(this.inputControl.value || '');
    }
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.filterOptions(value);
    this.dropdownOpen = true;
  }

  selectOption(option: any) {
    this.selectedValues.push(option[this.valueKey]);
    this.valueChange.emit(this.selectedValues);
    this.inputControl.setValue('');
    this.filterOptions('');
  }

  isSelected(option: any): boolean {
    return this.selectedValues.includes(option[this.valueKey]);
  }
}