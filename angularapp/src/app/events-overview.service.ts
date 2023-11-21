import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpClient
} from '@angular/common/http';
import {Event} from "./interfaces/event";


@Injectable({
  providedIn: 'root'
})
export class EventsOverviewService {

  events : Event[] = [];
  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/event');
  }
  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>('/event/' + id);
  }

}
