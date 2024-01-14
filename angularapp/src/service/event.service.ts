import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  HttpClient, HttpHeaders
} from '@angular/common/http';
import {Event, EventDto} from "../interfaces/event";
import {BaseService} from "./base.service";
import {EventSeat} from "../interfaces/event-seat";


@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService {
  private apiUrl = this.baseApiUrl + '/Event';

  constructor(http: HttpClient) {
    super(http);
    this.fetchEvents();
  }

  private _eventsLoaded: boolean = false;
  private _events = new BehaviorSubject<Event[]>(Array<Event>());
  events$ = this._events.asObservable();

  setEvents(events: Event[]) {
    this._events.next(events);
  }

  getEvents() {
    return this.http.get<Event[]>(this.apiUrl)
  }

  fetchEvents(forceFetch: boolean = !this._eventsLoaded) {
    if (!forceFetch) return;
    this.getEvents().subscribe({
      next: (user) => {
        this.setEvents(user);
      },
      error: () => {
        this._eventsLoaded = false;
      },
      complete: () => {
        this._eventsLoaded = true;
      }
    })
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(this.apiUrl + '/' + id);
  }

  getEventSeats(eventId: string) {
    return this.http.get<EventSeat[]>(`${this.apiUrl}/${eventId}/seats`);
  }

  createEvent(event: EventDto) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<EventDto>(this.apiUrl, event, httpOptions);
  }
}
