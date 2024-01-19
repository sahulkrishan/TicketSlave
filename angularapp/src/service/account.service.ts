import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, ReplaySubject} from "rxjs";
import {User} from "../interfaces/user";
import {environment} from "../environments/environment";
import {Order} from "../interfaces/order";

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {
  private logTag = "[AccountService]: ";
  private apiUrl = this.baseApiUrl + '/Account';

  private _userProfile = new ReplaySubject<User>(1);
  userProfile$ = this._userProfile.asObservable();

  private _signedIn = new ReplaySubject<boolean>(1);
  signedIn$ = this._signedIn.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.userProfile$ = this._userProfile.asObservable();
    this.fetchUserProfile();
  }

  private setUserProfile(userProfile: User) {
    this._userProfile.next(userProfile);
  }

  private getUserProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }

  setSignedIn(signedIn: boolean) {
    this._signedIn.next(signedIn);
  }

  fetchUserProfile() {
    if (environment.development) {
      console.log(this.logTag + "Fetching user profile")
    }
    this.getUserProfile().subscribe({
      next: (user) => {
        this.setUserProfile(user);
        this._signedIn.next(true);
        if (environment.development) {
          console.log(this.logTag + "User profile fetched")
          console.log(user)
        }
      },
      error: () => {
        this._signedIn.next(false);
      }
    })
  }

  getOrders() {
    return this.http.get<Order[]>(this.apiUrl + "/Orders");
  }

  logout() {
    return this.http.post<HttpResponse<never>>(this.apiUrl + "/logout", null);
  }
}
