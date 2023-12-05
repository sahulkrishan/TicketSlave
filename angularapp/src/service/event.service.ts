import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpClient, HttpHeaders
} from '@angular/common/http';
import {Event, EventDto} from "../app/interfaces/event";
import {BaseService} from "./base.service";


@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService  {
  private apiUrl = this.baseApiUrl + '/Event';

  constructor(http: HttpClient) {
    super(http);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(this.apiUrl + '/' + id);
  }
  createEvent(event: EventDto){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<EventDto>(this.apiUrl, event, httpOptions);
  }
}
