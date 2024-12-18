import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; // You can replace this with another UI notification service
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../Components/ConfirmationDilog/confirmation-dialog.component'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar,private dialog: MatDialog) {}

  // Show success message
   showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['toast-success'],
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['toast-error'],
    });
  }

  showWarning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['toast-warning'],
    });
  }

  showInfo(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'start',
      panelClass: ['toast-info'],
    });
  }

  showAlert(message: string): void {
    this.snackBar.open(message, 'Alert', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['toast-alert'],
    });
  }
  // Confirmation Dialog for user actions (Delete, Save, etc.)
  confirmAction(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message },
    });

    return dialogRef.afterClosed().toPromise(); // Returns a promise that resolves when the dialog is closed
  }

}
