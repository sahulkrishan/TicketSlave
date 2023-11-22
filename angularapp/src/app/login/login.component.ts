import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {LoginForm} from "../../model/login.form";
import {LoginModel} from "../../model/login.model";
import {animate, style, transition, trigger} from "@angular/animations";
import {CommonModule} from "@angular/common";
import {MatCommonModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {BannerComponent, BannerState} from "../banner/banner.component";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorCode} from "../../model/error-response.model";
import {ResponseModel} from "../../model/response.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, MatCommonModule, MatCardModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatTooltipModule, MatProgressSpinnerModule, BannerComponent],
  standalone: true,
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({height: 0, opacity: 1, overflow: 'hidden', 'padding-top': '0', 'padding-bottom': '0'}),
            animate('200ms cubic-bezier(0.2, 0.0, 0, 1.0)',
              style({height: '*', opacity: 1, overflow: 'hidden', 'padding-top': '*', 'padding-bottom': '*'}))
          ]
        ),
        transition(
          ':leave',
          [
            style({height: '*', opacity: 1, overflow: 'hidden', 'padding-top': '*', 'padding-bottom': '*'}),
            animate('200ms cubic-bezier(0.2, 0.0, 0, 1.0)',
              style({height: 0, opacity: 1, overflow: 'hidden', 'padding-top': '0', 'padding-bottom': '0'}))
          ]
        )
      ]
    )
  ]
})
export class LoginComponent {
  @Output() goToRegistration = new EventEmitter<string>();
  loginForm: FormGroup<LoginForm>;
  loading: boolean = false;
  showError: boolean = false;
  isLoggedIn: boolean = false;

  bannerTitle: string = '';
  bannerText: string | undefined = undefined
  bannerState: BannerState = BannerState.success;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group<LoginForm>({
      email: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required
          ]
        }
      ),
      password: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required
          ]
        }
      )
    });
  }


  performLogin(): void {
    this.loading = true;
    const loginModel: LoginModel = this.loginForm.value

    this.authService.login(loginModel).subscribe(
      {
        error: (error: HttpErrorResponse) => {
          setTimeout(() => {
            this.loading = false;
            this.isLoggedIn = false;
            this.showError = true;

            this.bannerState = BannerState.error
            try {
              const x = error.error as ResponseModel<null>

              x.errors.forEach(e => {
                switch (e.code) {
                  case ErrorCode.EmailNotFound:
                    this.loginForm.controls.email.setErrors({EmailNotFound: true});
                    this.bannerTitle = "Emailadres niet bekend"
                    this.bannerText = "Het ingevoerde e-mailadres is niet bekend."
                    break;
                  case ErrorCode.IncorrectPassword:
                    this.loginForm.controls.password.setErrors({IncorrectPassword: true});
                    this.bannerTitle = "Wachtwoord onjuist"
                    this.bannerText = "Het ingevoerde wachtwoord is onjuist.";
                    break;
                  case ErrorCode.VerificationRequired:
                    this.bannerTitle = "Account niet geactiveerd"
                    this.bannerText = "Uw account is nog niet geactiveerd. Controleer uw e-mail voor de activatielink.";
                    break;
                  case ErrorCode.UserLockedOut:
                    this.bannerTitle = "Account geblokkeerd"
                    this.bannerText = "Uw account is geblokkeerd. Wacht een paar minuten of neem contact op met de beheerder.";
                    break;
                  case ErrorCode.UserSignInNotAllowed:
                    this.bannerTitle = "Account uitgeschakeld"
                    this.bannerText = "U kunt op dit moment niet inloggen, probeer het op een later moment opnieuw.";
                    break;
                  default:
                    this.bannerTitle = 'Inloggen mislukt';
                    this.bannerText = "Controleer uw gegevens en probeer het opnieuw.";
                    break;
                }
              });
            } catch (e) {
              console.error(e)
            }
            // this.bannerText = this.getBannerErrorMsg(error);
          }, 300)
        },
        complete: () => {
          this.loading = false;
          this.isLoggedIn = true;

          this.bannerState = BannerState.success
          this.bannerTitle = 'Ingelogd';
          this.bannerText = 'Je wordt over enkele ogenblikken doorgestuurd.';
          this.loginForm.disable();
          setTimeout(() => {
            this.router.navigate(['/']).then(r => console.log(r));
          }, 300)
        }
      }
    );
  }

  getBannerErrorMsg(error: HttpErrorResponse): string {
    console.log(error)
    if (error.status == 504) {
      return 'De server is niet bereikbaar, controleer de internetverbinding of probeer het later opnieuw.';
    } else if (error.status == 401) {
      return 'Controleer uw gegevens en probeer het opnieuw.';
    } else {
      return 'Er is een onbekende fout opgetreden. Probeer het later opnieuw.';
    }
  }

  protected readonly BannerState = BannerState;
}
