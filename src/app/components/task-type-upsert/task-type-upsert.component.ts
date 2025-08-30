import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZI18nComponent } from '../../shared/_components/z-i18n/z-i18n.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputComponent } from "../../shared/_components/input/input.component";
import { ErrorComponent } from '../../shared/_components/error/error.component';
import { TaskType, TaskTypeService } from '../../shared/_services/task-mngts/task-type.service';

@Component({
  selector: 'app-task-type-upsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZI18nComponent,
    InputComponent,
    ErrorComponent
  ],
  templateUrl: './task-type-upsert.component.html',
  styleUrl: './task-type-upsert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTypeUpsertComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  title: string = '';

  constructor(
    private fb: FormBuilder,
    private taskTypeService: TaskTypeService,
    private dialogRef: MatDialogRef<TaskTypeUpsertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskType: TaskType | null },
  ) {
    this.isEditMode = !!data.taskType;
    this.title = this.isEditMode ? 'Edit Task Type' : 'Create Task Type';

    this.form = this.fb.group({
      name: [data.taskType?.name || '', [Validators.required, Validators.maxLength(100)]],
      icon: [data.taskType?.icon || ''],
      isActive: [data.taskType?.isActive ?? true],
      isSubTask: [data.taskType?.isSubTask ?? false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditMode) {
        this.updateTaskType(this.form.value);
      } else {
        this.createTaskType(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  createTaskType(formData: TaskType): void {
    this.taskTypeService.createTaskType(formData).subscribe({
      next: (result) => {
        if (result.success) {
          this.dialogRef.close(result);
        } else {
          console.error('Server returned error:', result.message);
        }
      },
      error: (error) => {
        console.error('Error creating task type:', error);
      }
    });
  }

  updateTaskType(formData: Partial<TaskType>): void {
    const taskTypeId = this.data.taskType!._id!;
    this.taskTypeService.updateTaskType(taskTypeId, formData).subscribe({
      next: (result) => {
        if (result.success) {
          this.dialogRef.close(result);
        } else {
          console.error('Server returned error:', result.message);
        }
      },
      error: (error) => {
        console.error('Error updating task type:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}
