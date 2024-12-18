import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppSidebarComponent } from '../Side-Nav/app-sidebar.component';
import { AppHeaderComponent } from '../Header/app-header.component';
import { RouterModule } from '@angular/router';
  
 
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [MatSidenavModule,AppSidebarComponent,AppHeaderComponent,RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  
   
   
}
