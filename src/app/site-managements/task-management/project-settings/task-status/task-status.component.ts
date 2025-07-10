import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/_components/table/table.component';
import { Column } from '../../../../shared/interfaces/table.model';
import { AppliedFilter, FilterField, MultiFilterComponent } from '../../../../shared/_components/multi-filter/multi-filter.component';

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
    MultiFilterComponent
  ],
  templateUrl: './task-status.component.html',
  styleUrl: './task-status.component.scss'
})
export class TaskStatusComponent implements OnInit {
  @ViewChild('customCell') customCell!: TemplateRef<any>;

  columns: Column[] = [];
  rows: any[] = [];
  // filterFields: FilterField[] = [];
  filteredTasks: TaskStatus[] = [];
  appliedFilters: AppliedFilter[] = [];

  allTasks: TaskStatus[] = [
    {
      id: 1,
      name: 'Implement user authentication',
      status: 'In Progress',
      priority: 'High',
      assignee: 'John Doe',
      createdDate: '2024-01-15',
      color: '#3B82F6'
    },
    {
      id: 2,
      name: 'Design landing page',
      status: 'Completed',
      priority: 'Medium',
      assignee: 'Jane Smith',
      createdDate: '2024-01-10',
      color: '#10B981'
    },
    {
      id: 3,
      name: 'Fix payment gateway bug',
      status: 'Todo',
      priority: 'High',
      assignee: 'Bob Johnson',
      createdDate: '2024-01-20',
      color: '#EF4444'
    },
    {
      id: 4,
      name: 'Update documentation',
      status: 'In Progress',
      priority: 'Low',
      assignee: 'Alice Brown',
      createdDate: '2024-01-18',
      color: '#F59E0B'
    },
    {
      id: 5,
      name: 'Optimize database queries',
      status: 'Todo',
      priority: 'Medium',
      assignee: 'Charlie Wilson',
      createdDate: '2024-01-22',
      color: '#8B5CF6'
    }
  ];

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

  ngOnInit(): void {
    this.initTable();
    // Sample data for demonstration
    this.rows = [
      { id: 1, name: 'Task 1', age: 25 },
      { id: 2, name: 'Task 2', age: 30 },
      { id: 3, name: 'Task 3', age: 35 }
    ];
    // this.initFilters();
    // this.filteredTasks = [...this.allTasks];
  }

  initTable() {
    this.columns = [
      {
        field: 'name',
        header: 'Name',
        cellTemplate: this.customCell,
        headerClass: 'header-style',
        cellClass: 'cell-style'
      },
      {
        field: 'age',
        header: 'Age',
        sortable: true
      }
    ];
  }

  initFilters() {}

  onFiltersChange(filters: AppliedFilter[]) {
    this.appliedFilters = filters;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTasks = this.allTasks.filter((task: any) => {
      return this.appliedFilters.every(filter => {
        const fieldKey = filter.field.key;
        const taskValue = (task as any)[fieldKey];

        // switch (filter.field.type) {
        //   case 'select':
        //   case 'multiselect':
        //     return filter.values.includes(taskValue);
          
        //   case 'text':
        //     return taskValue.toLowerCase().includes(filter.values[0].toLowerCase());
          
        //   case 'date':
        //     return taskValue === filter.values[0];
          
        //   default:
        //     return true;
        // }
      });
    });
  }

  trackByTask(index: number, task: TaskStatus): number {
    return task.id;
  }

  onFiltersChanged(filters: { [key: string]: any[] }) {
    console.log('Active filters:', filters);
    // -> Gọi hàm lọc lại danh sách task ở đây
  }

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
}
