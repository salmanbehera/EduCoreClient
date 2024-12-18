import { Component,Output,EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,MatButtonModule,MatMenuModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>(); // Output event
// New event emitter to open the menu
@Output() openMenuEvent = new EventEmitter<void>();
  onToggleSidebar() {
    this.toggleSidebar.emit(); // Emit event to parent (Main Layout)
    this.openMenuEvent.emit();  // Emit to open the menu
  }
}
