import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Event} from "./interfaces/event";
import {
  HttpClient, HttpHeaders, HttpResponse
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }
    private apiUrl = 'https://localhost:7074/stripepayment';
  chargePayment(amount: string): Observable<HttpResponse<any>> {
    const data = { amount };

    return this.http.post<any>(this.apiUrl, data, { observe: 'response' });
  }


  }
