// message.constants.ts

export const MESSAGE_CONSTANTS = {
    SUCCESS: {
      ACTION_COMPLETED: 'Action completed successfully.',
      DATA_SAVED: 'Data saved successfully.',
      DATA_UPDATED: 'Data Updated successfully.',
      USER_CREATED: 'User account created successfully.',
    },
    
    ERROR: {
      GENERIC_ERROR: 'Something went wrong. Please try again.',
      NETWORK_ERROR: 'Network error. Please check your internet connection.',
      UNEXPECTED_ERROR: 'An unexpected error occurred. Please contact support.',
      NOT_FOUND: 'Requested data was not found.',
    },
    
    WARNING: {
      VERIFICATION_REQUIRED: 'Please verify your input.',
      UNSAVED_CHANGES: 'You have unsaved changes.',
      DATA_MISMATCH: 'Data mismatch detected. Please check.',
    },
    
    INFO: {
      SESSION_EXPIRATION: 'Your session will expire soon.',
      UPDATE_AVAILABLE: 'New updates are available.',
      CHANGES_SAVED: 'Your changes have been saved.',
      DATA_NOT_FOUND: 'No Data Found.',
    },
    
    CONFIRMATION: {
      DELETE_CONFIRMATION: 'Are you sure you want to delete this item?',
      SAVE_CONFIRMATION: 'Do you want to save your changes?',
    },
    
    ALERT: {
      MAINTENANCE_SCHEDULED: 'System maintenance will start in 30 minutes.',
      ADMIN_PRIVILEGES_REQUIRED: 'Action requires admin privileges.',
    },
    
    VALIDATION: {
      FIELD_REQUIRED: 'This field is required.',
      EMAIL_INVALID: 'Please enter a valid email address.',
      PASSWORD_MISMATCH: 'Passwords do not match.',
      INVALID_FORM: 'Form is invalid.',
    },
    
    PROCESSING: {
      REQUEST_IN_PROGRESS: 'Processing your request...',
      DATA_LOADING: 'Please wait, your data is being loaded.',
    },
  };
  