import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule,MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatSortModule } from '@angular/material/sort';
import { ObjectPathPipe } from '../../pipes/ObjectPathPipe.pipe';
 
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,  // Add here
    MatInputModule,      // Add here
    MatSortModule,
    ObjectPathPipe
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit,OnChanges,AfterViewInit {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() backgroundColor: string = '#fff';
  @Input() headerStyle: object = { 'background-color': '#2d2e2d', 'color': '#fff' };
  @Input() rowStyle: object = { 'background-color': '#ffffff' };
  @Input() alternateRowStyle: object = { 'background-color': '#f5f5f5' };

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  filterableColumns: any[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
     
    this.displayedColumns = this.columns.map(col => col.field);
    this.filterableColumns = this.columns.filter(col => col.filterable);
    // Initialize the data source with the data, processing each row for showFullText state.
    this.dataSource.data = this.data.map(item => this.initializeRow(item));
   // this.dataSource.sort = this.sort; // Initialize sort functionality
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data.map(item => this.initializeRow(item));
    }
  }
  ngAfterViewInit() {
    // Make sure the table can sort and paginate
    this.dataSource.sort = this.sort;
    
  }

  initializeRow(row: any): any {
    // Add the `showFullText` state for long text columns in each row
    this.columns.forEach(column => {
      if (column.isLongText) {
        row[column.field] = {
          text: row[column.field], // Store the full text
          showFullText: false // Default to not showing the full text
        };
      }
    });
    return row;
  }

  getTruncatedText(text: string, field: string): string {
    // Truncate text and add ellipsis if it's too long
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  }

  toggleFullText(element: any, field: string): void {
    // Toggle the showFullText state for the clicked row and field
    if (element[field]) {
      element[field].showFullText = !element[field].showFullText;
    }
  }

  applyFilter(field: string, value: string): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data[field]?.toString().toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = value;
  }

  // applyFilterFromInput(field: string, event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const filterValue = input.value.trim().toLowerCase();
  //   this.dataSource.filter = filterValue;

  //   if (filterValue) {
  //     this.dataSource.filterPredicate = (data: any, filter: string) => {
  //       return data[field]?.toString().toLowerCase().includes(filter);
  //     };
  //   } else {
  //     this.dataSource.filterPredicate = (data: any, filter: string) => true;
  //   }
  // }

  applyFilterFromInput(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input.value.trim().toLowerCase();

    // Update the dataSource filterPredicate based on the column's field
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data[field]?.toString().toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
  }

  rowAlternatingStyle(index: number): { [key: string]: string } {
    return index % 2 === 0 ? { 'background-color': '#f9f9f9' } : { 'background-color': '#ffffff' };
  }
}