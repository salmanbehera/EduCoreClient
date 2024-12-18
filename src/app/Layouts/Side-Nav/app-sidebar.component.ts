import { Component,EventEmitter,Output,HostListener,OnInit,ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { MenuItem } from '../menu/MenuItem';
import { MenuService } from '../service/menu.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
   
  CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatToolbarModule,
    MenuComponent
  ],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss'
})
export class AppSidebarComponent implements OnInit{
  
  //@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  @ViewChild(MenuComponent) menuComponent!: MenuComponent;
  @Output() closeSidebar = new EventEmitter<void>();
  menuItems: MenuItem[] = [];
   
  // initialData: string[] = [];
   constructor(private menuService: MenuService) {
  
   }

  

  ngOnInit(): void {
    // Fetch menu items from the service
    this.menuItems = this.menuService.getMenuItems();
  }

  onBackButtonClick() {
   this.closeSidebar.emit(); // Close the sidebar if at level 0
     
  }
   
}

