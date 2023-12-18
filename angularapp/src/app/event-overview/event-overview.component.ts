import {Component, OnDestroy, OnInit} from '@angular/core';
import { EventService } from '../../service/event.service';
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {Event} from "../../interfaces/event";
import {EventCardComponent} from "../event-card/event-card.component";
import {EventCarouselComponent} from "../event-carousel/event-carousel.component";
import {MatIconModule} from "@angular/material/icon";
import {SectionHeaderComponent} from "../section-header/section-header.component";
import {AdaptiveColor} from "../adaptive-color";
import {MaterialDynamicColors} from "@material/material-color-utilities";
import {Router} from "@angular/router";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";



@Component({
  selector: 'app-event-overview',
  standalone: true,
  imports: [MatGridListModule, CommonModule, EventCardComponent, EventCarouselComponent, MatIconModule, SectionHeaderComponent, NavigationBarComponent, MatPaginatorModule],
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements  OnDestroy {
  eventsSubscription: Subscription;
  events: Event[] = []

  constructor(private eventService: EventService) {
    this.eventsSubscription = this.eventService.events$.subscribe(
      (events: Event[]) => {
        // Handle the fetched events here
        this.events = events;
        this.setAdaptiveColors()
      });
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed to prevent memory leaks
    this.eventsSubscription.unsubscribe();
  }

  setAdaptiveColors():void {
    const gradientContainer = document.getElementById('gradientContainer');
    const adaptiveColor = new AdaptiveColor();
    adaptiveColor.getSchemeFromImageFast(this.events[0].imageUrls[0])
      .then(scheme => {
        const onPrimaryFixedVariant = scheme.primaryPalette.tone(20);
        const x = adaptiveColor.argbIntToRgba(onPrimaryFixedVariant)
        gradientContainer!.style.background = `linear-gradient(to bottom, ${x} 45%, transparent)`;
      })
      .catch(e => {
        console.log(e);
      });
  }
}
