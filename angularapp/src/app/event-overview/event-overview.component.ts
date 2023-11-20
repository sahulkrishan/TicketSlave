import {Component, OnInit} from '@angular/core';
import { EventsOverviewService } from '../events-overview.service';
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {Event} from "../interfaces/event";
import {EventCardComponent} from "../event-card/event-card.component";
import { FastAverageColor } from 'fast-average-color';
import {EventCarouselComponent} from "../event-carousel/event-carousel.component";



@Component({
  selector: 'app-event-overview',
  standalone: true,
  imports: [MatGridListModule, CommonModule, EventCardComponent, EventCarouselComponent],
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.css']
})
export class EventOverviewComponent implements OnInit {

  events: Event[] = []

  constructor(private eventsOverviewService: EventsOverviewService) { }

  ngOnInit() {
    this.eventsOverviewService.getEvents().subscribe(
      (events: Event[]) => {
        // Handle the fetched events here
        this.events = events;
        this.getMainColor()
      });

  }

  getMainColor():void {
    const fac = new FastAverageColor();
    const eventcontainer = document.getElementById('eventContainer');
    fac.getColorAsync(this.events[0].imageUrls[0])
      .then(color => {
        eventcontainer!.style.background = `linear-gradient(to bottom, ${color.rgba}, black)`;

        // maakt text wit als kleur donker is, misschien handig voor later. maar voor nublijft de kaart wit
        //eventcontainer!.style.color = kleur.isDark ? '#fff' : '#000';
      })
      .catch(e => {
        console.log(e);
      });
  }

  protected readonly event = event;
}
