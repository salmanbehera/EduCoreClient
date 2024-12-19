import { ChangeDetectorRef, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {  FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormInputComponent } from '../../../Shared/Components/Input/form-input.component';
import { ButtonComponent } from '../../../Shared/Components/Button/button.component';
import { CommonModule } from '@angular/common';
import { ClassdialogComponent } from '../Dialog-Component/classdialog.component';
import { CustomTableComponent, TableConfig } from '../../../Shared/Components/Table/custom-table.component';
import { ClassService } from '../services/Class.service';
import { ClassDto } from '../models/classdto.model';
import { NotificationService } from '../../../Shared/utils/NotificationUtilities.Service';
import { MESSAGE_CONSTANTS } from '../../../Shared/Model/message.constants';
import { HttpFormMessageService } from '../../../Shared/utils/HttpFormMessage.service';

 

@Component({
  selector: 'app-classmaster',
  standalone: true,
  imports: [
   FormsModule,
   ReactiveFormsModule,
   CommonModule,
   MatIconModule,
   FormInputComponent,
   ButtonComponent,
   CustomTableComponent
  ],
  templateUrl: './class-master.component.html',
  styleUrls: ['./class-master.component.scss'],
  // providers: [MatDialog, Overlay], // Add providers here
})
export class ClassMasterComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private classservice:ClassService,
    private cdr: ChangeDetectorRef,
    private notificationService:NotificationService
    
  ) {}  
     
  
classForm!:FormGroup;
classes: any[] = [];
totalPages: number = 0; 
totalCount: number = 0; // Total count of records, for pagination
pageSize: number = 5; // Number of items per page
currentPage: number = 0; // Current page index (0-based)
  

//custom table 
tableConfig: TableConfig = {
  columns: [
    { field: 'id', header: 'ID', sortable: true, filterable: false, editable: true,type: 'text',visible:false },
    { field: 'className', header: 'Class Name', sortable: true, filterable: false, editable: true,type: 'text' },
    { field: 'classShortName', header: 'Short Name', sortable: true, filterable: false, editable: true,type: 'text' },
    

  ],
  actions: [
    //{ label: 'Edit', icon: 'edit', callback: (row) => this.editRow(row) },

    { label: 'Edit', icon: 'edit', callback: (row) => this.handleRowAction(row, 'edit') },
    { label: 'Delete', icon: 'delete', callback: (row) => this.deleteRow(row) },
    { label: 'View', icon: 'description', callback: (row) => this.handleRowAction(row,'view') }
  ],
 
  enablePagination: true,
  pageSizeOptions: [5,10,20,50,100],
  enableGrouping:false,
};
editingRowId: any = null;

handleRowAction(row: any, action: 'view' | 'edit'): void {
  this.editingRowId = this.editingRowId === row.id ? null : row.id; // Toggle editing state for the row
 
  if (this.editingRowId) {
    this.classservice.GetClassById(this.editingRowId).subscribe({
      next: (response: ClassDto) => {
         
        this.openDialog({ action, data: response }); // Pass the action and data to the dialog
      },
      error: (err) => console.error(`Error fetching class data for ${action}:`, err),
    });
  }
}
//not use now but exit for reference
editRow(row: any) {
  // Edit logic
  this.editingRowId = this.editingRowId === row.id ? null : row.id; // Toggle editing state for the row

  if (this.editingRowId) {
     
    this.classservice.GetClassById(this.editingRowId).subscribe({
      next: (response:ClassDto) => {
         this.openDialog({ action: 'edit', data: response }); // Pass the data to the dialog
      },
      error: (err) => console.error('Error fetching class data:', err),
    });
  }

  //console.log('Editing row:', this.editingRowId );
}

deleteRow(row: any) {
  // Delete logic
  //console.log('delete row:', row);
  this.editingRowId = this.editingRowId === row.id ? null : row.id; // Toggle editing state for the row

  this.notificationService
    .confirmAction(MESSAGE_CONSTANTS.CONFIRMATION.DELETE_CONFIRMATION)
    .then((confirmed) => {
      if (confirmed) {
        if (this.editingRowId) {
          this.DeleteClass(this.editingRowId);
        }
      }
    else {
        this.notificationService.showInfo('Delete action was canceled.');
      }
    });
}
ViewRow(row: any) {
  // Delete logic
  console.log('view row:', row);
}
ngOnInit(): void {
 
  this.GetAllClassesWithPaging(this.currentPage, this.pageSize);
   
}
 
GetAllClassesWithPaging(offset: number, limit: number): void {
  console.log('offset:', offset, 'limit:', limit);
  this.classservice.GetPaginatedClasses(offset, limit).subscribe(response => {
    this.classes = response.data; // Paginated data
   // this.classes = [...response.data]; // Create a new array reference

    this.totalCount =  response.count; // Total count of items
    this.totalPages = Math.ceil(this.totalCount / this.pageSize); // Total pages logic
    
 
  });
}
DeleteClass(classId: string): void {
  this.classservice.DeleteClass(classId).subscribe({
    next: ( ) => {
      console.log('Class deleted successfully:', classId);
    this.notificationService.showSuccess(MESSAGE_CONSTANTS.SUCCESS.DATA_UPDATED);
    const pageToFetch = this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
    this.GetAllClassesWithPaging(pageToFetch, this.pageSize);  
    
    },
    error: (error) => {
    this.notificationService.showError(error); // Display the resolved error message
     
    },
  });
}
 
onPageChange(event: { pageIndex: number; pageSize: number }): void {
  const { pageIndex, pageSize } = event;
    
  // Calculate the currentPage (1-based) and the offset for the API request
  this.currentPage = pageIndex + 1;  // Page index starts from 0, so we add 1
  this.pageSize = pageSize;  // Set the page size

  // Calculate offset and ensure it stays within valid bounds
  const offset = pageIndex * pageSize;
      // Call API to get paginated data
  this.GetAllClassesWithPaging(pageIndex, this.pageSize);
   
  this.cdr.detectChanges(); // Ensure view updates

}

 
   
openDialog(payload: { action: 'edit' | 'save' | 'view' ; data?: ClassDto }): void {
    try {
      const dialogRef = this.dialog.open(ClassdialogComponent, {
        width: '400px',
        disableClose: true,
        data: payload,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        const pageToFetch = this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
        if (result) {
          if (result && result.action === 'save') {
            this.GetAllClassesWithPaging(pageToFetch, this.pageSize);  
            this.cdr.detectChanges(); // Ensure view updates
          } 
          else if (result && result.action === 'update') {
            
            this.GetAllClassesWithPaging(pageToFetch, this.pageSize);  
            this.cdr.detectChanges(); // Ensure view updates

          } 
           
          //else if (action === 'view') {
          //   console.log('Class Viewed:', result);
          // }
        }
      });
    } catch (error) {
      console.error('Error opening dialog:', error);
    }
  }
  
  

   
}
 
