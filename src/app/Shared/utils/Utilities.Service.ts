import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {

  constructor() {}

  // Utility function to filter options based on search term
  filterOptions<T>(options: T[], searchTerm: string, property: keyof T): T[] {
    return options.filter(option =>
      (option[property] as string).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Utility function to apply pagination
  paginateOptions<T>(options: T[], page: number, pageSize: number): T[] {
    const startIndex = (page - 1) * pageSize;
    return options.slice(startIndex, startIndex + pageSize);
  }
  // Utility function to sort options
sortOptions<T>(options: T[], property: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return options.sort((a, b) => {
      const aValue = (a[property] as string).toLowerCase();
      const bValue = (b[property] as string).toLowerCase();
  
      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }
  
  // Utility function to debounce search input
debounceSearch<T>(input$: Observable<T>, time: number = 300): Observable<T> {
    return input$.pipe(debounceTime(time));
  }
  
}
