import {Component, Input} from '@angular/core';
import {Event} from "../interfaces/event";
import {MatButtonModule} from "@angular/material/button";

@Component({
  standalone: true,
  imports: [
    MatButtonModule
  ],
  selector: 'app-event-carousel',
  templateUrl: './event-carousel.component.html',
  styleUrls: ['./event-carousel.component.css']
})
export class EventCarouselComponent {
  //kan het niet required worden?
  @Input() eventData!: Event;

}
