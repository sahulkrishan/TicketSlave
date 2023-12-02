import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export class FormValidators {
  constructor() {}

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        // If the control value is empty, return no error.
        return null;
      }

      // Test the value of the control against the supplied regular expression.
      const valid = regex.test(control.value);

      // If valid, return no error; otherwise, return the provided error object.
      return valid ? null : error;
    };
  }
  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (control) {
      const password: string = control.get('password')?.value; // get password from our password form control
      const confirmPassword: string = control.get('confirmPassword')?.value; // get password from our confirmPassword form control
      // compare is the password math
      if (password !== confirmPassword) {
        // if they don't match, set an error in our confirmPassword form control
        control.get('confirmPassword')?.setErrors({NoPasswordMatch: true});
        return ({NoPasswordMatch: true});
      }
    }
    return null;
  }
}
