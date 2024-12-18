import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ConfirmationDialogComponent {
  // Button class variables for dynamic styling
  cancelButtonClass: string = 'cancel-btn';
  confirmButtonClass: string = 'confirm-btn';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Close dialog with true (confirm action)
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close dialog with false (cancel action)
  }
}
