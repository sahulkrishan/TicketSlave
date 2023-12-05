import {Component, OnInit} from '@angular/core';
import { EventService } from '../../service/event.service';
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {Event} from "../interfaces/event";
import {EventCardComponent} from "../event-card/event-card.component";
import {EventCarouselComponent} from "../event-carousel/event-carousel.component";
import {MatIconModule} from "@angular/material/icon";
import {SectionHeaderComponent} from "../section-header/section-header.component";
import {AdaptiveColor} from "../adaptive-color";
import {MaterialDynamicColors} from "@material/material-color-utilities";



@Component({
  selector: 'app-event-overview',
  standalone: true,
  imports: [MatGridListModule, CommonModule, EventCardComponent, EventCarouselComponent, MatIconModule, SectionHeaderComponent],
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements OnInit {

  events: Event[] = []

  constructor(private eventsOverviewService: EventService) { }

  ngOnInit() {
    this.eventsOverviewService.getEvents().subscribe(
      (events: Event[]) => {
        // Handle the fetched events here
        this.events = events;
        this.setAdaptiveColors()
      });

  }

  setAdaptiveColors():void {
    const gradientContainer = document.getElementById('gradientContainer');
    const adaptiveColor = new AdaptiveColor();
    adaptiveColor.getSchemeFromImageFast(this.events[0].imageUrls[0])
      .then(scheme => {
        const onPrimaryFixedVariant = MaterialDynamicColors.primaryContainer.getArgb(scheme);
        const x = adaptiveColor.argbIntToRgba(onPrimaryFixedVariant)
        console.log(x)
        gradientContainer!.style.background = `linear-gradient(to bottom, ${x} 0%, transparent)`;
      })
      .catch(e => {
        console.log(e);
      });
  }
}
