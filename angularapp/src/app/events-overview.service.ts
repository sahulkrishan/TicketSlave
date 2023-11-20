import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Component } from '@angular/core';
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

}
