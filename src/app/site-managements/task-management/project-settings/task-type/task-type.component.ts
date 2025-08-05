import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/_components/table/table.component';
import { TableAction, TableActionComponent } from '../../../../shared/_components/table-action/table-action.component';
import { AppliedFilter, FilterField, MultiFilterComponent } from '../../../../shared/_components/multi-filter/multi-filter.component';
import { ZI18nComponent } from '../../../../shared/_components/z-i18n/z-i18n.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ModalService } from '../../../../shared/_services/modal.service';
import { TaskStatus } from '../../../../shared/_services/task-status.service';
import { Column } from '../../../../shared/interfaces/table.model';
import { TaskTypeService } from '../../../../shared/_services/task-type.service';

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
  rows: any[] = [];
  filteredTasks: TaskStatus[] = [];
  appliedFilters: AppliedFilter[] = [];

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

  taskTypeActions: TableAction[] = [
      {
        label: 'Edit',
        icon: 'edit',
        action: (row: TaskStatus) => this.onEdit(row),
      },
      {
        label: 'Delete',
        icon: 'delete',
        action: (row: TaskStatus) => this.onDelete(row),
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
    this.taskTypeService.getTaskTypes().subscribe(
      (data) => this.rows = data,
      (error) => console.error('Error loading task types:', error)
    );
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

  onEdit(row: any) {}

  onDelete(row: any) {}

  onToggleActive(row: TaskStatus, isActive: boolean): void {

  }
}
