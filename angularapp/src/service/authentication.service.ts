import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {RegistrationModel} from "../model/registration.model";
import {BaseService} from "./base.service";
import {LoginModel} from "../model/login.model";
import {ResponseResultModel} from "../model/response-result.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService {
  private apiUrl = this.baseApiUrl + '/Auth';

  constructor(http: HttpClient) {
    super(http);
  }

  login(loginModel: LoginModel): Observable<ResponseResultModel> {
    return this.http.post<ResponseResultModel>(this.apiUrl + '/login', loginModel)
      .pipe(
        catchError(this.handleError<ResponseResultModel>()) // Using handleError function
      );
  }

  register(registrationModel: RegistrationModel): Observable<ResponseResultModel> {
    return this.http.post<ResponseResultModel>(this.apiUrl + '/register', registrationModel)
      .pipe(
        catchError(this.handleError<ResponseResultModel>()) // Using handleError function
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + '/isAuthenticated', null)
      .pipe(
        catchError(this.handleError<boolean>())
      );
  }
}
