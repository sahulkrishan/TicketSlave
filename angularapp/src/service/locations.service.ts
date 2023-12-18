import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Location} from "../app/interfaces/location";
import {BaseService} from "./base.service";
import {Event, EventDto} from "../app/interfaces/event";

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
  addLocation(location: Location){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Location>(this.apiUrl, location, httpOptions);
  }
  getLocationById(id: string){
    return this.http.get<Location>(this.apiUrl + '/' + id);

  }
}
