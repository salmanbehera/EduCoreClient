import { Component, Input,HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MenuItem } from './MenuItem';
 import { Router } from '@angular/router';
 
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MatListModule,
    CommonModule,
    MatExpansionModule,
   
   
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent{
  @Input() trigger!: MenuItem;
  @Input() isRootNode = false;
  expanded: boolean = false; // Control expansion for accordion
  //activeTrigger: any; // Variable to store the currently active menu item
  activeTrigger: MenuItem | null = null; // Variable to store the currently active menu item


  constructor(private router: Router) {}

  
  // Method to set the active menu item
  setActive(trigger: MenuItem): void {
    this.activeTrigger = trigger;
    
  }

  // Method to check if a menu item is active
  isActive(trigger: MenuItem): boolean {
     
    return this.activeTrigger === trigger;
  }

  navigate(node: any): void {
    // Check if the node has a route defined
    if (node.route) {
      // Navigate to the specified route
      this.router.navigate([node.route]).then(success => {
        if (success) {
          console.log(`Navigated to ${node.route}`);
        } else {
          console.log(`Navigation to ${node.route} failed`);
        }
      });
    } else if (node.children && node.children.length > 0) {
      // If there are child nodes, expand the menu
      this.toggleExpand();
    } else if (node.action) {
      // If there's an action defined, execute it
      node.action();
      console.log(`Executed action: ${node.action}`);
    } else {
      console.log('No valid route or action found for this node');
    }
  }
  
  


  // Toggle expansion of submenus
  toggleExpand() {
    this.expanded = !this.expanded;
  }

  // Listen for clicks outside the menu to maintain the active state
@HostListener('document:click', ['$event'])
onClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  // Check if the click was outside of the menu component
  if (!target.closest('.menu-item')) {
    // Do nothing - maintain the active state
    // Optionally, you can handle other logic here
  }
}
}