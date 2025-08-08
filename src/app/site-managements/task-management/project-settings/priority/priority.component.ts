import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/_components/table/table.component';
import { Column } from '../../../../shared/interfaces/table.model';
import { AppliedFilter, FilterField, MultiFilterComponent } from '../../../../shared/_components/multi-filter/multi-filter.component';
import { ZI18nComponent } from "../../../../shared/_components/z-i18n/z-i18n.component";
import { ModalService } from '../../../../shared/_services/modal.service';
import { TableAction, TableActionComponent } from '../../../../shared/_components/table-action/table-action.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Priority, PriorityService } from '../../../../shared/_services/priority.service';
import { PriorityUpsertComponent } from '../../../../components/priority-upsert/priority-upsert.component';

@Component({
  selector: 'app-priority',
  imports: [
    CommonModule,
    TableComponent,
    MultiFilterComponent,
    ZI18nComponent,
    TableActionComponent,
    MatSlideToggleModule
  ],
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.scss'
})
export class PriorityComponent {
  @ViewChild('colorTemplate', { static: true }) colorTemplate!: TemplateRef<any>;
  @ViewChild('activeTemplate', { static: true }) activeTemplate!: TemplateRef<any>;
  @ViewChild('defaultTemplate', { static: true }) defaultTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  columns: Column[] = [];
  rows: any[] = [];
  filteredTasks: Priority[] = [];
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

  priorityActions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'edit',
      action: (row: Priority) => this.onEdit(row),
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: (row: Priority) => this.onDelete(row),
    },
  ];

  constructor(
    private modalService: ModalService,
    private priorityService: PriorityService
  ) {}

  ngOnInit(): void {
    this.initTable();
    this.loadPriorityData();
  }

  initTable() {
    this.columns = [
      {
        field: 'name',
        header: 'Name',
      },
      {
        field: 'color',
        header: 'Color',
        cellTemplate: this.colorTemplate,
      },
      {
        field: 'level',
        header: 'Level'
      },
      {
        field: 'isActive',
        header: 'Active',
        cellTemplate: this.activeTemplate,
      },
      {
        field: 'isDefault',
        header: 'Default',
        cellTemplate: this.defaultTemplate,
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

  loadPriorityData(): void {
    this.priorityService.getPriorities().subscribe({
      next: (priorities) => this.rows = [...priorities],
      error: (error) => console.log(error)
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

  onCreateNew(): void {
    this.modalService.open(PriorityUpsertComponent,
      { priority: null },
      { width: '600px' }
    ).subscribe(result => {
      if (result) this.loadPriorityData();
    });
  }

  onEdit(row: Priority): void {
    this.modalService.open(PriorityUpsertComponent, { priority: row },
      {
        width: '600px',
        height: 'auto',
        disableClose: true,
        panelClass: 'task-status-modal'
      }
    ).subscribe({
      next: (result) => {
        if (result) this.loadPriorityData();
      },
      error: (error) => {
        console.error('Error updating priority:', error);
      }
    });
  }

  onDelete(row: Priority) {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      this.priorityService.deletePriority(row._id!).subscribe({
        next: () => {
          this.loadPriorityData();
        },
        error: (error) => {
          console.error('Error deleting priority:', error);
        },
      });
    }
  }

  onToggleActive(row: Priority, isActive: boolean): void {
    this.priorityService.updatePriority(row._id!, { ...row, isActive }).subscribe({
      next: () => {
        this.loadPriorityData();
      },
      error: (error) => {
        console.error('Error updating isActive priority:', error);
      },
    });
  }

  onToggleDefault(row: Priority, isDefault: boolean): void {
    this.priorityService.updatePriority(row._id!, { ...row, isDefault }).subscribe({
      next: () => {
        this.loadPriorityData();
      },
      error: (error) => {
        console.error('Error updating isDefault priority:', error);
      },
    });
  }
}
