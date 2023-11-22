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
    trigger(
      'xAnimation',
      [
        transition(
          '* => void',
          [
            style({height: 0, opacity: 1}),
            animate('200ms cubic-bezier(0.2, 0.0, 0, 1.0)'
            )
          ]
        ),
      ]
    )
  ]
})
export class AuthComponent {
  authState: AuthState = AuthState.login;

  constructor() {
  }

  changeAuthState(state: AuthState) {
    this.authState = state;

  }

  protected readonly AuthState = AuthState;
}

export enum AuthState {
  login,
  register
}
