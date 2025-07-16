import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZI18nComponent } from '../z-i18n/z-i18n.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SelectComponent } from '../select/select.component';

export interface FilterField {
  key: string;
  label: string;
  options?: FilterOption[];
}

export interface FilterOption {
  value: any;
  label: string;
}

export interface AppliedFilter {
  field: FilterField;
  values: any[];
  displayText: string;
}

@Component({
  selector: 'app-multi-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ZI18nComponent,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    SelectComponent
  ],
  templateUrl: './multi-filter.component.html',
  styleUrl: './multi-filter.component.scss'
})
export class MultiFilterComponent {
  @Input() filterFields: FilterField[] = [];
  @Output() filtersChange = new EventEmitter<AppliedFilter[]>();

  isMainDropdownOpen = false;
  isValueDropdownOpen = false;

  selectedField: FilterField | null = null;
  selectedValues: any[] = [];
  appliedFilters: AppliedFilter[] = [];
  
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedInside = target.closest('.multi-filter-container');
    const clickedOverlay = target.closest('.cdk-overlay-container') || target.closest('.cdk-overlay-pane');

    if (!clickedInside && !clickedOverlay) {
      this.closeAllDropdowns();
    }
  }

  toggleMainDropdown() {
    this.isMainDropdownOpen = !this.isMainDropdownOpen;
    this.isValueDropdownOpen = false;
  }

  selectField(field: FilterField) {
    this.selectedField = field;
    this.isMainDropdownOpen = false;
    this.isValueDropdownOpen = true;

    const existing = this.appliedFilters.find(f => f.field.key === field.key);
    this.selectedValues = existing?.values || [];
  }

  onSelectChange() {
    if (!this.selectedField) return;

    const values = this.selectedValues;
    const labels = this.selectedField.options
      ?.filter(o => values.includes(o.value))
      .map(o => o.label) ?? [];

    // this.addFilter({
    //   field: this.selectedField,
    //   values,
    //   displayText: `${this.selectedField.label}: ${labels.join(', ')}`
    // });
    if (values.length === 0) {
      // If no values selected, remove the filter entirely
      this.appliedFilters = this.appliedFilters.filter(f => f.field.key !== this.selectedField!.key);
    } else {
      // Add or update the filter
      this.addFilter({
        field: this.selectedField,
        values,
        displayText: `${this.selectedField.label}: ${labels.join(', ')}`
      });
    }
  }

  addFilter(filter: AppliedFilter) {
    this.appliedFilters = this.appliedFilters.filter(f => f.field.key !== filter.field.key);
    this.appliedFilters.push(filter);
    this.filtersChange.emit(this.appliedFilters);
  }

  removeFilter(filter: AppliedFilter, event: Event) {
    event.stopPropagation();
    this.appliedFilters = this.appliedFilters.filter(f => f !== filter);
    if (this.selectedField && this.selectedField.key === filter.field.key) {
      this.selectedValues = [];
    }
    this.filtersChange.emit(this.appliedFilters);
  }

  clearAllFilters() {
    this.appliedFilters = [];
    if (this.selectedField) {
      this.selectedValues = [];
    }
    this.filtersChange.emit(this.appliedFilters);
  }

  closeAllDropdowns() {
    this.isMainDropdownOpen = false;
    this.isValueDropdownOpen = false;
    this.selectedField = null;
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

  getLabelForValue(value: any): string {
    if (!this.selectedField || !this.selectedField.options) return String(value);
    
    const option = this.selectedField.options.find(o => o.value === value);
    return option ? option.label : String(value);
  }

  removeSelectedValue(valueToRemove: any, event: Event) {
    event.stopPropagation();
    if (!this.selectedField) return;
    this.selectedValues = this.selectedValues.filter(v => v !== valueToRemove);
    this.onSelectChange();
  }

  removeFieldValue(fieldKey: string, valueToRemove: any, event: Event) {
    event.stopPropagation();
    const filter = this.appliedFilters.find(f => f.field.key === fieldKey);
    if (!filter) return;
    const newValues = filter.values.filter(v => v !== valueToRemove);
    
    if (this.selectedField && this.selectedField.key === fieldKey) {
      this.selectedValues = [...newValues];
    }

    if (newValues.length === 0) {
      this.appliedFilters = this.appliedFilters.filter(f => f.field.key !== fieldKey);
    } else {
      const field = this.filterFields.find(f => f.key === fieldKey);
      const labels = field?.options
        ?.filter(o => newValues.includes(o.value))
        .map(o => o.label) ?? [];
      filter.values = newValues;
      filter.displayText = `${field?.label}: ${labels.join(', ')}`;
    }
    
    this.filtersChange.emit(this.appliedFilters);
  }
}
