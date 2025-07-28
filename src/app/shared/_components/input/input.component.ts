import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'z-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder = '';
  @Input() class = '';
  @Input() disabled = false;
  @Input() suffix: string = '';
  @Input() options: any[] = [];
  @Input() defaultValue: string | number = '';
  @Input() valueField: string = 'value';
  @Input() labelField: string = 'label';
  
  value: string | number = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  writeValue(value: any): void {
    this.value = value !== null && value !== undefined ? value : this.type === 'select' ? this.defaultValue : '';
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
