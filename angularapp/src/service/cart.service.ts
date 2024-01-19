import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ReservationSession} from "../interfaces/reservation-session";
import {Cart} from "../interfaces/cart";

@Injectable({
  providedIn: 'root'
})
export class CartService  extends BaseService {
  private apiUrl = this.baseApiUrl + '/Cart';

  constructor(http: HttpClient) {
    super(http);
  }

  getCart() {
    return this.http.get<Cart>(this.apiUrl);
  }


  addToCart(eventSeatId: string, presaleCode: string | undefined) {
    const params = new HttpParams()
      .set('eventSeatId', eventSeatId);
    if (presaleCode != undefined) {
      params.set('presaleCode', presaleCode);
    }
    return this.http.post<ReservationSession>(this.apiUrl, null, {params})
  }

}
