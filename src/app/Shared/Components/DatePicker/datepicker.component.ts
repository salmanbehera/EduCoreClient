	 
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerComponent, NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
  //encapsulation: ViewEncapsulation.None // This removes encapsulation
})
export class DatepickerComponent implements OnInit {
  @Input() dateType: 'date' | 'datetime' | 'time' | 'range' | 'year' = 'date';
  @Input() placeholder: string = 'Select a date';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Output() dateChange: EventEmitter<Date | [Date, Date]  >  = new EventEmitter<Date | [Date, Date]  >();
  //@Output() dateChange: EventEmitter<Date | [Date, Date] | string | undefined> = new EventEmitter<Date | [Date, Date] | string | undefined>();

  
  //@ViewChild('timepicker') timepicker!: NgxMaterialTimepickerComponent;
  timeControl = new FormControl(); // For time selection
  dateControl = new FormControl(); // For single date or datetime
  yearControl = new FormControl(); // For time selection
  startDateControl = new FormControl(); // For date range start date
  endDateControl = new FormControl(); // For date range end date
  startView: 'month' | 'year' | 'multi-year' = 'multi-year';

  // For date range
  dateRangeGroup = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
  });
  selectedTime: string; // This will hold the time selected in the popup.
 
  constructor(private dateAdapter: DateAdapter<Date>) {
    // Optionally set date adapter to display format if necessary
    this.dateAdapter.setLocale('en-GB'); // or any preferred locale
    this.selectedTime = this.getCurrentTime(); // Initialize with current time

    
  }
  
 ngOnInit() {
  //this.yearControl.setValue(new Date());

    if (this.dateType === 'range') {
      this.dateRangeGroup.valueChanges.subscribe(range => {
        const { startDate, endDate } = range;
        if (startDate && endDate) {
          this.dateChange.emit([startDate, endDate]);
        }
      });
    }  
   
  }

 

  // Method to open time picker with current time
 // Method to get the current time in 'HH:mm' format
 private getCurrentTime(): string {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

  addEvent(event: MatDatepickerInputEvent<Date | null>) {
    if (this.dateType === 'date' || this.dateType === 'datetime') {
      if (event.value) {
         
        this.dateControl.setValue(event.value);
        this.dateChange.emit(event.value??null);
      } else {
        this.dateControl.setValue(null);
        this.dateChange.emit(undefined);
      }
      
    }
     
  }

   
  
  

  emitDateRange() {
    const startDate = this.startDateControl.value;
    const endDate = this.endDateControl.value;
    if (startDate && endDate) {
      this.dateChange.emit([startDate, endDate]);
    }
  }

  emitDateTime(selectedDate: Date | null) {
    const time = this.timeControl.value;
    if (selectedDate && time) {
      const dateTime = new Date(selectedDate);
      dateTime.setHours(time.getHours(), time.getMinutes());
      this.dateChange.emit(dateTime);
    }
  }

  // datepicker.component.ts

  
  onTimeSet(selectedTime: string) {
    console.log(`Selected Time: ${selectedTime}`);
  
    // Example: Format to ensure leading zeros (e.g., "09:05" instead of "9:5")
    const [hours, minutes] = selectedTime.split(':');
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
    // Store formatted time
    this.selectedTime = formattedTime;
  
    // Set to form control
    this.dateControl.setValue(formattedTime);
  }
  


  onClose() {
    // Logic when the time picker is closed without a selection
    console.log('Time picker closed without selection.');
  }
  // Emit the selected year
  // onYearSelected(event: Date, datepicker: MatDatepicker<Date>): void {
  //   // Set only the year as a formatted string in dateControl
  //   const year = event.getFullYear();
  //   console.log(year);
  //   this.yearControl.setValue(year.toString()); // Set only the year as a string
    
    
  //   datepicker.close(); // Close the date picker after selecting the year
  // }
  
  // onYearSelected(event: Date, datepicker: MatDatepicker<Date>): void {
  //   const year = event.getFullYear().toString();
  //   this.yearControl.setValue(year);  // Set only the year as a string
  //   this.dateChange.emit(year.toString());       // Emit the year as a string
  //   datepicker.close();               // Close the date picker after selecting the year
  // }

  onYearSelected(event: Date, datepicker: MatDatepicker<Date>): void {
    const selectedYear = event.getFullYear();
    const displayDate = new Date(selectedYear, 0, 1); // January 1 of the selected year

    // Set displayDate in the FormControl so only the year is shown in the input
    this.yearControl.setValue(displayDate);

    // Emit the displayDate as it matches the expected type
    this.dateChange.emit(displayDate);

    datepicker.close(); // Close datepicker after selecting the year
  }
  
   
  
  
}
