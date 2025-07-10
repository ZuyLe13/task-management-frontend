import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'z-select',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  @Input() options: any[] = [];
  @Input() placeholder = 'Chọn giá trị';
  @Input() multiple = false;
  @Input() disabled = false;

  @Input() labelKey = 'label';
  @Input() valueKey = 'value';

  @Input() value: any | any[] = null;
  @Output() valueChange = new EventEmitter<any>();

  onValueChange() {
    this.valueChange.emit(this.value);
  }
}
