import {booleanAttribute, Component, Input, OnInit} from '@angular/core';
import {Event} from "../interfaces/event";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink
  ],
  selector: 'app-event-carousel',
  templateUrl: './event-carousel.component.html',
  styleUrls: ['./event-carousel.component.scss']
})
export class EventCarouselComponent implements OnInit {
  @Input() eventData!: Event;
  @Input({transform: booleanAttribute}) buyButtonState: boolean = true;

  ngOnInit() {
  }

  protected readonly event = event;
}
