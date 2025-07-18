import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/_components/table/table.component';
import { Column } from '../../../../shared/interfaces/table.model';
import { AppliedFilter, FilterField, MultiFilterComponent } from '../../../../shared/_components/multi-filter/multi-filter.component';
import { ZI18nComponent } from "../../../../shared/_components/z-i18n/z-i18n.component";
import { ModalService } from '../../../../shared/_services/modal.service';
import { TaskStatusUpsertComponent } from '../../../../components/task-status-upsert/task-status-upsert.component';
import { TaskStatusService } from '../../../../shared/_services/task-status.service';

interface TaskStatus {
  id: number;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  createdDate: string;
  color: string;
}

@Component({
  selector: 'app-task-status',
  imports: [
    CommonModule,
    TableComponent,
    MultiFilterComponent,
    ZI18nComponent
],
  templateUrl: './task-status.component.html',
  styleUrl: './task-status.component.scss'
})
export class TaskStatusComponent implements OnInit {
  @ViewChild('colorCellTemplate', { static: true }) colorCell!: TemplateRef<any>;

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

  constructor(
    private modalService: ModalService,
    private taskStatusService: TaskStatusService
  ) {}

  ngOnInit(): void {
    this.initTable();
    this.taskStatusService.getTaskStatus().subscribe({
      next: (statuses) => {
        this.rows = statuses;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  initTable() {
    this.columns = [
      {
        field: 'name',
        header: 'Name',
        headerClass: 'header-style',
        cellClass: 'cell-style',
        sortable: true
      },
      {
        field: 'code',
        header: 'Code',
        sortable: true
      },
      {
        field: 'color',
        header: 'Color',
        cellTemplate: this.colorCell,
        headerClass: 'header-style',
        cellClass: 'cell-style'
      },
      {
        field: 'active',
        header: 'Active',
        headerClass: 'header-style',
        cellClass: 'cell-style',
        sortable: true
      },
      {
        field: 'default',
        header: 'Default',
        headerClass: 'header-style',
        cellClass: 'cell-style',
        sortable: true
      }
    ];
  }

  initFilters() {}

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

  clickRow(row: any) {
    console.log('Row clicked:', row);
  }

  onCreateNew(): void {
    this.modalService.open(
      TaskStatusUpsertComponent,
      { taskStatus: null }, // data truyền vào component
      {
        width: '600px',
        height: 'auto',
        disableClose: true,
        panelClass: 'task-status-modal'
      }
    ).subscribe(result => {
      if (result) {
        console.log('New task status created:', result);
        this.rows = [...this.rows, result];
      }
    });
  }
}
