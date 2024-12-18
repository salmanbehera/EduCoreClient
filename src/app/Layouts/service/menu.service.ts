import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MenuItem } from '../menu/MenuItem';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      children: [] // Optional: could be omitted or null
    },
    {
      title: 'Administration',
      icon: 'admin_panel_settings',
      children: [
        {
          title: 'Users',
          icon: 'people',
          children: [
            { 
              title: 'Add', 
              icon: 'add',
              children: [
                { title: 'Create Menu', icon: 'subdirectory_arrow_right', route: '/user-management/create-menu' },
                { title: 'Demopage', icon: 'subdirectory_arrow_right', route: '/user-management/demo' }
              ]
            },
            { title: 'Edit', icon: 'edit', route: '/user-management/sign-up' },
            { title: 'Delete', icon: 'delete', route: '/user-management/dashboard' }
          ]
        },
        
        {
          title: 'Roles',
          icon: 'lock',
          children: [
            { title: 'Add', icon: 'add', route: '/roles/add' },
            { title: 'Edit', icon: 'edit', route: '/roles/edit' },
            { title: 'Delete', icon: 'delete', route: '/roles/delete' }
          ]
        }
      ]
    },

    {
      title: 'Master',
      icon: 'apps',
      children: [
        {
          title: 'Academic',
          icon: 'school',
          children: [
             
            { title: 'Class', icon: 'class', route: '/Academic/class' },
            { title: 'Section', icon: 'category', route: '/Academic/section' },
            { title: 'Category', icon: 'category', route: '/Academic/category' }
          ]
        },
        
        {
          title: 'Accounts',
          icon: 'Account Box',
          children: [
            { title: 'Add', icon: 'add', route: '/roles/add' },
            { title: 'Edit', icon: 'edit', route: '/roles/edit' },
            { title: 'Delete', icon: 'delete', route: '/roles/delete' }
          ]
        }
      ]
    },

    {
      title: 'Reports',
      icon: 'assessment',
      children: [
        { title: 'Sales', icon: 'attach_money', route: '/reports/sales' },
        { title: 'Inventory', icon: 'inventory', route: '/reports/inventory' }
      ]
    }
  ];

  constructor(private router: Router) {}

  // Method to get menu items
  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }
  // Navigate to a specific menu item's route
  navigateTo(menuItem: MenuItem): void {
    if (menuItem.route) {
      this.router.navigate([menuItem.route]);
    }
  }
}
