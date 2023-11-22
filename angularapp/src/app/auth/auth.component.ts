import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from "../register/register.component";
import {LoginComponent} from "../login/login.component";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RegisterComponent, LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  animations: [
    trigger("fadeInOut", [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('5s 	cubic-bezier(0.05, 0.7, 0.1, 1.0)', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('5s 	cubic-bezier(0.05, 0.7, 0.1, 1.0)', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class AuthComponent {
  authState: AuthState = AuthState.login;
  registrationCompleted: boolean = false;

  changeAuthState(state: AuthState, registrationCompleted?: boolean) {
    this.authState = state;
    if (state == AuthState.login && registrationCompleted != undefined) {
      this.registrationCompleted = registrationCompleted;
    }
  }

  protected readonly AuthState = AuthState;
}

export enum AuthState {
  login,
  register
}
