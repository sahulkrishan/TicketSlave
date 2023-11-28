import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Event} from "./interfaces/event";
import {Location} from "./interfaces/location";

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>('/location');
  }

}
