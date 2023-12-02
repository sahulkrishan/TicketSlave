import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from "../register/register.component";
import {LoginComponent} from "../login/login.component";
import {animate, style, transition, trigger} from "@angular/animations";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorCode, ResponseResultModel} from "../../model/response-result.model";
import {BannerOptions, BannerState} from "../banner/banner.component";

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
        animate('3500ms 	cubic-bezier(0.05, 0.7, 0.1, 1.0)', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('2000ms 	cubic-bezier(0.05, 0.7, 0.1, 1.0)', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class AuthComponent {
  readonly AuthState = AuthState;
  authState: AuthState = AuthState.login;
  registrationCompleted: boolean = false;

  changeAuthState(state: AuthState, registrationCompleted?: boolean) {
    this.authState = state;
    if (state == AuthState.login && registrationCompleted != undefined) {
      this.registrationCompleted = registrationCompleted;
    }
  }

  static parseBannerError(error: HttpErrorResponse): BannerOptions {
    const bannerOptions: BannerOptions = {
      visible: true,
      title: 'Onbekende fout',
      description: 'Er is een onbekende fout opgetreden, probeer het later opnieuw.',
      state: BannerState.error,
    }
    try {
      const result = error.error as ResponseResultModel[];

      result.forEach(e => {
        switch (e.code) {
          case ErrorCode.EmailNotFound:
            bannerOptions.title = "E-mailadres niet bekend"
            bannerOptions.description = "Het ingevoerde e-mailadres is niet bekend."
            break;
          case ErrorCode.IncorrectPassword:
            bannerOptions.title = "Wachtwoord onjuist"
            bannerOptions.description = "Het ingevoerde wachtwoord is onjuist.";
            break;
          case ErrorCode.VerificationRequired:
            bannerOptions.title = "Account niet geactiveerd"
            bannerOptions.description = "Uw account is nog niet geactiveerd. Controleer uw e-mail voor de activatielink.";
            break;
          case ErrorCode.UserLockedOut:
            bannerOptions.title = "Account geblokkeerd"
            if (e.duration) {
              bannerOptions.description = "Uw account is geblokkeerd tot: " + e.duration.toLocaleString();
              break;
            }
            bannerOptions.description = "Uw account is geblokkeerd. Wacht een paar minuten of neem contact op met de beheerder.";
            break;
          case ErrorCode.UserSignInNotAllowed:
            bannerOptions.title = "Account niet toegestaan"
            bannerOptions.description = "U kunt op dit moment niet inloggen, probeer het op een later moment opnieuw.";
            break;
          default:
            bannerOptions.title = 'Inloggen mislukt';
            bannerOptions.description = "Controleer uw gegevens en probeer het opnieuw.";
            break;
        }
      });
    } catch (e) {
      if (error.status == 504) {
        bannerOptions.title = 'Geen verbinding';
        bannerOptions.description = 'Kan de server niet bereiken. Controleer de internetverbinding of probeer het later opnieuw.';
      }
    }
    return bannerOptions;
  }
}

export enum AuthState {
  login,
  register
}
