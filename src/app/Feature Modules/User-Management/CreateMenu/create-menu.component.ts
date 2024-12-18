import { Component, OnInit, ViewChild, AfterViewInit,ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
 
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
  selector: 'app-create-menu',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule ,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
  ],
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.scss'
})
export class CreateMenuComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 
    'email',
    'phone',
    'address',
    'role',
    'status',
    'createdAt',
    'updatedAt',
    'lastLogin',
     'actions'];
  dataSource = new MatTableDataSource<User>([]);
  data: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com',
      phone: '123-456-7890',
    address: '123 Main St',
    role: 'Admin',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
     },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com',
      phone: '123-456-7890',
    address: '123 Main St',
    role: 'Admin',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
     },
    // Add more users as needed
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.data = this.data;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Ensures ViewChild is initialized
  }
}


 
