// custom-table.component.ts
import { Component, Input, OnInit, ViewChild, TemplateRef, AfterViewInit, Output, EventEmitter, ElementRef, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule,  } from '@angular/material/table';
import { MatPaginatorModule, } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { TableCellFormatpipe } from '../../pipes/TableCellFormatpipe.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
 
export interface ColumnConfig {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  fixed?: boolean;
  type?: 'text' | 'number' | 'date' | 'checkbox';
  format?: string;
  visible?: boolean;
}

export interface ActionConfig {
  label: string;
  icon?: string;
  callback: (row: any) => void;
}

export interface TableConfig {
  columns: ColumnConfig[];
  actions?: ActionConfig[];
  showCheckbox?: boolean; // NEW: Option to show the checkbox column
  enableGrouping?: boolean;
  enablePagination?: boolean;
  enableScrolling?: boolean;
  pageSizeOptions?: number[];
  enableDetailPanel?: boolean;
  detailPanelTemplate?: any;
  headerStyle?: any;
  rowStyle?: any;
  altRowStyle?: any;
  editable?: boolean; // Add this line if it doesn't exist
}

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [
   
  MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,  // Add here
    MatInputModule,      // Add here
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    TableCellFormatpipe,
    MatProgressSpinnerModule
     
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})

// table-config.model.ts


export class CustomTableComponent implements OnInit,AfterViewInit {
  @Input() config!: TableConfig;
  @Input() data!: any[];
  
  @Input() initialColumnCount: number = 10; //this for toggle colum show and hide
  @Input() showDropdown: boolean = true; // Parent-configurable property
  @Input() showSearchInput: boolean = true; // Parent-configurable property
  @Input() pageSize: number = 10;  // Default page size, if not provided
  @Input() currentPage: number = 0; // Default current page (0-based)
  @Input() totalCount: number = 0;    // Total number of records for pagination
  @Output() pageChange = new EventEmitter<{ pageIndex: number, pageSize: number }>(); // Page change event
  @Output() editRowEvent = new EventEmitter<any>();
  // Inside your reusable component class
  @Output() loadMoreEvent = new EventEmitter<{ offset: number; pageSize: number }>();
  
  @ViewChild(MatPaginator,{ static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table') table: any;  // reference to the table for scroll event
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<any>;
  editingRowId: any = null; // Track which row is being edited
  columnVisibility: { [key: string]: boolean } = {}; // Track visibility for each column
// To track scroll state and fetch new data
infiniteScrollThreshold: number = 10; // Threshold before triggering scroll load
currentOffset: number = 0;  // To track offset for infinite scroll
isLoading: boolean = false;  // Flag to prevent loading data multiple times
spinner_loading: boolean = false;
 

  defaultHeaderStyle  = 'header-style';
  defaultRowStyle  = 'row-style';
  defaultAltRowStyle  = 'alt-row-style';

  
  get mergedConfig() {
    return {
      headerStyle: this.config?.headerStyle || this.defaultHeaderStyle,
      rowStyle: this.config?.rowStyle || this.defaultRowStyle,
      altRowStyle: this.config?.altRowStyle || this.defaultAltRowStyle
    };
  }
   
  constructor( 
    private cdr: ChangeDetectorRef
  ) {} 
  
  
  ngOnInit(): void {
    // Debugging
    // Set up scrolling handler
    if (this.config?.enableScrolling) {
  this.table.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }
 // Check if data is not an array or is empty
 if (!Array.isArray(this.data) || !this.data.length) {
     console.warn('Data is not available or is not an array');
     return;
 }
    this.dataSource = new MatTableDataSource(this.data);
    // Initially show the first 'initialColumnCount' columns
    this.displayedColumns = this.config.columns.slice(0, this.initialColumnCount).map(column => column.field);
 
    this.config.columns.forEach(column => {
      this.columnVisibility[column.field] = this.displayedColumns.includes(column.field); // Default visibility to true
    });

    // Dynamically set displayed columns based on tableConfig
    this.displayedColumns = this.config.columns
      .filter(column => column.visible !== false)
      .map(column => column.field);

    if (this.config.actions) {
      this.displayedColumns.push('actions');
    }
//comment for check later
    // Initialize sorting and pagination if enabled
    //this.initializeDataSource();
    
     
    this.dataSource.filterPredicate = this.createFilter();
    
  }
  initializeDataSource(): void {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<any>(this.data || []);
    }
  
    // Ensure sort and paginator are assigned only if they exist
    if (this.sort) {
      this.dataSource.sort = this.sort;
     } 
     
  
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
       
     } 
     
     
    if (this.config.enablePagination) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
       
    }
     
  }
  ngAfterViewInit() {
    // Check if scrollContainer is defined
    
    if (this.dataSource) {
      if (this.sort) {
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.onSpinnerLoad());

       } 
      //  if (this.paginator) {
      //   this.dataSource.paginator = this.paginator;
      //   setTimeout(() => {
      //     this.paginator.length = this.totalCount;
      //   });
      //   this.paginator.page.subscribe(() => this.onTableInteraction());

      //  } 

      Promise.resolve().then(() => {
        if (this.paginator) {
           
          this.paginator.length = this.totalCount;
        }
       this.paginator.page.subscribe(() => this.onSpinnerLoad());

      });
       
     
    } 
    else {
      console.warn('DataSource is not initialized.');
    }
   
  }
  onSpinnerLoad() {
    this.spinner_loading = true;
    // Simulate async operation (e.g., server-side sorting/paging)
    setTimeout(() => {
      this.spinner_loading = false;
    }, 1000); // Replace with actual server request or operation
  }

  ngOnChanges(changes: SimpleChanges) {
     
    if (changes['data'] && this.dataSource) {
     // console.log('Data changed', this.data);
      this.updateData(this.data);
      
    } else if (changes['data'] && !this.dataSource) {
     // console.warn('DataSource not initialized yet. Initializing now.');
      this.initializeDataSource();
      
    }
  }

   
 
  // Method to update MatTableDataSource
  updateData(newData: any[]): void {
    if (!Array.isArray(newData)) {
      console.error('Provided data is not an array');
      return;
    }
    this.data = newData;
    this.dataSource.data = newData;
    this.cdr.detectChanges();
  }

  toggleColumnVisibility(column: string): void {
    this.columnVisibility[column] = !this.columnVisibility[column];
    this.updateDisplayedColumns();
    //this.cdr.detectChanges(); // Force Angular to update the view
  }
  updateDisplayedColumns(): void {
    // Update displayedColumns based on columnVisibility
    this.displayedColumns = this.config.columns
      .filter(column => this.columnVisibility[column.field])
      .map(column => column.field);
    if (this.config.actions) {
      this.displayedColumns.push('actions');
    }
  }
   
   // Function to check if the row is editable 
   toggleEdit(row: any): void {
    console.log('Toggling edit mode for row:', row);
     

    console.log('Opening edit form for row:', row);
    // Emit event or call a function to open the form and pass data for editing
    this.editRowEvent.emit(row);
  }
 
  
  
 
  applyFilter(event: Event, columnField: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data, filter) => {
      // Custom filter logic based on column field
      return data[columnField]?.toString().toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      const filterObj = JSON.parse(filter);
      return Object.keys(filterObj).every(key =>
        data[key] ? data[key].toString().toLowerCase().includes(filterObj[key]) : true
      );
    };
  }
  getValue(row: any, field: string): any {
    // Handling nested fields like 'category.name'
    return field.split('.').reduce((acc, part) => acc ? acc[part] : '', row);
  }

  // This method checks if the text should show a tooltip (e.g., based on a character limit).
  shouldShowTooltip(value: string | undefined): boolean {
    const maxLength = 50; // Set a threshold for truncation
    return value !== undefined && value.length > maxLength;
  }

  clickedRow: any = null; // Track clicked row

  onRowClick(row: any): void {
    this.clickedRow = this.clickedRow === row ? null : row; // Toggle the clicked row
  }
  // Method for applying global search
  applyGlobalSearch(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => {
      // Loop over each column field in your data and check if any contains the search term
      const searchInAllColumns = Object.keys(data).some(key => {
        if (data[key]) {
          return data[key].toString().toLowerCase().includes(filter);
        }
        return false;
      });
      
      return searchInAllColumns;
    };
  
    // Apply the global search filter to the data source
    this.dataSource.filter = filterValue;
  
    // Reset pagination to the first page after filtering (if pagination is enabled)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
 
  dropdownOpen = false;

  toggleDropdown(event: MouseEvent) {
    event.preventDefault(); // Prevent default behavior of the button
    this.dropdownOpen = !this.dropdownOpen;
  }

  //infine scroll code
  // Scroll handler
  private debounceTimer: any = null;

  onScroll(event: any): void {
    const scrollHeight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const clientHeight = event.target.clientHeight;
  
    // Clear previous timer
    clearTimeout(this.debounceTimer);
    
    // Create a new timer
    this.debounceTimer = setTimeout(() => {
      
     
      if (scrollHeight - scrollTop <= clientHeight +5 && !this.isLoading) {
        
        this.loadMoreData();
      }
    }, 100); // Adjust debounce delay as needed
  }
  

// Method to load more data when the user scrolls to the bottom
loadMoreData(): void {
  if (this.isLoading) return; // Prevents multiple simultaneous requests
  this.isLoading = true;
  this.currentOffset += this.config?.pageSizeOptions?.[0] ?? 0;; // Update the offset for fetching the next set of items
  
  // Emit an event to notify the parent component to fetch more data
  this.loadMoreEvent.emit({ offset: this.currentOffset, pageSize: this.config?.pageSizeOptions?.[0] ?? 0 });
  // Set a timeout to simulate loading, or reset `isLoading` after data is fetched (you can adjust as needed)
  // Simulate data fetch delay (remove this part when using actual HTTP requests)
  setTimeout(() => {
    this.isLoading = false; // Reset loading state after data is "fetched"
     
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;  // Scroll to top
       
    }
     
  }, 500);  // Adjust the delay as needed

}

//dynamic paging code from service
onPageChange(event: PageEvent) {
   
  //const pageIndex = event.pageIndex * event.pageSize;
  const pageIndex = event.pageIndex;
  const pageSize = event.pageSize;
  this.pageChange.emit({ pageIndex, pageSize }); // Emit event to fetch new data based on page
 
}
  
//  //checkbox
//  // Select all checkbox logic
//  onSelectAllChange(event: MatCheckboxChange): void {
//   this.data.forEach(row => {
//     row.selected = event.checked;
//   });
//   this.emitSelectedRows();
// }

// // Checkbox change logic for individual rows
// onCheckboxChange(row: any, event: MatCheckboxChange): void {
//   row.selected = event.checked;
//   this.emitSelectedRows();
// }

// // Emit the selected rows
// private emitSelectedRows(): void {
//   const selectedRows = this.data.filter(row => row.selected);
//   this.checkboxChange.emit(selectedRows);
// }

// // Check if all rows are selected
// isAllSelected(): boolean {
//   return this.data.every(row => row.selected);
// }

// // Check if the selection is indeterminate (some but not all selected)
// isIndeterminate(): boolean {
//   const selectedCount = this.data.filter(row => row.selected).length;
//   return selectedCount > 0 && selectedCount < this.data.length;
// }

// // Get the value for a column field
// getcheckboxValue(row: any, field: string): any {
//   return row[field];
// }
  
  
}
