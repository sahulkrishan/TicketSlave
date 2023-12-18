import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {
  private apiUrl = this.baseApiUrl + '/Account';

  private _userProfile = new BehaviorSubject<User | undefined>(undefined);
  userProfile$ = this._userProfile.asObservable();

  private _signedIn= new BehaviorSubject<boolean>(false);
  signedIn$ = this._signedIn.asObservable();
  constructor(http: HttpClient) {
    super(http);
    this.userProfile$ = this._userProfile.asObservable();
    this.fetchUserProfile();
  }

  setUserProfile(userProfile: User) {
    this._userProfile.next(userProfile);
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }

  fetchUserProfile() {
    this.getUserProfile().subscribe({
      next: (user) => {
        this.setUserProfile(user);
      },
      error: () => {
        this._signedIn.next(false);
      },
      complete: () => {
        this._signedIn.next(true);
      }
    })
  }
}
