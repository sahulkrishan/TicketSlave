import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {EventService} from '../../service/event.service';
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {Event} from "../../interfaces/event";
import {EventCardComponent} from "../event-card/event-card.component";
import {EventCarouselComponent} from "../event-carousel/event-carousel.component";
import {MatIconModule} from "@angular/material/icon";
import {SectionHeaderComponent} from "../section-header/section-header.component";
import {AdaptiveColor} from "../adaptive-color";
import {RouterModule} from "@angular/router";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";


@Component({
  selector: 'app-event-overview',
  standalone: true,
  imports: [RouterModule, MatGridListModule, CommonModule, EventCardComponent, EventCarouselComponent, MatIconModule, SectionHeaderComponent, NavigationBarComponent, MatPaginatorModule],
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements AfterViewInit, OnDestroy {
  private logTag = "[EventOverview]: ";
  eventsSubscription: Subscription;
  events: Event[] = []

  constructor(private eventService: EventService) {
    this.eventsSubscription = this.eventService.events$.subscribe({
      next: (events) => {
        this.events = events;
        this.setAdaptiveColors();
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed to prevent memory leaks
    this.eventsSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.setAdaptiveColors()
  }

  setAdaptiveColors(): void {
    if (this.events.length == 0) return;
    const gradientContainer = document.getElementById('gradientContainer');
    if (environment.development) {
      console.log(this.logTag + "Setting adaptive colors...");
      console.log(gradientContainer);
      console.log(this.logTag + "Event image url: " + this.events[0].imageUrls[0])
    }
    const adaptiveColor = new AdaptiveColor();
    adaptiveColor.getSchemeFromImageFast(this.events[0].imageUrls[0])
      .then(scheme => {
        const onPrimaryFixedVariant = scheme.primaryPalette.tone(20);
        const x = adaptiveColor.argbIntToRgba(onPrimaryFixedVariant)
        gradientContainer!.style.background = `linear-gradient(to bottom, ${x} 45%, transparent)`;
        if (environment.development) {
          console.log(this.logTag + `Generated adaptive color: ${x}`);
        }
      })
      .catch(e => {
        console.error(e);
      });
  }
}
