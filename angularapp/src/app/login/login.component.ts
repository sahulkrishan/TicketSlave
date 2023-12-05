import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';
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
import {BannerComponent, BannerOptions, BannerState} from "../banner/banner.component";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthComponent} from "../auth/auth.component";

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
  isLoggedIn: boolean = false;
  hidePassword: boolean = true;
  bannerOptions: BannerOptions = {
    state: BannerState.error,
    title: 'Onbekende fout',
    description: undefined,
    visible: false,
  };
  protected readonly BannerState = BannerState;

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

  @Input({transform: booleanAttribute})
  set registrationCompleted(value: boolean) {
    if (!value) return;
    this.bannerOptions.visible = true;
    this.bannerOptions.state = BannerState.success
    this.bannerOptions.title = 'Account geregistreerd';
    this.bannerOptions.description = 'Uw account is succesvol geregistreerd. U kunt nu inloggen.';
  }

  performLogin(): void {
    this.loading = true;
    const loginModel: LoginModel = this.loginForm.value

    this.authService.login(loginModel).subscribe(
      {
        error: (error: HttpErrorResponse) => {
          // Set timeout to wait for banner animation to finish
          setTimeout(() => {
            this.loading = false;
            this.isLoggedIn = false;
            this.bannerOptions = AuthComponent.parseBannerError(error);
          }, 300)
        },
        complete: () => {
          this.loading = false;
          this.isLoggedIn = true;

          this.bannerOptions = {
            state: BannerState.success,
            title: 'Ingelogd',
            description: 'Je wordt over enkele ogenblikken doorgestuurd.',
            visible: true,
          }
          this.loginForm.disable();
          setTimeout(() => {
            this.router.navigate(['/']).then(r => console.log(r));
          }, 1000)
        }
      }
    );
  }
}
