import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {SectionHeaderComponent} from "../../section-header/section-header.component";
import {EventCreationformComponent} from "../../event-creationform/event-creationform.component";
import {EventCardComponent} from "../../event-card/event-card.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AppRoutes} from "../../app-routing.module";
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {EventService} from "../../../service/event.service";
import {Subscription} from "rxjs";
import {Event} from "../../../interfaces/event";

@Component({
  selector: 'app-account-events',
  standalone: true,
  imports: [
    MatCardModule,
    SectionHeaderComponent,
    EventCreationformComponent,
    EventCardComponent,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    NgForOf
  ],
  templateUrl: './account-events.component.html',
  styleUrl: './account-events.component.scss'
})
export class AccountEventsComponent {
  eventsSubscription: Subscription;
  events: Event[] = []


  constructor(private eventService: EventService) {
    this.eventsSubscription = this.eventService.events$.subscribe({
      next: (events) => {
        this.events = events;
      }
    });
  }
  protected readonly AppRoutes = AppRoutes;
}
