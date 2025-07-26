import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZI18nComponent } from '../../shared/_components/z-i18n/z-i18n.component';
import { ErrorComponent } from '../../shared/_components/error/error.component';
import { Task } from '../../site-managements/task-management/task-list/task-list.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputComponent } from '../../shared/_components/input/input.component';
import { SelectComponent } from '../../shared/_components/select/select.component';

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
  selectedValues: any[] = [];
  assigneeOptions = [{ value: 'user1', label: 'User 1' }, /* ... */];
  statusOptions = [{ value: 'open', label: 'Open' }, /* ... */];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task}
  ) {
    this.form = this.fb.group({
      title: [data?.task?.title || '', [Validators.required, Validators.maxLength(100)]],
      assignee: [this.isValidAssignee(data?.task?.assignee) ? data?.task?.assignee : '', Validators.required],
      status: [this.isValidStatus(data?.task?.status) ? data?.task?.status : '', Validators.required],
      reporter: [data?.task?.reporter || ''],
      description: [data?.task?.description || ''],
      label: [data?.task?.label || ''],
      taskType: [data?.task?.taskType || ''],
      priority: [data?.task?.priority || ''],
      startDate: [data?.task?.startDate || ''],
      endDate: [data?.task?.endDate || ''],
      comments: [data?.task?.comments?.join(', ') || '']
    });
  }

  private isValidAssignee(assignee: string) {
    return assignee && this.assigneeOptions.some(option => option.value === assignee);
  }

  private isValidStatus(status: string) {
    return status && this.statusOptions.some(option => option.value === status);
  }

  onCancel(): void {
    // Handle cancel logic, e.g., close dialog
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Handle form submission, e.g., emit form value
      console.log(this.form.value);
    }
  }
}
