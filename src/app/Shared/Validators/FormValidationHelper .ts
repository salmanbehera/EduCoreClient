import { AbstractControl } from '@angular/forms';

export class FormValidationHelper {
  static hasError(control: AbstractControl | null, errorName: string): boolean {
    return control?.hasError(errorName) === true && control.touched === true;
  }
}
