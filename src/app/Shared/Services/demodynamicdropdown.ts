// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';

// interface DropdownOption {
//   value: string;
//   text: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class demoDropdownDataService {
//   constructor() {}

//   // Simulating an API call with pagination
//   getMockDynamicOptions(searchTerm: string, page: number, pageSize: number): Observable<{ items: DropdownOption[], totalCount: number }> {
//     const mockOptions: DropdownOption[] = [
//       { value: 'dynamic1', text: 'Dynamic Option 1' },
//       { value: 'dynamic2', text: 'Dynamic Option 2' },
//       { value: 'dynamic3', text: 'Dynamic Option 3' },
//       { value: 'dynamic4', text: 'Dynamic Option 4' },
//       { value: 'dynamic5', text: 'Dynamic Option 5' },
//       { value: 'dynamic6', text: 'Dynamic Option 6' },
//       { value: 'salman7', text: 'salman option' },
//     ];

//     // Filter options based on search term
//     const filteredOptions = mockOptions.filter(option =>
//       option.text.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const startIndex = (page - 1) * pageSize;
//     const paginatedOptions = filteredOptions.slice(startIndex, startIndex + pageSize);
    
//     return of({ items: paginatedOptions, totalCount: filteredOptions.length });
//   }
// }

//working code
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { UtilitiesService } from '../utils/Utilities.Service';

interface DropdownOption {
  value: string;
  text: string;
}

interface User {
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class demoDropdownDataService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient,private utilities: UtilitiesService) {
    console.log('HttpClient initialized:', http);  // This should work fine now
  }

  // Fetch and simulate dynamic options with API, search, and pagination
  getMockDynamicOptions(searchTerm: string,
     page: number,
     pageSize: number
     //sortProperty: keyof DropdownOption = 'text',
    //sortDirection: 'asc' | 'desc' = 'asc'
    )
     : Observable<{ items: DropdownOption[], totalCount: number }> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        // Convert API response to DropdownOption format
        const mockOptions: DropdownOption[] = users.map(user => ({
          value: user.id.toString(),
          text: user.title
        }));

        // Use UtilitiesService for filtering, pagination, and optional sorting
        const filteredOptions = this.utilities.filterOptions(mockOptions, searchTerm, 'text');
        //sorting
        //const sortedOptions = this.utilities.sortOptions(filteredOptions, sortProperty, sortDirection);

        const paginatedOptions = this.utilities.paginateOptions(filteredOptions, page, pageSize);

        return { items: paginatedOptions, totalCount: filteredOptions.length };

        // // Filter options based on search term
        // const filteredOptions = mockOptions.filter(option =>
        //   option.text.toLowerCase().includes(searchTerm.toLowerCase())
        // );

        // // Apply pagination
        // const startIndex = (page - 1) * pageSize;
        // const paginatedOptions = filteredOptions.slice(startIndex, startIndex + pageSize);

        // return { items: paginatedOptions, totalCount: filteredOptions.length };
      }),
      // Handle potential errors
      catchError(error => {
        console.error('Error fetching options:', error);
        // Return an empty array on error
        return of({ items: [], totalCount: 0 });
      })
    );
  }
}


 