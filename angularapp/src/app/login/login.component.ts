import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {LoginForm} from "../../model/login.form";
import {ErrorResponseModel} from "../../model/error-response.model";
import {LoginModel} from "../../model/login.model";
import {animate, style, transition, trigger} from "@angular/animations";
import {delay} from "rxjs"; // Import your authentication service

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 1, overflow: 'hidden', 'padding-top': '0', 'padding-bottom': '0' }),
            animate('200ms cubic-bezier(0.2, 0.0, 0, 1.0)',
              style({ height: '*', opacity: 1, overflow: 'hidden', 'padding-top': '*', 'padding-bottom': '*' }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: '*', opacity: 1, overflow: 'hidden', 'padding-top': '*', 'padding-bottom': '*'}),
            animate('200ms cubic-bezier(0.2, 0.0, 0, 1.0)',
              style({ height: 0, opacity: 1, overflow: 'hidden', 'padding-top': '0', 'padding-bottom': '0'  }))
          ]
        )
      ]
    )
  ]
})
export class LoginComponent {
  loginForm: FormGroup<LoginForm>;
  loading: boolean = false;
  loginFailed: boolean = false;

  bannerTitle: string = '';
  bannerText: string = '';

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
    this.loginFailed = false;
    const loginModel: LoginModel = this.loginForm.value

    this.authService.login(loginModel).subscribe(
      {
        error: (error: ErrorResponseModel) => {
          console.error(error);
          setTimeout( () => {
            this.loading = false;
            this.loginFailed = true;
            this.bannerTitle = 'Inloggen mislukt';
            this.bannerText = 'Controleer uw gegevens en probeer het opnieuw.';
          },200)
        },
        complete: () => {
          this.router.navigate(['/']);
          setTimeout( () => {
            this.loading = false;
          },200)
        }
      }
    );
  }
}
