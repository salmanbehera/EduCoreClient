// dropdown.service.ts
import { Observable } from 'rxjs';
import { DropdownOption } from './DropdownOption';

export interface DropdownService {
    getDropdownOptions(searchTerm: string, page: number, pageSize: number): Observable<{ items: DropdownOption[], totalCount: number }>;
  }
