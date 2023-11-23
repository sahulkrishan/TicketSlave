import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Event} from "./interfaces/event";
import {
  HttpClient, HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }
    private apiUrl = 'https://localhost:7074/stripepayment';
    chargePayment(amount: string): Observable<any> {
      // Hier kun je de data voor het verzoek samenstellen
      const data = { amount }; // Je kunt hier meer data toevoegen indien nodig

      return this.http.post<any>(this.apiUrl, data);
    }


  }
