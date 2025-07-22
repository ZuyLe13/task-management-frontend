import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZI18nComponent } from '../../shared/_components/z-i18n/z-i18n.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputComponent } from "../../shared/_components/input/input.component";
import { ErrorComponent } from '../../shared/_components/error/error.component';
import { TaskStatus, TaskStatusService } from '../../shared/_services/task-status.service';


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
    private taskStatusService: TaskStatusService,
    private dialogRef: MatDialogRef<TaskStatusUpsertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskStatus: TaskStatus | null},
  ) {
    this.isEditMode = !!data?.taskStatus;
    this.title = this.isEditMode ? 'Edit Task Status' : 'Create Task Status';
    
    this.form = this.fb.group({
      name: [data?.taskStatus?.name || '', [Validators.required, Validators.maxLength(100)]],
      color: [data?.taskStatus?.color || this.colors[0], [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)]],
      isActive: [data?.taskStatus?.isActive ?? true],
      isDefault: [data?.taskStatus?.isDefault ?? false]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data?.taskStatus) {
      this.form.patchValue(this.data?.taskStatus);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const observable = this.isEditMode
        ? this.taskStatusService.updateTaskStatus(this.data.taskStatus!._id!, this.form.value)
        : this.taskStatusService.createTaskStatus(this.form.value);

      observable.subscribe({
        next: (result: TaskStatus) => {
          this.form.reset({ name: '', color: '#007bff', isActive: true, isDefault: false });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error(`${this.isEditMode ? 'Error updating task status' : 'Error creating task status'}:`, error);
        }
      });
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
