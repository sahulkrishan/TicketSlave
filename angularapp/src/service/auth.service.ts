import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {RegistrationModel} from "../model/registration.model";
import {BaseService} from "./base.service";
import {LoginModel} from "../model/login.model";
import {ResponseResultModel} from "../model/response-result.model";
import {TokenRefreshModel} from "../model/token-refresh.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
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

  refreshToken(tokenRefreshModel: TokenRefreshModel): Observable<TokenRefreshModel> {
    return this.http.post<TokenRefreshModel>(this.apiUrl + '/refreshToken', tokenRefreshModel)
      .pipe(
        catchError(this.handleError<ResponseResultModel>())
      )
  }

  logout(refreshToken: string): Observable<ResponseResultModel> {
    return this.http.post<ResponseResultModel>(this.apiUrl + '/revokeToken', refreshToken)
      .pipe(
        catchError(this.handleError<ResponseResultModel>())
      );
  }

  logoutAll(): Observable<ResponseResultModel> {
    return this.http.post<ResponseResultModel>(this.apiUrl + '/revokeTokenAll', null)
      .pipe(
        catchError(this.handleError<ResponseResultModel>())
      );
  }
}
