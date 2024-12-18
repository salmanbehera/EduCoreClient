import { Component, OnInit, ViewChild, AfterViewInit,ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';// import { RouterOutlet } from '@angular/router';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { CommonModule } from '@angular/common';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
  import { MainLayoutComponent } from './Layouts/MainLayout/main-layout.component';
 
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
   // RouterOutlet,
   // CommonModule,
    MainLayoutComponent
  
      
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //encapsulation: ViewEncapsulation.None  // Disable encapsulation
})
export class AppComponent{
   

  
}
