import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { ZI18nComponent } from "../z-i18n/z-i18n.component";

@Component({
  selector: 'z-error',
  standalone: true,
  imports: [CommonModule, ZI18nComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  @Input() controlName!: string;
  @Input() customMessage?: string;

  constructor(private formGroupDirective: FormGroupDirective) {}

  get control(): AbstractControl | null {
    return this.formGroupDirective.form.get(this.controlName);
  }
}
