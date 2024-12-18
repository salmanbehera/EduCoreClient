import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ClassDto } from '../models/classdto.model';

import { ApiConfig } from '../Config/ApiConfig';
import { CLASS_API_URL } from '../Config/Api-Tokens';
import { HttpUtilsService } from '../../../Shared/utils/HttpUtilities.Service';
import { HttpParams } from '@angular/common/http';
 
 

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private readonly apiUrl = ApiConfig.classApi;
  
  constructor(private httpUtils: HttpUtilsService,
   // @Inject(CLASS_API_URL) private classApiUrl: string
  ) {}

   //post:save class
  SaveClass(classDto: ClassDto): Observable<ClassDto> {
  return this.httpUtils.post<ClassDto>(this.apiUrl, { classdto: classDto });
}
// PUT: Update Class
UpdateClass(classDto: ClassDto): Observable<ClassDto> {
  const url = `${this.apiUrl}`;
  return this.httpUtils.put<ClassDto>(url, { classdto: classDto });
}

// DELETE: Delete Class by ID
DeleteClass(classId: string): Observable<void> {
  const url = `${this.apiUrl}/${classId}`;
  console.log(url);
  return this.httpUtils.delete<void>(url);
}

// DeActiveClass(classId: string): Observable<ClassDto> {
//   const url = `${this.apiUrl}/${classId}`;
//   const updatePayload = { isDeleted: true }; // Payload to update the isDeleted column

//   return this.httpUtils.put<ClassDto>(url, updatePayload); // Use PATCH or PUT based on your API design
// }
 
DeActiveClass(classDto: ClassDto): Observable<ClassDto> {
  const url = `${this.apiUrl}`;
  return this.httpUtils.put<ClassDto>(url, { classdto: classDto });
}


// GET: Get All Classes
GetAllClasses(): Observable<ClassDto[]> {
  return this.httpUtils.get<ClassDto[]>(this.apiUrl);
}
GetPaginatedClasses(offset: number, limit: number): Observable<{ data: ClassDto[], count: number }> {
  const params = new HttpParams()
    .set('PageIndex', offset.toString())
    .set('PageSize', limit.toString());

  return this.httpUtils.get<{ classdto: { data: ClassDto[], count: number } }>(this.apiUrl, { params }).pipe(
    map(response => {
      return {
        data: response.classdto.data,
        count: response.classdto.count 
         
      };
    })
  );
}


// GET: Get Class by ID 

GetClassById(classId: string): Observable<ClassDto> {
  const url = `${this.apiUrl}/${classId}`;
  return this.httpUtils.get<{ classdto: ClassDto }>(url).pipe(
    map(response => response.classdto) // Directly map to the classdto object
  );
}



// GET: Get Class by Class Name
GetClassByName(className: string): Observable<ClassDto[]> {
  const url = `${this.apiUrl}/search`;
  const params = new HttpParams().set('className', className);
  return this.httpUtils.get<ClassDto[]>(url, { params });
}
}
