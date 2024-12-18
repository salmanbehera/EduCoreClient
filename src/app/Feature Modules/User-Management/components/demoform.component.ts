import { Component, OnInit, ViewChild, AfterViewInit,ViewEncapsulation, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {   map, of } from 'rxjs';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormInputComponent } from '../../../Shared/Components/Input/form-input.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../Shared/Services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // For dialog
import { demoDropdownDataService } from '../../../Shared/Services/demodynamicdropdown';
import { Observable, take } from 'rxjs';
import { DropdownComponent } from '../../../Shared/Components/Dropdown/dropdown.component';
import { CheckListBoxComponent } from '../../../Shared/Components/CheckListBox/check-list-box.component';
import { DatepickerComponent } from '../../../Shared/Components/DatePicker/datepicker.component';
import { DynamicDropdownService } from '../../../Shared/Services/dynamicdropdown.service';
import { JsonDataService } from '../../../Shared/Services/dropdownfromjson.service';
import { DemocountryService } from '../../../Shared/Services/democountry.service';
import { TableComponent } from '../../../Shared/Components/Table/table.component';
import { FakeProductService } from '../../../Shared/Services/demoproduct.service';
import { CustomTableComponent } from '../../../Shared/Components/Table/custom-table.component';
import { TableConfig } from '../../../Shared/Components/Table/custom-table.component';
import { NotificationService } from '../../../Shared/utils/NotificationUtilities.Service';
import { MESSAGE_CONSTANTS } from '../../../Shared/Model/message.constants';
import { ButtonComponent } from '../../../Shared/Components/Button/button.component';
 
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}
interface DropdownOption {
  value: any;
  text: string;
}
 

@Component({
  selector: 'demoform',
  standalone: true,
  imports: [
   
  CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule ,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    FormInputComponent,
    DropdownComponent,
    CheckListBoxComponent,
    DatepickerComponent,
    TableComponent,
    CustomTableComponent,
    ButtonComponent
  ],
  templateUrl: './demoform.component.html',
  styleUrl: './demoform.component.scss'
})

export class DemoformComponent implements OnInit, AfterViewInit {
demoform!:FormGroup;
staticGender: DropdownOption[] = [];
staticCheckboxNames: DropdownOption[] = [];
//dynamicOptions: DropdownOption[] = [];
dynamicOptions!: (searchTerm: string, page: number, pageSize: number) => Observable<{ items: DropdownOption[], totalCount: number }>;
loadedDynamicOptions: DropdownOption[] = []; // To store the fetched options
minDate: Date = new Date(2020, 0, 1); // Minimum date
maxDate: Date = new Date(2025, 11, 31); // Maximum date
type: string = 'email';
destroy$: any;
  
products: any[] = [];

totalCount: number = 0; // Total count of records, for pagination
pageSize: number = 5; // Number of items per page
currentPage: number = 0; // Current page index (0-based)

itemsPerLoad: number = 5; // Number of items to load on each scroll
initialLoad: number = 20; // Number of items to load initially
isLoading: boolean = false; // Track loading state
  // columns = [
  //   { header: 'ID', field: 'id', sortable: true,isLongText: false, filterable: false,width: '10px' },
  //   { header: 'Title', field: 'title', sortable: true,isLongText: false, filterable: true },
  //   { header: 'Price', field: 'price', sortable: true,isLongText: false, filterable: true },
  //   { header: 'Description', field: 'description', sortable: false,isLongText: true, filterable: true },
    
  // ];

//custom table 
tableConfig: TableConfig = {
  columns: [
    { field: 'id', header: 'ID', sortable: true, filterable: false, editable: true,type: 'text' },
    { field: 'title', header: 'Title', sortable: true, filterable: false, editable: true,type: 'text' },
    { field: 'price', header: 'Price', sortable: true, filterable: false, editable: true,type: 'number',format: 'currency' },
    { field: 'creationAt', header: 'Date', sortable: true, filterable: false, editable: true,type: 'date',format: 'medium' },
    { header: 'Description', field: 'description', sortable: false, filterable: false,type: 'text',format: 'truncate' },


  ],
  actions: [
    { label: 'Edit', icon: 'edit', callback: (row) => this.editRow(row) },
    { label: 'Delete', icon: 'delete', callback: (row) => this.deleteRow(row) },
    { label: 'View', icon: 'description', callback: (row) => this.ViewRow(row) }
  ],
  enablePagination: true,
  pageSizeOptions: [5,10,20,50,100]
   //enableScrolling:true,
   //enableGrouping:false,
  // headerStyle: { backgroundColor: '#3f51b5', color: '#fff' },
  //rowStyle: { backgroundColor: '#fafafa', color: '#333' },
//altRowStyle: { backgroundColor: '#f5f5f5', color: '#000' }
 
};
 
editingRowId: any = null;
editRow(row: any) {
  // Edit logic
  this.editingRowId = this.editingRowId === row.id ? null : row.id; // Toggle editing state for the row

  console.log('Editing row:', this.editingRowId );
}

deleteRow(row: any) {
  // Delete logic
  console.log('delete row:', row);
}
ViewRow(row: any) {
  // Delete logic
  console.log('view row:', row);
}

// onEditRowEvent(event: any): void {
//   console.log('work');
//   const { row, editing } = event;
//   if (editing) {
//     // Activate row editing
//     console.log('Row is now editable:', row);
//   } else {
//     // Deactivate row editing
//     console.log('Row editing is done:', row);
//   }
// }



  constructor( 
     private cdr: ChangeDetectorRef,
   private fb: FormBuilder,
   private dialog: MatDialog,
   private authservice: AuthService,
   private router: Router,
   private dropdownservice:demoDropdownDataService,
   private dynamicdropdownservice:DynamicDropdownService,
   private jsondataservice:JsonDataService,
   private countryService:DemocountryService,
   private productService:FakeProductService,
   private notificationService:NotificationService
  )
  {}

  getControl(name: string): FormControl {
    return this.demoform.get(name) as FormControl;
  }



  ngOnInit() {
    
    //this.tableConfig.editable = this.tableConfig.editable ?? true;

    this.demoform = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20) ]],
      email: ['', [Validators.required , Validators.email]],
      age: ['', [Validators.required ]],
      fruit: ['', [Validators.required ]],

     
    // password: ['', [Validators.required,Validators.minLength(3)]],
     genderdropdown: new FormControl(null, Validators.required),
     dynamicDropdown: new FormControl([], Validators.required),
     namecheckboxDropdown: [[], Validators.required],
     dynamicCheckbox: new FormControl([], Validators.required),
    // //dynamicDropdown: new FormControl([null]),
    // staticcheckboxDropdown: [[], Validators.required]
     
    });
    
    this.BindGender();
    this.bindDropdowns();
    this.BindStaticcheckbox();
    this.bindDynamicCheckbox();
 //this.BindProduct();
  
  //this.BindProductwithpaging(this.currentPage, this.pageSize);
  this.loadInitialData();
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator; // Ensures ViewChild is initialized
  }
  //getall product
BindProduct(){
   
  this.productService.getProducts().subscribe(data => {
    this.products = data;
    console.log(this.products); 
  });
}

// Method to load data with pagination
BindProductwithpaging(offset: number, limit: number) {
  
  this.productService.getPaginatedProducts(offset, limit).subscribe(response => {
    //console.log('data fetch',response); 
    this.products = response;   // Assign paginated data to the products array
    this.totalCount = 100;  // Assign the total count of products
     
    console.log( 'totalCount:', this.totalCount); 
    this.cdr.detectChanges();  // Trigger change detection to update the view
  });
}
//handle paging 
// Handle the pagination change event
 
onPageChange(event: { pageIndex: number; pageSize: number }): void {
  const { pageIndex, pageSize } = event;
  // Correctly calculate offset
   // Update currentPage and pageSize
   this.currentPage = pageIndex / pageSize;
   this.pageSize = pageSize;
   

   console.log('currentPage:', this.currentPage, 'pageSize:', this.pageSize);
    console.log('offset:', pageIndex, 'limit:', pageSize);
  this.BindProductwithpaging(pageIndex, this.pageSize);
}
  // Handle single date or datetime change
  onDateChange(event: Date | [Date, Date] ): void {
    const formatDate = (date: Date): string => {
        // Set time to the current hour, minute, and second if date has no specific time
        if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
            const now = new Date();
            date.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    if (Array.isArray(event)) {
        const [startDate, endDate] = event;
        console.log('Start Date:', formatDate(startDate));
        console.log('End Date:', formatDate(endDate));
    } else {
        console.log('Selected Date:', formatDate(event));
    }
}
BindGender(){
  this.staticGender = [
    { value: 'S', text: 'Select' },
    { value: 'M', text: 'Male' },
    { value: 'F', text: 'Fe-Male' }
  ];
   console.log(this.staticGender[0]?.value);
 this.demoform.get('genderdropdown')?.setValue(this.staticGender[0]?.value);
  
}

 bindDropdowns(): void {
  this.dynamicOptions = this.dynamicdropdownservice.getDynamicOptionsHandler(
    this.jsondataservice,
    'dynamicDropdown', // Field name
    this.demoform
  );
}
bindDynamicCheckbox(): void {
  this.dynamicOptions = this.dynamicdropdownservice.getDynamicOptionsHandler(
    this.jsondataservice,
    'dynamicCheckbox', // Field name
    this.demoform
  );
}
BindStaticcheckbox(){
  this.staticCheckboxNames=[
    { value: 'opt1', text: 'SALMAN' },
{ value: 'opt2', text: 'AMAR' },
{ value: 'opt3', text: 'OMMM' },
{ value: 'opt4', text: 'MANAS' },
  ];
}
 
onGenderChange(event: any): void {
  // Logic to handle gender change
  console.log('Gender changed:', event);
}
onNameChange(selectedValue: any) {
  console.log('Selected value:', selectedValue);  // Do something with the selected value
}
//bind dynamic dropdown

 

// Handle single date or datetime change
onYearChange(selectedYear: Date | [Date, Date]): void {
  if (Array.isArray(selectedYear)) {
      // Handle the case where it's an array of dates
      console.log('Start Date:', selectedYear[0]);
      console.log('End Date:', selectedYear[1]);
  } else if (selectedYear instanceof Date) {
      const year = selectedYear.getFullYear();
      console.log('Selected Year:', year);
  } else {
      console.error('Invalid year selected:', selectedYear);
  }
}

onTimeChange(selectedTime: Date | [Date, Date]) {
  if (Array.isArray(selectedTime)) {
    // Handle the date range case
    const [startDate, endDate] = selectedTime;
    console.log(`Selected Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
    // Additional logic for handling the date range...
  } else {
    // Handle the single date case
    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();
    console.log(`Selected Time: ${hours}:${minutes}`);
    // Additional logic for handling the selected time...
  }
}

//static fruit
fetchstaticOptions: string[] = ['Apple', 'Banana', 'Cherry'];

//single item bind 
fetchDynamicOptions(input: string, page: number): Observable<{ items: string[], totalCount: number }> {
  return this.countryService.fetchCountries().pipe(
    map(response => {
      const filteredItems = response.items.filter(title =>
        title.toLowerCase().includes(input.toLowerCase())
      );
      const paginatedItems = filteredItems.slice((page - 1) * 10, page * 10);

      return {
        items: paginatedItems,
        totalCount: filteredItems.length
      };
    })
  );
}

 


 


//multiple item bind
// fetchDynamicOptions(input: string, page: number): Observable<{ items: { userId: number, title: string }[], totalCount: number }> {
//   return this.countryService.fetchCountries().pipe(
//     map(response => {
//       // Filter based on input, only returning items that contain the search term in the title
//       const filteredItems = response.items.filter(item =>
//         item.title.toLowerCase().includes(input.toLowerCase())
//       );

//       // Apply pagination
//       const paginatedItems = filteredItems.slice((page - 1) * 10, page * 10);

//       return {
//         items: paginatedItems,
//         totalCount: filteredItems.length
//       };
//     })
//   );
// }


//textbox dropdown event
onOptionSelected(selectedValue: string) {
  console.log('Selected option:', selectedValue);
  // You can now use the selectedValue in the parent component
}
 
//bind for scrolling code

 // Load initial data
 loadInitialData(): void {
  this.isLoading = true;
  this.productService.getProducts().subscribe(
    response => {
      // Load initial set of items based on initialLoad
      this.products = response.slice(0, this.initialLoad);
        
      this.isLoading = false;
    },
    () => {
      this.isLoading = false; // Reset loading state on error
    }
  );
}

 

handleLoadMore(event: any): void {
  
  if (this.isLoading) return; // Prevent multiple requests
  this.isLoading = true;

  // Simulate an API call to load more data
  this.productService.getProducts().subscribe(
    response => {
      const startIndex = this.products.length;
      const newItems = response.slice(startIndex, startIndex + this.itemsPerLoad);

      if (newItems.length > 0) {
        // Append new items to the list
        this.products = [...this.products, ...newItems];
        this.cdr.detectChanges(); 
      } else {
        // No more items to load, optionally handle this state
        console.log('No more items to load.');
      }
console.log(this.products);
      // Reset loading state
      this.isLoading = false;
    },
    error => {
      // Handle error and reset loading state
      console.error('Error fetching more items:', error);
      this.isLoading = false;
    }
  );
}

 //button
 // Show success message
 onSuccess(): void {
  this.notificationService.showSuccess(MESSAGE_CONSTANTS.SUCCESS.ACTION_COMPLETED);
}

// Show error message
onError(): void {
  this.notificationService.showError(MESSAGE_CONSTANTS.ERROR.GENERIC_ERROR);
}

// Show confirmation dialog
onDelete(): void {
  this.notificationService
    .confirmAction(MESSAGE_CONSTANTS.CONFIRMATION.DELETE_CONFIRMATION)
    .then((confirmed) => {
      if (confirmed) {
        this.notificationService.showSuccess('Item deleted successfully.');
      } else {
        this.notificationService.showInfo('Delete action was canceled.');
      }
    });
}
  
}


 
