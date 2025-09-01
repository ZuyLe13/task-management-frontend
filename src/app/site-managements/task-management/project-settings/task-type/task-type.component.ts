import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/_components/table/table.component';
import { Action, TableActionComponent } from '../../../../shared/_components/table-action/table-action.component';
import { AppliedFilter, FilterField, MultiFilterComponent } from '../../../../shared/_components/multi-filter/multi-filter.component';
import { ZI18nComponent } from '../../../../shared/_components/z-i18n/z-i18n.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ModalService } from '../../../../shared/_services/modals/modal.service';
import { Column } from '../../../../shared/interfaces/table.model';
import { TaskTypeUpsertComponent } from '../../../../components/task-type-upsert/task-type-upsert.component';
import { TaskType, TaskTypeService } from '../../../../shared/_services/task-mngts/task-type.service';

@Component({
  selector: 'app-task-type',
  imports: [
    CommonModule,
    TableComponent,
    TableActionComponent,
    MultiFilterComponent,
    ZI18nComponent,
    MatSlideToggleModule
  ],
  templateUrl: './task-type.component.html',
  styleUrl: './task-type.component.scss'
})
export class TaskTypeComponent {
  @ViewChild('activeTemplate', { static: true }) activeTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  columns: Column[] = [];
  rows: TaskType[] = [];
  filteredTasks: TaskType[] = [];
  appliedFilters: AppliedFilter[] = [];
  loading = false;

  filterFields: FilterField[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'Todo', label: 'Chờ thực hiện' },
        { value: 'In Progress', label: 'Đang thực hiện' },
        { value: 'Completed', label: 'Hoàn thành' }
      ]
    },
    {
      key: 'priority',
      label: 'Độ ưu tiên',
      options: [
        { value: 'Low', label: 'Thấp' },
        { value: 'Medium', label: 'Trung bình' },
        { value: 'High', label: 'Cao' }
      ]
    },
    {
      key: 'assignee',
      label: 'Người thực hiện',
      options: [
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Jane Smith', label: 'Jane Smith' },
        { value: 'Bob Johnson', label: 'Bob Johnson' },
        { value: 'Alice Brown', label: 'Alice Brown' },
        { value: 'Charlie Wilson', label: 'Charlie Wilson' }
      ]
    },
    {
      key: 'name',
      label: 'Tên công việc',
    },
    {
      key: 'createdDate',
      label: 'Ngày tạo',
    }
  ];

  taskTypeActions: Action[] = [
      {
        label: 'Edit',
        icon: 'edit',
        action: (row: TaskType) => this.onEdit(row),
      },
      {
        label: 'Delete',
        icon: 'delete',
        action: (row: TaskType) => this.onDelete(row),
      },
    ];

  constructor(
    private modalService: ModalService,
    private taskTypeService: TaskTypeService
  ) {}

  ngOnInit(): void {
    this.initTable();
    this.loadTaskTypeData();
  }

  initTable() {
    this.columns = [
      {
        field: 'name',
        header: 'Name',
      },
      {
        field: 'isActive',
        header: 'Active',
        cellTemplate: this.activeTemplate,
      },
      {
        field: 'action',
        header: 'Action',
        cellTemplate: this.actionTemplate,
        width: '100px',
        sortable: false
      }
    ];
  }

  initFilters() {}

  loadTaskTypeData(): void {
    this.loading = true;
    this.taskTypeService.getTaskTypes().subscribe({
      next: (data) => {
        this.rows = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task types:', error);
        this.loading = false;
      }
    });
  }

  onFiltersChange(filters: AppliedFilter[]) {
    this.appliedFilters = filters;
    this.applyFilters();
  }

  applyFilters() {}

  sortChange(event: any) {
    console.log('Sort changed:', event);
  }

  pageChange(event: any) {
    console.log('Page changed:', event);
  }

  paginatorChange(event: any) {
    console.log('Paginator changed:', event);
  }

  onEdit(row: TaskType) {
    this.modalService.open(TaskTypeUpsertComponent, { taskType: row }).subscribe((result: any) => {
      if (result?.success) {
        console.log('Task type updated successfully');
        this.loadTaskTypeData();
      }
    });
  }

  onDelete(row: TaskType) {
    if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
      this.deleteTaskType(row._id!);
    }
  }

  private deleteTaskType(id: string): void {
    this.loading = true;
    this.taskTypeService.deleteTaskType(id).subscribe({
      next: () => {
        console.log('Task type deleted successfully');
        this.loadTaskTypeData();
      },
      error: (error) => {
        console.error('Error deleting task type:', error);
        this.loading = false;
        alert('Error deleting task type. Please try again.');
      }
    });
  }

  onToggleActive(row: TaskType, isActive: boolean): void {
    const updatedData: TaskType = { ...row, isActive };

    this.taskTypeService.updateTaskType(row._id!, updatedData).subscribe({
      next: () => {
        const index = this.rows.findIndex(item => item._id === row._id);
        if (index !== -1) {
          this.rows[index].isActive = isActive;
        }
        console.log('Task type status updated successfully');
      },
      error: (error) => {
        console.error('Error updating task type status:', error);
        row.isActive = !isActive;
        alert('Error updating task type status. Please try again.');
      }
    });
  }

  onCreate(): void {
    this.modalService.open(TaskTypeUpsertComponent, { taskType: null }).subscribe((result: any) => {
      if (result?.success) {
        console.log('Task type created successfully');
        this.loadTaskTypeData();
      }
    });
  }
}
