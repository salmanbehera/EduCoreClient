import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
// Define the Post interface according to the structure of your data
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
@Injectable({
  providedIn: 'root'
})
export class DemocountryService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {
    
  }

  fetchCountries(): Observable<{ items: string[]; totalCount: number }> {
     
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(response => {
        
        // Extract titles from the posts to use as country names (for demonstration)
        const titles = response.map(post => post.title);
  
        return {
          items: titles,
          totalCount: titles.length
        };
      }),
      catchError(() => {
        console.error('Error fetching posts');
        return of({ items: [], totalCount: 0 }); // Return empty array on error
      })
    );
  }
}

 













//service for bind both text and value
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { catchError, map, Observable, of } from 'rxjs';

// // Define the Post interface according to the structure of your data
// interface Post {
//   userId: number;
//   id: number;
//   title: string;
//   body: string;
// }

// // Define an interface for the items we want to return
// interface CountryItem {
//   userId: number;
//   title: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class DemocountryService {
//   private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

//   constructor(private http: HttpClient) {}

//   fetchCountries(): Observable<{ items: CountryItem[]; totalCount: number }> {
//     return this.http.get<Post[]>(this.apiUrl).pipe(
//       map(response => {
//         // Map the response to only include userId and title
//         const items: CountryItem[] = response.map(post => ({
//           userId: post.userId,
//           title: post.title
//         }));

//         return {
//           items,
//           totalCount: items.length
//         };
//       }),
//       catchError(error => {
//         console.error('Error fetching posts:', error);
//         return of({ items: [], totalCount: 0 });
//       })
//     );
//   }
// }


