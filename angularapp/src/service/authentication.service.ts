import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {ResponseModel} from "../model/response.model";
import {RegistrationModel} from "../model/registration.model";
import {BaseService} from "./base.service";
import {LoginModel} from "../model/login.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService {
  private apiUrl = this.baseApiUrl + '/Auth';

  constructor(http: HttpClient) {
    super(http);
  }

  login(loginModel: LoginModel): Observable<ResponseModel<undefined>> {
    return this.http.post<ResponseModel<undefined>>(this.apiUrl + '/login', loginModel)
      .pipe(
        catchError(this.handleError<ResponseModel<undefined>>()) // Using handleError function
      );
  }

  register(registrationModel: RegistrationModel): Observable<ResponseModel<undefined>> {
    return this.http.post<ResponseModel<undefined>>(this.apiUrl + '/register', registrationModel)
      .pipe(
        catchError(this.handleError<ResponseModel<undefined>>()) // Using handleError function
      );
  }
}
