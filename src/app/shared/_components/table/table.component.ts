import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Column } from '../../interfaces/table.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'z-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  @Input() columns: Column[] = [];
  @Input() rows: any[] = [];
  @Input() tableClassName: string = '';

  @Output() clickRow = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() paginatorChange = new EventEmitter<PageEvent>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.field);
    this.dataSource.data = this.rows;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows'] && this.dataSource) {
      console.log('🔄 Rows changed:', changes['rows'].currentValue);
      this.dataSource.data = changes['rows'].currentValue || [];
    }
    
    if (changes['columns'] && changes['columns'].currentValue) {
      this.displayedColumns = changes['columns'].currentValue.map((col: any) => col.field);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSortChange(event: any) {
    this.sortChange.emit(event);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  onRowClick(row: any) {
    this.clickRow.emit(row);
  }
}
