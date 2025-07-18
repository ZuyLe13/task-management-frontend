import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZI18nComponent } from '../../shared/_components/z-i18n/z-i18n.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputComponent } from "../../shared/_components/input/input.component";
import { ErrorComponent } from '../../shared/_components/error/error.component';

export interface TaskStatusData {
  taskStatus?: any;
}

@Component({
  selector: 'app-task-status-upsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZI18nComponent,
    InputComponent,
    ErrorComponent
],
  templateUrl: './task-status-upsert.component.html',
  styleUrl: './task-status-upsert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusUpsertComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  title: string = '';
  colors: string[] = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
    '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskStatusUpsertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskStatusData
  ) {
    this.isEditMode = !!data?.taskStatus;
    this.title = this.isEditMode ? 'Edit Task Status' : 'Create Task Status';
    
    this.form = this.fb.group({
      name: [data?.taskStatus?.name || '', [Validators.required, Validators.maxLength(100)]],
      color: [data?.taskStatus?.color || this.colors[0], [Validators.required]],
      isActive: [data?.taskStatus?.isActive ?? true],
      isDefault: [data?.taskStatus?.isDefault ?? false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      const taskStatus = {
        ...formValue,
        updatedAt: new Date().toISOString(),
        ...(this.isEditMode ? {} : { createdAt: new Date().toISOString() })
      };

      this.dialogRef.close(taskStatus);
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  selectColor(color: string): void {
    this.form.get('color')?.setValue(color);
    this.form.get('color')?.markAsTouched();
  }
}
