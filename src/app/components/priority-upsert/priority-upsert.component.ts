import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZI18nComponent } from '../../shared/_components/z-i18n/z-i18n.component';
import { ErrorComponent } from '../../shared/_components/error/error.component';
import { Priority, PriorityService } from '../../shared/_services/priority.service';
import { InputComponent } from '../../shared/_components/input/input.component';

@Component({
  selector: 'app-priority-upsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    ZI18nComponent,
    ErrorComponent,
    InputComponent
  ],
  templateUrl: './priority-upsert.component.html',
  styleUrl: './priority-upsert.component.scss'
})
export class PriorityUpsertComponent {
  form: FormGroup;
  isEditMode: boolean = false;
  title: string = '';
  colors: string[] = [
    '#cccccc', '#007bff', '#28a745', '#dc3545', '#ffc107',
    '#17a2b8', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14'
  ];

  constructor(
    private fb: FormBuilder,
    private priorityService: PriorityService,
    private dialogRef: MatDialogRef<PriorityUpsertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { priority: Priority | null},
  ) {
    this.isEditMode = !!data?.priority;
    this.title = this.isEditMode ? 'Edit Priority' : 'Create Priority';

    this.form = this.fb.group({
      name: [data?.priority?.name || '', [Validators.required, Validators.maxLength(100)]],
      color: [data?.priority?.color || this.colors[0], [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)]],
      level: [data?.priority?.level || 1, [Validators.required, Validators.min(1), Validators.max(9)]],
      isActive: [data?.priority?.isActive ?? true],
      isDefault: [data?.priority?.isDefault ?? false]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data?.priority) {
      this.form.patchValue(this.data?.priority);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditMode) {
        this.updatePriority(this.form.value);
      } else {
        this.createPriority(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  createPriority(formData: Priority): void {
    this.priorityService.createPriority(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialogRef.close(response);
        } else {
          console.error('Server returned error:', response.message);
          alert(`Error: ${response.message}`);
        }
      },
      error: (error) => {
        console.error('Error creating task type:', error);
      }
    });
  }

  updatePriority(formData: Partial<Priority>): void {
    const priorityId = this.data.priority!._id!;
    this.priorityService.updatePriority(priorityId, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialogRef.close(response);
        } else {
          console.error('Server returned error:', response.message);
        }
      },
      error: (error) => {
        console.error('Error updating task type:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  selectColor(color: string): void {
    this.form.get('color')?.setValue(color);
    this.form.get('color')?.markAsTouched();
  }
}
