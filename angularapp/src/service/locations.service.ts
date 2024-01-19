import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Location} from "../interfaces/location";
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
  updateLocation(location: Location){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Location>(this.apiUrl, location, httpOptions)
  }
  deleteLocation(id: string){
    return this.http.delete<Location>(this.apiUrl  + '/' + id)
  }
}
