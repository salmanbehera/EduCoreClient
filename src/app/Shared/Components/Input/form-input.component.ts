import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { BehaviorSubject, catchError, debounceTime, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
 


interface ValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
}
interface DynamicOptionsResponse {
  items: string[];   // Array of items
  totalCount: number; // Total number of items available
}


@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatError,
    MatIconModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,

    
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss' 
   
})
export class FormInputComponent implements OnInit,AfterViewInit{
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl;  // Pass the FormControl instance
  @Input() requiredErrorMessage: string = 'This field is required';
  @Input() minLengthErrorMessage?: string;
  @Input() minLength?: number;
  @Input() maxLengthErrorMessage?: string;
  @Input() maxLength?: number;
  @Input() width: string = '100%';  // Default to full width
  @Input() height: string = '100%';  // Default to full width
  @Input() validationConfig!: ValidationConfig;
  @Input() showPasswordToggle: boolean = false; // New input to show password toggle
  @Input() staticOptions: string[] = []; // Static options for autocomplete
  @Input() dynamicOptions!: (input: string, page: number) => Observable<{ items: string[], totalCount: number }>; // Function to fetch dynamic options from an API
  @Input() dataSourceType: 'static' | 'dynamic' | 'both' = 'static'; // Configurable data source type
  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>(); // Emit selected value to parent component
  @Input() isReadOnly: boolean = false; // New Input for readonly
  @Input() isHidden: boolean = false; // Optional if needed for hidden fields
  // Password visibility toggle logic
  isPasswordVisible: boolean = false;
  //filteredOptions$: Observable<string[]> = of([]);
  filteredOptions$ = new BehaviorSubject<any[]>([]); // Using BehaviorSubject to hold options
  currentPage = 0;
  totalCount = 0;
  isLoading = false; // Track loading state to avoid duplicate requests
  public allOptions: string[] = [];
 
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
   
  
  hideshowpass(event: Event) {
    event.preventDefault(); // Prevent default behavior
    this.isPasswordVisible = !this.isPasswordVisible;
    this.type = this.isPasswordVisible ? 'text' : 'password';
  }
   
  
  ngOnInit(): void {
    
     

    this.control.valueChanges.pipe(
      debounceTime(300),
      startWith(''), // Start with an empty string to load initial options
      switchMap(value => this._filterOptions(value))
    ).subscribe(initialOptions => {
      this.isLoading = false;
      this.allOptions = initialOptions;
      this.filteredOptions$.next(this.allOptions); // Set initial options in filteredOptions$
    });

    

  }

  ngAfterViewInit() {
    
    //this.initIntersectionObserver();
    if (this.dropdownContainer) {
        
      this.dropdownContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }
     
  } 

   
 
  onScroll() {
    const dropdown = this.dropdownContainer.nativeElement; // Get the dropdown container
     
    // Check if the user has scrolled to the bottom of the dropdown
    if (dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight
      &&
      !this.isLoading
    ) {
      
      this.loadMoreOptions(); // Load more options
    }
  }

   

  private _filterOptions(value: string): Observable<string[]> {
    if (!value) {
      // Return an empty observable or all options based on the expected behavior
      return this.dataSourceType === 'static' 
        ? of(this.staticOptions) 
        : of([]);
    }
    const filterValue = value.toLowerCase();

    switch (this.dataSourceType) {
      case 'static':
        return of(this.staticOptions.filter(option => option.toLowerCase().includes(filterValue)));
      case 'dynamic':
        //return this.dynamicOptions ? this.dynamicOptions(filterValue) : of([]);
        this.currentPage = 1; // Reset to the first page for a new search
        return this._fetchDynamicOptions(filterValue, this.currentPage);
      case 'both':
        // Combine static and dynamic options
        const staticFiltered = this.staticOptions.filter(option => option.toLowerCase().includes(filterValue));
        this.currentPage = 1;
        return this._fetchDynamicOptions(filterValue, this.currentPage).pipe(map(dynamicOptions => [...staticFiltered, ...dynamicOptions]));
      default:
        return of([]); // If no valid dataSourceType is provided
    }
  }
   
 

  private _fetchDynamicOptions(value: string, page: number): Observable<string[]> {
    if (!this.dynamicOptions) {
        return of([]); // Return empty observable if dynamicOptions is not provided
    }

    this.isLoading = true; // Set loading state

    return this.dynamicOptions(value, page).pipe(
        map((response: DynamicOptionsResponse) => {
            this.isLoading = false; // Reset loading state
            this.totalCount = response.totalCount; // Store the total count for potential pagination
            return response.items; // Return the items array
        }),
        catchError(error => {
            this.isLoading = false; // Reset loading state on error
            console.error('Error fetching dynamic options:', error);
            return of([]); // Return empty array on error
        })
    );
}


  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    if (!this.optionSelected.closed) {
      this.optionSelected.emit(event.option.value);
    }
     // Emit the selected value to the parent
  }

   

  // loadMoreOptions() {
  //   if (this.totalCount > this.allOptions.length && !this.isLoading) {
  //     this.isLoading = true;
  //     this.currentPage++;

  //     this.filteredOptions$ = this.filteredOptions$.pipe(
  //       switchMap(existingOptions =>
  //         this._fetchDynamicOptions(this.control.value, this.currentPage).pipe(
  //           map(newOptions => {
  //             this.isLoading = false;
  //             return [...existingOptions, ...newOptions];
  //           })
  //         )
  //       )
  //     );
  //   }
  // }

    


 


  loadMoreOptions() {
    if (this.totalCount > this.allOptions.length && !this.isLoading) {
      this.isLoading = true;
      this.currentPage++;
  
      // Fetch and append new items
      this._fetchDynamicOptions(this.control.value, this.currentPage).subscribe({
        next: (newOptions) => {
          this.isLoading = false;
  
          // Accumulate items in allOptions
          this.allOptions = [...this.allOptions, ...newOptions];
  
          // Update the filteredOptions$ observable with the accumulated list
          this.filteredOptions$.next(this.allOptions);
  
          // Stop further loading if all items are loaded
          if (this.allOptions.length >= this.totalCount) {
            this.removeScrollListener();
          }
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }


removeScrollListener() {
  // Remove the scroll event listener to prevent further API calls
  if (this.dropdownContainer) {
    this.dropdownContainer.nativeElement.removeEventListener('scroll', this.onScroll.bind(this));
  }
}






  // onScroll() {
  //   console.log('scrolled');
  //   const dropdown = document.querySelector('.load-more');
  //   if (dropdown && dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight) {
  //     this.loadMoreOptions(); // Trigger loading of more options
  //   }
  // }
  

  get errorMessage() {
    if (this.control?.errors) {
      if (this.control.errors['required']) {  // Accessing 'required' using bracket notation
        return `${this.label} is required .`;
      }
      if (this.control.errors['email']) {  // Accessing 'required' using bracket notation
        return `Please enter a valid email.`;
      }
      if (this.control.errors['minlength']) {
        return `${this.label} must be at least ${this.control.errors['minlength'].requiredLength} characters.`;
      }
      if (this.control.errors['maxlength']) {
        return `${this.label} cannot exceed ${this.control.errors['maxlength'].requiredLength} characters.`;
      }
      if (this.type === 'number' && this.control.errors['pattern']) {
        return `${this.label} must be a valid number.`;
      }
    }
    return '';
  }
}