import {FormControl} from "@angular/forms";

export interface AccountForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
}
