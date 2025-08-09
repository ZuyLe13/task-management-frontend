import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZI18nComponent } from '../../shared/_components/z-i18n/z-i18n.component';
import { ErrorComponent } from '../../shared/_components/error/error.component';
import { Task } from '../../site-managements/task-management/task-list/task-list.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InputComponent } from '../../shared/_components/input/input.component';
import { TaskStatus, TaskStatusService } from '../../shared/_services/task-status.service';
import { TaskService } from '../../shared/_services/task.service';
import { SelectComponent } from '../../shared/_components/select/select.component';
import { TaskType, TaskTypeService } from '../../shared/_services/task-type.service';


@Component({
  selector: 'app-task-upsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZI18nComponent,
    ErrorComponent,
    InputComponent,
    SelectComponent
  ],
  templateUrl: './task-upsert.component.html',
  styleUrl: './task-upsert.component.scss'
})
export class TaskUpsertComponent {
  form: FormGroup;
  assigneeOptions: any[] = [
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' },
    { value: '3', label: 'Alice Johnson' }
  ];
  taskStatuses: TaskStatus[] = [];
  taskTypes: TaskType[] = [];
  selectedTaskStatus!: TaskStatus;
  selectedAssignee!: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskUpsertComponent>,
    private taskStatusService: TaskStatusService,
    private taskService: TaskService,
    private taskTypeService: TaskTypeService,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.form = this.fb.group({
      title: [data?.task?.title || '', [Validators.required, Validators.maxLength(100)]],
      assignee: [data?.task?.assignee || '', Validators.required],
      status: [data?.task?.status || '', Validators.required],
      reporter: [data?.task?.reporter || ''],
      description: [data?.task?.description || ''],
      label: [data?.task?.label || ''],
      taskType: [data?.task?.taskType || ''],
      priority: [data?.task?.priority || ''],
      startDate: [data?.task?.startDate || ''],
      endDate: [data?.task?.endDate || ''],
      comments: [data?.task?.comments?.join(', ') || '']
    });

    this.initData();
  }

  initData(): void {
    this.taskStatusService.getTaskStatuses().subscribe({
      next: (result) => {
        const taskStatusesActive = result.filter(item => item.isActive === true);
        this.taskStatuses = taskStatusesActive;
      },
      error: (error) => {
        console.error('Error fetching task statuses', error);
        this.taskStatuses = [];
      },
    });

    this.taskTypeService.getTaskTypes().subscribe({
      next: (types) => {
        const taskTypesActive = types.filter(item => item.isActive === true);
        this.taskTypes = taskTypesActive;
      },
      error: (err) => console.error('Error loading task types:', err)
    });
  }

  onAssigneeChange(values: any[]) {
    this.selectedAssignee = values.length > 0 ? values[0] : null;
    this.form.get('assignee')?.setValue(this.selectedAssignee);
  }

  onTaskStatusChange(values: any[]) {
    this.selectedTaskStatus = values.length > 0 ? values[0] : null;
    this.form.get('status')?.setValue(this.selectedTaskStatus);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.taskService.createTask(this.form.value).subscribe({
        next: (result) => {
          console.log(result);
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating task status', error);
        }
      });
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }
}
