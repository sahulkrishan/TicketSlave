import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected baseApiUrl = 'api/v1';
  constructor(protected http: HttpClient) { }

  handleError<T>() {
    return (error: any): Observable<T> => {

      return throwError(() => error['error']);
    };
  }
}
