import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZI18nComponent } from '../../shared/_components/z-i18n/z-i18n.component';
import { ErrorComponent } from '../../shared/_components/error/error.component';
import { Task } from '../../site-managements/task-management/task-list/task-list.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InputComponent } from '../../shared/_components/input/input.component';
import { TaskStatus, TaskStatusService } from '../../shared/_services/task-mngts/task-status.service';
import { SelectComponent } from '../../shared/_components/select/select.component';
import { TaskType, TaskTypeService } from '../../shared/_services/task-mngts/task-type.service';
import { TaskService } from '../../shared/_services/task-mngts/task.service';
import { Priority, PriorityService } from '../../shared/_services/task-mngts/priority.service';


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
  priorities: Priority[] = [];
  selectedTaskStatus!: TaskStatus;
  selectedTaskType!: TaskType;
  selectedPriority!: Priority;
  selectedAssignee!: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskUpsertComponent>,
    private taskStatusService: TaskStatusService,
    private taskService: TaskService,
    private taskTypeService: TaskTypeService,
    private priorityService: PriorityService,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task, initialStatus?: string }
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

        if (!this.data?.task?.status) {
          if (this.data?.initialStatus) {
            this.form.patchValue({
              status: this.data.initialStatus
            });
          } else {
            const defaultTaskStatus = this.taskStatuses.find(status => status.isDefault === true);
            if (defaultTaskStatus) {
              this.form.patchValue({
                status: defaultTaskStatus.code
              });
            }
          }
        }
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

    this.priorityService.getPriorities().subscribe({
      next: (priorities) => {
        const prioritiesActive = priorities.filter(item => item.isActive === true);
        this.priorities = prioritiesActive;

        if (!this.data?.task?.priority) {
          const defaultPriority = this.priorities.find(p => p.isDefault === true);
          if (defaultPriority) {
            this.form.patchValue({
              priority: defaultPriority.code
            });
          }
        }
      },
      error: (err) => console.error('Error loading priorities:', err)
    });
  }

  private onSelectChange<T>(formControlName: string, values: T[]): void {
    const selectedValue = values.length > 0 ? values[0] : null;
    this.form.patchValue({ [formControlName]: selectedValue });
  }

  onAssigneeChange(values: any[]): void {
    this.onSelectChange('assignee', values);
  }

  onTaskStatusChange(values: TaskStatus[]): void {
    this.onSelectChange('status', values);
  }

  onTaskTypeChange(values: TaskType[]): void {
    this.onSelectChange('taskType', values);
  }

  onPriorityChange(values: Priority[]): void {
    this.onSelectChange('priority', values);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.taskService.createTask(this.form.value).subscribe({
        next: (result) => {
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
