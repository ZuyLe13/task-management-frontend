import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterField {
  key: string;
  label: string;
  type?: any;
  options?: FilterOption[];
}

export interface FilterOption {
  value: any;
  label: string;
  color?: string; // Cho trường hợp status có màu
}

export interface AppliedFilter {
  field: FilterField;
  values: any[];
  displayText: string;
}

@Component({
  selector: 'app-multi-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-filter.component.html',
  styleUrl: './multi-filter.component.scss'
})
export class MultiFilterComponent {
  @Input() filterFields: FilterField[] = [];
  @Output() filtersChange = new EventEmitter<AppliedFilter[]>();

  isMainDropdownOpen = false;
  isValueDropdownOpen = false;
  selectedField: FilterField | null = null;
  selectedOptions: FilterOption[] = [];
  textInputValue = '';
  appliedFilters: AppliedFilter[] = [];

  ngOnInit() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target || !(event.target as Element).closest('app-multi-filter')) {
        this.closeAllDropdowns();
      }
    });
  }

  toggleMainDropdown() {
    this.isMainDropdownOpen = !this.isMainDropdownOpen;
    this.isValueDropdownOpen = false;
  }

  selectField(field: FilterField) {
    this.selectedField = field;
    this.isMainDropdownOpen = false;
    this.isValueDropdownOpen = true;
    this.selectedOptions = [];
    this.textInputValue = '';
  }

  closeValueDropdown() {
    this.isValueDropdownOpen = false;
    this.selectedField = null;
  }

  closeAllDropdowns() {
    this.isMainDropdownOpen = false;
    this.isValueDropdownOpen = false;
    this.selectedField = null;
  }

  toggleOption(option: FilterOption) {
    const index = this.selectedOptions.findIndex(o => o.value === option.value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      if (this.selectedField?.type === 'select') {
        this.selectedOptions = [option];
      } else {
        this.selectedOptions.push(option);
      }
    }
  }

  isOptionSelected(option: FilterOption): boolean {
    return this.selectedOptions.some(o => o.value === option.value);
  }

  applySelectedOptions() {
    if (this.selectedField && this.selectedOptions.length > 0) {
      const displayText = this.selectedField.label + ': ' + 
        this.selectedOptions.map(o => o.label).join(', ');
      
      this.addFilter({
        field: this.selectedField,
        values: this.selectedOptions.map(o => o.value),
        displayText
      });
    }
    this.closeValueDropdown();
  }

  applyTextFilter() {
    if (this.selectedField && this.textInputValue.trim()) {
      const displayText = this.selectedField.label + ': ' + this.textInputValue;
      
      this.addFilter({
        field: this.selectedField,
        values: [this.textInputValue.trim()],
        displayText
      });
    }
    this.closeValueDropdown();
  }

  addFilter(filter: AppliedFilter) {
    // Remove existing filter for the same field
    this.appliedFilters = this.appliedFilters.filter(f => f.field.key !== filter.field.key);
    // Add new filter
    this.appliedFilters.push(filter);
    this.filtersChange.emit(this.appliedFilters);
  }

  removeFilter(filter: AppliedFilter, event: Event) {
    event.stopPropagation();
    this.appliedFilters = this.appliedFilters.filter(f => f !== filter);
    this.filtersChange.emit(this.appliedFilters);
  }

  clearAllFilters() {
    this.appliedFilters = [];
    this.filtersChange.emit(this.appliedFilters);
  }

  getFieldTypeLabel(type: string): string {
    switch (type) {
      case 'select': return 'Chọn một';
      case 'multiselect': return 'Chọn nhiều';
      case 'text': return 'Văn bản';
      case 'date': return 'Ngày tháng';
      default: return '';
    }
  }

  getSelectedLabels(fieldKey: string): string[] {
    const found = this.appliedFilters.find(f => f.field.key === fieldKey);
    if (!found) return [];

    // Tìm label tương ứng từ options để hiển thị
    const field = this.filterFields.find(f => f.key === fieldKey);
    if (!field || !field.options) return found.values;

    return found.values
      .map(val => field.options!.find(o => o.value === val)?.label)
      .filter((label): label is string => !!label);
  }

  getSelectedLabelsWithValues(fieldKey: string): { label: string; value: any }[] {
    const found = this.appliedFilters.find(f => f.field.key === fieldKey);
    if (!found) return [];

    const field = this.filterFields.find(f => f.key === fieldKey);
    if (!field || !field.options) return [];

    return found.values.map(val => {
      const label = field.options?.find(o => o.value === val)?.label ?? String(val);
      return { label, value: val };
    });
  }

  removeFieldValue(fieldKey: string, valueToRemove: any, event: Event) {
    event.stopPropagation(); // Ngăn click lan sang mở dropdown

    const filter = this.appliedFilters.find(f => f.field.key === fieldKey);
    if (!filter) return;

    const newValues = filter.values.filter(v => v !== valueToRemove);

    if (newValues.length === 0) {
      // Nếu hết giá trị → xóa toàn bộ filter
      this.appliedFilters = this.appliedFilters.filter(f => f.field.key !== fieldKey);
    } else {
      filter.values = newValues;
      filter.displayText = `${filter.field.label}: ${this.getSelectedLabelsWithValues(fieldKey)
        .filter(v => v.value !== valueToRemove)
        .map(v => v.label)
        .join(', ')}`;
    }

    this.filtersChange.emit(this.appliedFilters);
  }


  trackByFilter(index: number, filter: AppliedFilter): string {
    return filter.field.key;
  }

  trackByField(index: number, field: FilterField): string {
    return field.key;
  }

  trackByOption(index: number, option: FilterOption): any {
    return option.value;
  }
}
