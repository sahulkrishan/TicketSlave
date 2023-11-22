import {booleanAttribute, Component, Input, OnInit} from '@angular/core';
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
export class EventCarouselComponent implements OnInit{
  @Input() eventData!: Event;
  @Input({transform:booleanAttribute}) buyButtonState: boolean = true;

  ngOnInit(){
    const button = document.getElementById("buyBtn");
    if(button){
      if(this.buyButtonState == false){
        button.hidden = true;
      }
    }
  }
}
