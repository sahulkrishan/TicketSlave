import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ReservationSession} from "../interfaces/reservation-session";

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService {
  private apiUrl = this.baseApiUrl + '/Payment';

  constructor(http: HttpClient) {
    super(http);
  }

  createCheckoutSession(eventSeatId: string) {
    const params = new HttpParams()
      .set('reservationSessionId', eventSeatId);
    return this.http.post(this.apiUrl + '/createCheckoutSession', null, {
      params,
      responseType: 'text'
    })
  }
}
