
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { UtilitiesService } from '../utils/Utilities.Service';
import { DropdownService } from '../Model/DropdownService'; // Import the interface

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
export class JsonDataService implements DropdownService { // Implement the interface
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient, private utilities: UtilitiesService) {
    console.log('HttpClient initialized:', http);
  }
   
 

  // Fetch and simulate dynamic options with API, search, and pagination
  getDropdownOptions(searchTerm: string, page: number, pageSize: number): Observable<{ items: DropdownOption[], totalCount: number }> {
    console.log(`Fetching dropdown options - searchTerm: "${searchTerm}", page: ${page}, pageSize: ${pageSize}`);
   
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const mockOptions: DropdownOption[] = users.map(user => ({
          value: user.id.toString(),
          text: user.title
        }));

        const filteredOptions = this.utilities.filterOptions(mockOptions, searchTerm, 'text');
        const paginatedOptions = this.utilities.paginateOptions(filteredOptions, page, pageSize);

        return { items: paginatedOptions, totalCount: filteredOptions.length };
      }),
      catchError(error => {
        console.error('Error fetching options:', error);
        return of({ items: [], totalCount: 0 });
      })
    );
  }
}
