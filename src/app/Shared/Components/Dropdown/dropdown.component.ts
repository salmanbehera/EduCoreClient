import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, catchError, debounceTime, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelect } from '@angular/material/select'; // Import MatSelect
interface DropdownOption {
  value: any; // The value to be bound to the form control (can be string, number, etc.)
  text: string; // The display text for the dropdown
}
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatError,
    MatSelectModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit,AfterViewInit  {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() staticOptions: DropdownOption[] = []; // Array of objects with value and text
  @Input() dynamicOptions: (searchTerm: string, page: number, pageSize: number) => Observable<{ items: DropdownOption[], totalCount: number }> = () => new Observable();
  @Input() dataSourceType: 'static' | 'dynamic' | 'both' = 'static'; // Configurable data source type
  @Input() width: string = '100%'; // Default full width
  @Input() errorMessage: string = 'This field is required'; // Default error message
  @Input() dropdownDirection: 'upward' | 'downward' | 'left' | 'right' = 'downward'; // Default to downward

  @Output() selectionChange = new EventEmitter<any>();  

  @ViewChild(MatSelect) matSelect!: MatSelect; // Reference to MatSelect
  @ViewChild('searchInput') searchInput!: ElementRef;
  optionsSubject = new BehaviorSubject<DropdownOption[]>([]); // Initialize BehaviorSubject
  options: DropdownOption[] = []; // Combined static and dynamic options
  searchControl = new FormControl(''); // Search form control
  filteredOptions!: Observable<DropdownOption[]>; // Filtered options based on search
  totalCount = 0;
  currentPage = 1;
  pageSize = 20; // Define how many items to load each time
  isLoading = false;
  hasMoreOptions = true; // To check if there are more options to load
   
  constructor(){}
  ngOnInit(): void {
    this.loadInitialOptions();
  // Initialize filtering logic
    this.setupFiltering();
  }
 
  ngAfterViewInit(): void {
    this.matSelect.openedChange.subscribe(opened => {
      if (opened) {
        setTimeout(() => {
          if (this.matSelect.panel) {
            this.matSelect.panel.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
          }
        });
      } else {
        if (this.matSelect.panel) {
          this.matSelect.panel.nativeElement.removeEventListener('scroll', this.onScroll.bind(this));
        }
      }
    });
  }
  
// Load the initial set of dynamic options
private loadInitialOptions() {
  if (this.dataSourceType === 'dynamic' || this.dataSourceType === 'both') {
      this.isLoading = true;
      this.dynamicOptions('', this.currentPage, this.pageSize).subscribe(
          response => {
              this.totalCount = response.totalCount;
              this.options = response.items;
              this.optionsSubject.next(this.options); // Update optionsSubject
              this.isLoading = false;
              this.hasMoreOptions = this.options.length < this.totalCount;
          },
          error => {
              console.error('Error fetching dynamic options', error);
              this.isLoading = false;
          }
      );
  } else {
      this.options = this.staticOptions;
      this.optionsSubject.next(this.options); // Update optionsSubject for static data
  }
}

  //Setup filtering logic
  setupFiltering() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
    startWith(''), // Start with an empty search
    debounceTime(300), // Add debounce to avoid firing too many requests
    switchMap(searchTerm => this.getFilteredOptions(searchTerm || '')), // Filter options based on search term
    tap(filteredOptions => {
      // Update the options subject with filtered options
      this.optionsSubject.next(filteredOptions);
    }),
    switchMap(() => this.optionsSubject.asObservable()) // Return combined static/dynamic options
  );
}

private getFilteredOptions(searchTerm: string): Observable<DropdownOption[]> {
  const searchValue = searchTerm.toLowerCase();

  switch (this.dataSourceType) {
    case 'static':
       
      return of(this.filterStaticOptions(searchValue)); // Filter only static options

    case 'dynamic':
      this.currentPage = 1; // Reset to the first page when filtering dynamically
      return this.getDynamicOptions(searchValue); // Filter dynamic options based on search term

    case 'both':
      const staticResults = this.filterStaticOptions(searchValue); // Filter static options
      this.currentPage = 1; // Reset pagination for dynamic options
      return this.getDynamicOptions(searchValue).pipe(
        map(dynamicResults => [...staticResults, ...dynamicResults]) // Combine static and dynamic options
      );

    default:
      return of([]); // Default case
  }
}
  // Filter static options
  private filterStaticOptions(searchTerm: string): DropdownOption[] {
    const filterValue = searchTerm.toLowerCase();
    return this.staticOptions.filter(option => option.text.toLowerCase().includes(filterValue));
  }
  
  private getDynamicOptions(searchTerm: string): Observable<DropdownOption[]> {
    this.isLoading = true;
  
    return this.dynamicOptions(searchTerm, this.currentPage, this.pageSize).pipe(
      tap(() => this.isLoading = false), // Stop loading
      map(response => {
        // Return the items from the response
        this.totalCount = response.totalCount;
        return response.items; // Items from the response
      }),
      catchError((error) => {
        this.isLoading = false; // Stop loading on error
        console.error('Error loading dynamic options', error);
        return of([]); // Return an empty array if an error occurs
      })
    );
  }
   
  // Method to get the selected option's text
  getSelectedOptionText(): string {
    const selectedOption = [...this.staticOptions, ...this.options].find(option => option.value === this.control.value);
    return selectedOption ? selectedOption.text : this.placeholder;
  }
   
  onSelectionChange(event: MatSelectChange): void {
   
     
    if (this.selectionChange.observed) {
      const selectedValue = event.value; // Get the selected value
      //console.log('Selected value:', selectedValue);
      this.selectionChange.emit(selectedValue);
      this.searchControl.setValue('');
    }
  }

 

  onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
  
      const currentValue = this.searchControl.value || '';
      this.searchControl.setValue(currentValue + ' ');  // Add space to search term
  
      // Add a short timeout to ensure the input is ready
      setTimeout(() => {
        if (this.searchInput?.nativeElement) {
          this.searchInput.nativeElement.focus();
        }
      }, 100); // 100ms delay, adjust as needed
    }
  }
  
  
  
@HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    if (this.dataSourceType === 'static') {
      this.isLoading = false;
      
    }
    else
    {
    const dropdownElement = event.target as HTMLElement;
    // Check if scrolled to the bottom and if more options are available
    if (dropdownElement.scrollTop + dropdownElement.clientHeight >= dropdownElement.scrollHeight && this.hasMoreOptions && !this.isLoading) {
       
      this.currentPage++; // Increment the page
      const searchTerm = this.searchControl.value || '';
      this.loadMoreOptions(searchTerm);
    }
  }
  }

/// Load more options when scrolling
private loadMoreOptions(searchTerm: string) {
  this.isLoading = true;
  this.dynamicOptions(searchTerm, this.currentPage, this.pageSize).subscribe(
    response => {
      this.options = [...this.options, ...response.items]; // Append new items to the existing options
      this.optionsSubject.next(this.options); // Update options observable

      this.hasMoreOptions = this.options.length < response.totalCount; // Check if more options are available
      this.isLoading = false;
    },
    error => {
      console.error('Error fetching dynamic options on scroll', error);
      this.isLoading = false;
    }
  );
}


  
}





