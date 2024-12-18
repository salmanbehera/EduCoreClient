import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from './NotificationUtilities.Service';
import { MESSAGE_CONSTANTS } from '../Model/message.constants';
import ValidateForm from '../Validators/ValidateForm';
import { ErrorHandlerService } from './ErrorHandler.service';
 
@Injectable({ providedIn: 'root' })
export class HttpFormMessageService {
  constructor(private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService
  ) {}

  handleInvalidForm(form: FormGroup): void {
    ValidateForm.validaeAllformfields(form);
    this.notificationService.showError(MESSAGE_CONSTANTS.VALIDATION.INVALID_FORM);
  }

  handleSave(): void {
    this.notificationService.showSuccess(MESSAGE_CONSTANTS.SUCCESS.DATA_SAVED);
     
  }
  handleUpdate(): void {
    this.notificationService.showSuccess(MESSAGE_CONSTANTS.SUCCESS.DATA_UPDATED);
     
  }
  
    handleError(error: any): void {
    const errorMessage = this.errorHandler.handleError(error); // Leverage the ErrorHandlerService
    this.notificationService.showError(errorMessage); // Display the resolved error message
  }
  handleDataNotFound(): void {
    this.notificationService.showInfo(MESSAGE_CONSTANTS.INFO.DATA_NOT_FOUND);
     
  }
}
