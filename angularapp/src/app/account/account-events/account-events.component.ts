import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {SectionHeaderComponent} from "../../section-header/section-header.component";
import {EventCreationformComponent} from "../../event-creationform/event-creationform.component";
import {EventCardComponent} from "../../event-card/event-card.component";

@Component({
  selector: 'app-account-events',
  standalone: true,
  imports: [
    MatCardModule,
    SectionHeaderComponent,
    EventCreationformComponent,
    EventCardComponent
  ],
  templateUrl: './account-events.component.html',
  styleUrl: './account-events.component.scss'
})
export class AccountEventsComponent {

}
