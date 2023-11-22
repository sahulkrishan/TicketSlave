import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormValidators} from "../form-validators";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatGridListModule} from "@angular/material/grid-list";
import {RegistrationForm} from "../../model/registration.form";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AuthenticationService} from "../../service/authentication.service";
import {ErrorCode, ErrorResponseModel} from "../../model/error-response.model";
import {RegistrationModel} from "../../model/registration.model";
import {ResponseModel} from "../../model/response.model";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatCheckboxModule, NgOptimizedImage, MatGridListModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  animations: [
    trigger('grow', [
      transition('void <=> *', []),
      transition('* <=> *', [
        style({height: '{{startHeight}}px', opacity: 0}),
        animate('.5s ease'),
      ], {params: {startHeight: 0}})
    ])
  ]
})
export class RegisterComponent implements OnInit {
  @Output() goToLogin = new EventEmitter<string>();
  registrationForm!: FormGroup<RegistrationForm>;
  loading: boolean = false;
  registrationStatus: RegistrationStep = RegistrationStep.Form;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group<RegistrationForm>({
        firstName: new FormControl(
          '',
          {
            nonNullable: true,
            validators: [Validators.required]
          }
        ),
        lastName: new FormControl(
          '',
          {
            nonNullable: true,
            validators: [Validators.required]
          }
        ),
        email: new FormControl(
          '',
          {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.email
            ]
          }
        ),
        password: new FormControl(
          '',
          {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.minLength(12),
              FormValidators.patternValidator(/\d/, {hasNumber: true}),
              FormValidators.patternValidator(/[A-Z]/, {hasCapitalCase: true}),
              FormValidators.patternValidator(/[a-z]/, {hasSmallCase: true}),
              FormValidators.patternValidator(/[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]+/, {hasSpecialCharacters: true})
            ]
          }
        ),
        confirmPassword: new FormControl(
          '',
          {
            nonNullable: true,
            validators: [
              Validators.required
            ]
          }
        ),
        newsletter: new FormControl(
          false,
          {
            nonNullable: true
          }
        ),
        acceptedTerms: new FormControl(
          false,
          {
            nonNullable: true,
            validators: [
              Validators.requiredTrue,
            ]
          }
        )
      },
      {
        // check whether our password and confirm password match
        validators: FormValidators.passwordMatchValidator
      }
    );
  }

  submitForm() {
    this.loading = true;
    const registrationModel: RegistrationModel = this.registrationForm.value
    this.authService.register(registrationModel).subscribe({
        error: (response: HttpErrorResponse) => {
          console.error(response)
          try {
            const x = response.error as ResponseModel<null>
            x.errors.forEach((error: ErrorResponseModel) => {
            error.code == ErrorCode.AcceptedTerms ? this.registrationForm.controls.acceptedTerms.setErrors({RequiredTrue: true}) : null;
            error.code == ErrorCode.PasswordRequiresDigit ? this.registrationForm.controls.password.setErrors({hasNumber: true}) : null;
            error.code == ErrorCode.PasswordRequiresLower ? this.registrationForm.controls.password.setErrors({hasSmallCase: true}) : null;
            error.code == ErrorCode.PasswordRequiresUpper ? this.registrationForm.controls.password.setErrors({hasCapitalCase: true}) : null;
            error.code == ErrorCode.PasswordRequiresNonAlphanumeric ? this.registrationForm.controls.password.setErrors({hasSpecialCharacters: true}) : null;
            error.code == ErrorCode.UserExists ? this.registrationForm.controls.email.setErrors({UserExists: true}) : null;
            // TODO add error handling for other errors
          });} catch (e) {
            console.error(e)
          }

        },
        complete: () => {
          this.registrationStatus = RegistrationStep.Success;
          console.log("registration successful")
        }
      }
    )
    this.loading = false;
  }

  getErrorMessageUserFormPassword() {
    return this.registrationForm.controls.password.hasError('required') ? 'Wachtwoord is vereist' :
      this.registrationForm.controls.password.hasError('hasNumber') ? 'Tenminste één nummer is vereist' :
        this.registrationForm.controls.password.hasError('hasCapitalCase') ? 'Tenminste één hoofdletter is vereist' :
          this.registrationForm.controls.password.hasError('hasSmallCase') ? 'Tenminste één kleine letter is vereist' :
            this.registrationForm.controls.password.hasError('hasSpecialCharacters') ? 'Tenminste één speciale karakter is vereist' :
              this.registrationForm.controls.password.hasError('minlength') ? 'Wachtwoord moet tenminste 12 karakters bevatten' :
                this.registrationForm.controls.password.hasError('maxlength') ? 'Wachtwoord mag maximaal 64 karakters bevatten' :
                  '';
  }

  protected readonly RegistrationStep = RegistrationStep;
}


export enum RegistrationStep {
  Form,
  ConfirmationRequired,
  Success
}