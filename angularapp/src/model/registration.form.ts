import {FormControl} from "@angular/forms";

export interface RegistrationForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  newsletter: FormControl<boolean>;
  acceptedTerms: FormControl<boolean>;
}
