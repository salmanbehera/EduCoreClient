import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsServicebackup {

  constructor(private http: HttpClient) {}
  get<T>(url: string, options?: { observe?: 'body', params?: any, headers?: any }): Observable<T> {
    const requestOptions = { ...options, observe: 'body' as 'body' };
  
    return this.http.get<T>(url, requestOptions).pipe(
      catchError(this.handleError<T>('get', {} as T))
    );
  }
  
  

  // Generic POST request handler
  post<T>(url: string, data: any, options?: { [key: string]: any }): Observable<T> {
    // Set the observe option to 'body'
    const requestOptions = { ...options, observe: 'body' as const };
  
    return this.http.post<T>(url, data, requestOptions).pipe(
      catchError(this.handleError<T>('post', {} as T))
    );
  }
  // Generic PUT request handler
  put<T>(url: string, data: any, options?: { [key: string]: any }): Observable<T> {
    const requestOptions = { ...options, observe: 'body' as const };

    return this.http.put<T>(url, data, requestOptions).pipe(
      catchError(this.handleError<T>('put', {} as T))
    );
  }

  // Generic DELETE request handler
  delete<T>(url: string, options?: { [key: string]: any }): Observable<T> {
    const requestOptions = { ...options, observe: 'body' as const };

    return this.http.delete<T>(url, requestOptions).pipe(
      catchError(this.handleError<T>('delete', {} as T))
    );
  }

  /* Purpose: Fetches the headers of a resource without the body.
Use Case: Useful for checking if a resource exists or for metadata without transferring the entire resource. */
  head<T>(url: string, options?: { [key: string]: any }): Observable<HttpResponse<T>> {
    // Set the observe option to 'response' to include headers in the response
    const requestOptions = { ...options, observe: 'response' as const };
  
    return this.http.head<T>(url, requestOptions).pipe(
      catchError(this.handleError<HttpResponse<T>>('head', {} as HttpResponse<T>))
    );
  }
  /* Purpose: Partially updates a resource at the specified URL.
Use Case: When you only need to update specific fields of a resource without sending the entire resource. */
  patch<T>(url: string, data: any, options?: { [key: string]: any }): Observable<T> {
    const requestOptions = { ...options, observe: 'body' as const };
    return this.http.patch<T>(url, data, requestOptions).pipe(
      catchError(this.handleError<T>('patch', {} as T))
    );
  }
/*   Purpose: Describes the communication options for the target resource.
Use Case: Useful for discovering allowed HTTP methods and other options for a specific URL. */
  options<T>(url: string, options?: { [key: string]: any }): Observable<T> {
    const requestOptions = { ...options, observe: 'body' as const };
    return this.http.options<T>(url, requestOptions).pipe(
      catchError(this.handleError<T>('options', {} as T))
    );
  }

/*   Purpose: Handles file uploads to a server.
    Use Case: Useful for forms that allow users to upload files. */
  upload<T>(url: string, file: File, options?: { [key: string]: any }): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<T>(url, formData, { ...options, observe: 'body' as const }).pipe(
      catchError(this.handleError<T>('upload', {} as T))
    );
  }
  /* Purpose: Downloads files from the server.
  Use Case: For fetching files (like PDFs, images, etc.) and possibly providing them for download. */
  download(url: string, options?: { [key: string]: any }): Observable<Blob> {
    const requestOptions = { ...options, responseType: 'blob' as 'json' }; // Set responseType to blob
    return this.http.get<Blob>(url, requestOptions).pipe(
      catchError(this.handleError<Blob>('download', new Blob()))
    );
  }

  /* Purpose: Allows multiple HTTP requests to be sent in a single request.
  Use Case: Useful for reducing the number of network calls when several resources need to be fetched or modified simultaneously. */
  batchRequest(requests: Array<{ method: 'GET' | 'POST' | 'PUT' | 'DELETE'; url: string; body?: any }>): Observable<any[]> {
    const observables = requests.map(req => {
      switch (req.method) {
        case 'GET':
          return this.get(req.url);
        case 'POST':
          return this.post(req.url, req.body);
        case 'PUT':
          return this.put(req.url, req.body);
        case 'DELETE':
          return this.delete(req.url);
        default:
          return of(null); // Handle unsupported methods
      }
    });
    return forkJoin(observables).pipe(catchError(err => of(err)));
  }
  
  

  // Handle errors centrally
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);  // Keep the app running by returning a safe value
    };
  }
}
