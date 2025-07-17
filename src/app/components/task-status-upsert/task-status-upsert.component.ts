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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskStatusUpsertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskStatusData
  ) {
    this.isEditMode = !!data?.taskStatus;
    this.title = this.isEditMode ? 'Edit Task Status' : 'Create Task Status';
    
    this.form = this.fb.group({
      id: [data?.taskStatus?.id || null],
      name: [data?.taskStatus?.name || '', [Validators.required, Validators.maxLength(100)]],
      description: [data?.taskStatus?.description || '', [Validators.maxLength(255)]],
      color: [data?.taskStatus?.color || '#007bff', [Validators.required]],
      order: [data?.taskStatus?.order || 0, [Validators.required, Validators.min(0)]],
      isActive: [data?.taskStatus?.isActive ?? true],
      isDefault: [data?.taskStatus?.isDefault ?? false]
    });
  }

  ngOnInit(): void {
    // Có thể thêm logic khởi tạo khác ở đây
  }

  /**
   * Kiểm tra form control có lỗi không
   */
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.form.get(fieldName);
    return control?.hasError(errorType) && (control?.dirty || control?.touched) || false;
  }

  /**
   * Lấy message lỗi cho field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.getError('maxlength').requiredLength;
      return `${fieldName} must not exceed ${maxLength} characters`;
    }
    if (control?.hasError('min')) {
      return `${fieldName} must be greater than or equal to 0`;
    }
    return '';
  }

  /**
   * Xử lý khi submit form
   */
  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Thêm timestamp
      const taskStatus = {
        ...formValue,
        updatedAt: new Date().toISOString(),
        ...(this.isEditMode ? {} : { createdAt: new Date().toISOString() })
      };

      this.dialogRef.close(taskStatus);
    } else {
      // Mark all fields as touched để hiển thị lỗi
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Đóng popup
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Reset form về trạng thái ban đầu
   */
  onReset(): void {
    this.form.reset();
    if (this.data?.taskStatus) {
      this.form.patchValue(this.data.taskStatus);
    }
  }
}
