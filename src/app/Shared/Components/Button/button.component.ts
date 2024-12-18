import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
 
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIconModule,MatTooltipModule,MatButtonModule,CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label: string = 'Button';  // Button label text
  @Input() color: string = 'primary';  // Button color (e.g., 'primary', 'accent', 'warn')
  @Input() icon?: string;  // Optional icon
  @Input() type: 'button' | 'submit' | 'reset' = 'button';  // Button type
  @Input() disabled: boolean = false;  // Disable button
  @Input() fullWidth: boolean = false;  // Full width option for button
  @Input() tooltip?: string;  // Optional tooltip
  @Input() width: string = '100%'; // Default to full width
  @Output() onClick = new EventEmitter<void>();  // Emit click event

  handleClick() {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }

}
