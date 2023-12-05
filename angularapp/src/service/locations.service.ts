import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Location} from "../app/interfaces/location";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class LocationsService extends BaseService {
  private apiUrl = this.baseApiUrl + '/Location';

  constructor(http: HttpClient) {
    super(http);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

}
