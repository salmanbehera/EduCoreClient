import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SectionDto } from '../models/section.model';
import { ApiConfig } from '../Config/ApiConfig';
import { HttpUtilsService } from '../../../Shared/utils/HttpUtilities.Service';
import { HttpParams } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private readonly apiUrl = ApiConfig.sectionApi;
  
  constructor(private httpUtils: HttpUtilsService,
   // @Inject(CLASS_API_URL) private classApiUrl: string
  ) {}

   //post:save class
  SaveSection(sectionDto: SectionDto): Observable<SectionDto> {
  return this.httpUtils.post<SectionDto>(this.apiUrl, { sectionDto: sectionDto });
}
// PUT: Update Class
UpdateSection(sectionDto: SectionDto): Observable<SectionDto> {
  const url = `${this.apiUrl}`;
  return this.httpUtils.put<SectionDto>(url, { sectionDto: sectionDto });
}

// DELETE: Delete Class by ID
DeleteSection(sectionid: string): Observable<void> {
  const url = `${this.apiUrl}/${sectionid}`;
  return this.httpUtils.delete<void>(url);
}

// GET: Get All Classes
GetAllSection(): Observable<SectionDto[]> {
  return this.httpUtils.get<SectionDto[]>(this.apiUrl);
}
GetPaginatedSection(offset: number, limit: number): Observable<{ data: SectionDto[], count: number }> {
  const params = new HttpParams()
    .set('PageIndex', offset.toString())
    .set('PageSize', limit.toString());

  return this.httpUtils.get<{ sectiondto: { data: SectionDto[], count: number } }>(this.apiUrl, { params }).pipe(
    map(response => {
      return {
        data: response.sectiondto.data,
        count: response.sectiondto.count 
         
      };
    })
  );
}


// GET: Get Class by ID 

GetSectionById(sectionid: string): Observable<SectionDto> {
  const url = `${this.apiUrl}/${sectionid}`;
  return this.httpUtils.get<{ sectiondto: SectionDto }>(url).pipe(
    map(response => response.sectiondto) // Directly map to the classdto object
  );
}
 
 
}
