import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventCarouselComponent} from "../event-carousel/event-carousel.component";
import {ActivatedRoute} from "@angular/router";
import {EventsOverviewService} from "../events-overview.service";
import {Event} from "../interfaces/event";
import {EventCardComponent} from "../event-card/event-card.component";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {FastAverageColor} from "fast-average-color";


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, EventCarouselComponent, EventCardComponent, MatButtonModule, MatGridListModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit{

  currentEvent: Event | undefined;
  constructor(private route: ActivatedRoute, private eventsOverViewService: EventsOverviewService) {}
  ngOnInit() {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe(params => {
      // Get the ID from the URL
      const id = params.get('id');

      // Do something with the extracted ID
      console.log('ID from URL:', id);

      // You can perform further actions with this ID here
      if(id){
        this.eventsOverViewService.getEventById(id).subscribe(result => {
          this.currentEvent = result;
          this.getMainColor()
        });
      }
    });
  }

  getMainColor():void {
    const fac = new FastAverageColor();
    const eventcontainer = document.getElementById('dataList');
    if(this.currentEvent != undefined) {
      fac.getColorAsync(this.currentEvent.imageUrls[0])
        .then(color => {
          eventcontainer!.style.background = `linear-gradient(to bottom, ${color.rgba}, black)`;

          // maakt text wit als kleur donker is, misschien handig voor later. maar voor nublijft de kaart wit
          //eventcontainer!.style.color = kleur.isDark ? '#fff' : '#000';
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
}
