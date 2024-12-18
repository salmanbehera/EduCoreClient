import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse): string {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = this.handleBadRequest(error);
          break;
        case 401:
          errorMessage = 'Unauthorized: You need to log in.';
          break;
        case 403:
          errorMessage = 'Forbidden: You don’t have access to this resource.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource was not found.';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later.';
          break;
        default:
          errorMessage = `Unexpected Error: ${error.message}`;
      }
    }

    // Log the error to a remote server or console
    this.logErrorToServer(error, errorMessage);

    // Optionally, display error details in a toast/notification
    console.error('Error Message:', errorMessage);

    // Return the error message to be handled in the component
    return errorMessage;
  }

  private handleBadRequest(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object' && error.error.errors) {
      // Extract detailed error messages if available
      const validationErrors = Object.values(error.error.errors)
        .flat() // Flatten the array of arrays
        .join(', '); // Join messages into a single string
      return `Validation error(s): ${validationErrors}`;
    }
    return 'Bad Request: Please check your input.';
  }

  private logErrorToServer(error: HttpErrorResponse, message: string): void {
    // Example: Send the error details to a logging server
    const logPayload = {
      timestamp: new Date().toISOString(),
      status: error.status,
      message: message,
      url: error.url || 'N/A',
      details: error.error, // Include detailed error response if available
    };

    console.log('Logging error to server:', logPayload);

    // Optionally, use an HTTP client to send the log to a remote server
    // this.http.post('https://your-logging-endpoint.com/logs', logPayload).subscribe({
    //   next: () => console.log('Error logged successfully'),
    //   error: (loggingError) => console.error('Failed to log error:', loggingError),
    // });
    // Add logic to send logs to a remote server if needed
  }
}
