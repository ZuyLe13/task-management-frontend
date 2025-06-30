import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/_components/table/table.component';
import { Column } from '../../../../shared/interfaces/table.model';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-task-status',
  imports: [
    CommonModule,
    TableComponent
  ],
  templateUrl: './task-status.component.html',
  styleUrl: './task-status.component.scss'
})
export class TaskStatusComponent implements OnInit {
  @ViewChild('customCell') customCell!: TemplateRef<any>;

  columns: Column[] = [];
  rows: any[] = [];

  ngOnInit(): void {
    this.initTable();
    // Sample data for demonstration
    this.rows = [
      { id: 1, name: 'Task 1', age: 25 },
      { id: 2, name: 'Task 2', age: 30 },
      { id: 3, name: 'Task 3', age: 35 }
    ];
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
