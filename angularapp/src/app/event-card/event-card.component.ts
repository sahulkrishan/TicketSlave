import {AfterViewInit, Component, Input} from '@angular/core';
import {Event} from "../interfaces/event";
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from '@angular/material/button';
import {FastAverageColor} from "fast-average-color";
import { Router } from '@angular/router';



@Component({
  selector: 'app-event-card',
    standalone: true,
    imports: [MatGridListModule, CommonModule, EventCardComponent, MatCardModule,MatButtonModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements AfterViewInit{
  @Input()
  eventData!: Event;

  constructor(private router: Router) {
  }
  ngAfterViewInit() {
    this.getMainColor()
  }

  getMainColor():void {
    console.log(this.eventData)

    const fac = new FastAverageColor();
    const eventcontainer = document.getElementById(this.eventData.id);
    console.log(eventcontainer)
    fac.getColorAsync(this.eventData.imageUrls[0])
      .then(color => {
        eventcontainer!.style.background = `linear-gradient(to bottom, ${color.rgba}, black)`;

        // maakt text wit als kleur donker is, misschien handig voor later. maar voor nublijft de kaart wit
        eventcontainer!.style.color = color.isDark ? '#fff' : '#000';
      })
      .catch(e => {
        console.log(e);
      });
  }
  navigateToEventDetails(id: string): void {
    const url    = '/details/' + id;
    this.router.navigate([url]);
  }

}
