import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() placeholder: string = 'Chọn giá trị';
  @Input() labelKey = 'label';
  @Input() valueKey = 'value';
  @Input() disabled = false;
  @Input() isMultiSelect = true;

  @Input() value: any[] = [];
  @Output() valueChange = new EventEmitter<any[]>();

  inputControl = new FormControl('');
  filteredOptions: any[] = [];
  dropdownOpen = false;
  selectedValues: any[] = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (this.isMultiSelect) {
      this.selectedValues = Array.isArray(value) ? [...value] : [];
    } else {
      this.selectedValues = value ? [value] : [];
    }
    this.updateInputDisplay();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnInit() {
    this.selectedValues = [...this.value];
    this.filterOptions('');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] || changes['value']) {
      this.selectedValues = [...(this.value || [])];
      this.filterOptions(this.inputControl.value || '');
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.select-container');

    if (!clickedInside) {
      this.dropdownOpen = false;
      this.onTouched();
      if (!this.isMultiSelect) {
        this.updateInputDisplay();
      }
    }
  }

  updateInputDisplay() {
    if (!this.isMultiSelect && this.selectedValues.length > 0) {
      const selectedOption = this.options.find(opt => opt[this.valueKey] === this.selectedValues[0]);
      if (selectedOption) {
        this.inputControl.setValue(selectedOption[this.labelKey], { emitEvent: false });
      }
    } else if (this.isMultiSelect) {
      this.inputControl.setValue('', { emitEvent: false });
    }
  }

  filterOptions(search: string) {
    const lowerSearch = search.toLowerCase();
    
    if (this.isMultiSelect) {
      this.filteredOptions = this.options.filter(
        opt =>
          opt[this.labelKey].toLowerCase().includes(lowerSearch) &&
          !this.selectedValues.includes(opt[this.valueKey])
      );
    } else {
      this.filteredOptions = this.options.filter(
        opt => opt[this.labelKey].toLowerCase().includes(lowerSearch)
      );
    }
  }
  
  toggleDropdown() {
    if (this.disabled) return;
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      if (this.isMultiSelect) {
        this.filterOptions(this.inputControl.value || '');
      } else {
        this.filterOptions('');
      }
    }
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.filterOptions(value);
    this.onChange(this.value);
    this.dropdownOpen = true;
  }

  selectOption(option: any) {
    if (this.isMultiSelect) {
      if (!this.selectedValues.includes(option[this.valueKey])) {
        this.selectedValues.push(option[this.valueKey]);
      }
    } else {
      this.selectedValues = [option[this.valueKey]];
      this.inputControl.setValue(option[this.labelKey]);
      this.dropdownOpen = false;
    }
    this.valueChange.emit(this.selectedValues)
    this.filterOptions('');
  }

  isSelected(option: any): boolean {
    return this.selectedValues.includes(option[this.valueKey]);
  }
}