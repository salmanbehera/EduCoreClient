  // // dynamic-dropdown.service.ts
  // import { Injectable } from '@angular/core';
  // import { Observable, of } from 'rxjs';
  // import { catchError, tap } from 'rxjs/operators';
  // import { DropdownOption } from '../Model/DropdownOption';
  // import { FormGroup } from '@angular/forms';
  // import { DropdownService } from '../Model/DropdownService ';
  

  // @Injectable({
  //   providedIn: 'root'
  // })
  // export class DynamicDropdownService {
  //   constructor() {}
    

  //   // The bind method is generic, accepting any service that returns dropdown data
  //   bindDynamicDropdownData(
  //     dropdownService: DropdownService,   // Pass the specific service
  //     fieldName: string,
  //     formGroup: FormGroup,
  //     searchTerm: string = '',
  //     page: number = 1,
  //     pageSize: number = 20
  //   ): void {
  //     dropdownService.getDropdownOptions(searchTerm, page, pageSize).pipe(
  //       tap((response) => this.handleDropdownResponse(fieldName, formGroup, response.items)),
  //       catchError(this.handleDropdownError)
  //     ).subscribe();  // Subscribe directly here
  //   }

  //   private handleDropdownResponse(
  //     fieldName: string,
  //     formGroup: FormGroup,
  //     options: DropdownOption[]
  //   ): void {
  //     if (options.length > 0) {
  //       const selectedValues = [options[0].value];
  //       formGroup.get(fieldName)?.setValue(selectedValues);
  //     }
  //   }

  //   private handleDropdownError(error: any): Observable<DropdownOption[]> {
  //     console.error('Error fetching dynamic options', error);
  //     return of([]);
  //   }
  // }


import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DropdownOption } from '../Model/DropdownOption';
import { FormGroup } from '@angular/forms';
import { DropdownService } from '../Model/DropdownService'

@Injectable({
  providedIn: 'root'
})
export class DynamicDropdownService {
  constructor() {}

  // Wrapper method that returns a function to retrieve dynamic options
  getDynamicOptionsHandler(
    dropdownService: DropdownService,
    fieldName: string,
    formGroup: FormGroup
  ): (searchTerm: string, page: number, pageSize: number) => Observable<{ items: DropdownOption[]; totalCount: number }> {
    
    return (searchTerm: string, page: number, pageSize: number) => 
       
      this.bindDynamicDropdownData(dropdownService, fieldName, formGroup, searchTerm, page, pageSize);
  }

  // Now this method returns an Observable
  bindDynamicDropdownData(
    dropdownService: DropdownService,
    fieldName: string,
    formGroup: FormGroup,
    searchTerm: string = '',
    page: number = 1,
    pageSize: number = 20
  ): Observable<{ items: DropdownOption[]; totalCount: number }> {
    console.log('bindDynamicDropdownData called');
    return dropdownService.getDropdownOptions(searchTerm, page, pageSize).pipe(
      tap((response) => this.handleDropdownResponse(fieldName, formGroup, response.items)),
      catchError(this.handleDropdownError)
    );
  }

  private handleDropdownResponse(
    fieldName: string,
    formGroup: FormGroup,
    options: DropdownOption[]
  ): void {
    
    if (options.length > 0 && !formGroup.get(fieldName)?.value) {
      const selectedValues = [options[0].value];
      formGroup.get(fieldName)?.setValue(selectedValues);
    }
  }

  private handleDropdownError(error: any): Observable<{ items: DropdownOption[]; totalCount: number }> {
    console.error('Error fetching dynamic options', error);
    return of({ items: [], totalCount: 0 });
  }
}
