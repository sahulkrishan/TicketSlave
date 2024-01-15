import {AfterViewInit, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventCarouselComponent} from "../event-carousel/event-carousel.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {EventService} from "../../service/event.service";
import {Event} from "../../interfaces/event";
import {EventCardComponent} from "../event-card/event-card.component";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {FastAverageColor} from "fast-average-color";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {SectionHeaderComponent} from "../section-header/section-header.component";
import {environment} from "../../environments/environment";
import {AdaptiveColor} from "../adaptive-color";
import {MatCardModule} from "@angular/material/card";
import {AccountService} from "../../service/account.service";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {Roles} from "../roles";
import {FormsModule} from "@angular/forms";
import {AppRoutes} from "../app-routing.module";


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, EventCarouselComponent, EventCardComponent, MatButtonModule, MatGridListModule, NavigationBarComponent, SectionHeaderComponent, MatCardModule, MatInputModule, MatIconModule, FormsModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit, AfterViewInit{
  private logTag = "[EventDetail]: ";

  currentEvent: Event | undefined;
  canEdit: boolean = false;
  editMode: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private eventsOverViewService: EventService
  ) {}
  ngOnInit() {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if(id){
        this.eventsOverViewService.getEventById(id).subscribe(result => {
          this.currentEvent = result;
          this.setAdaptiveColors();
          if(environment.development) {
            console.log(this.logTag + "Current event: ");
            console.log(this.currentEvent);
          }
        });
      }
    });
    this.accountService.userProfile$.subscribe(profile => {
      this.canEdit = profile?.roles.includes(Roles.ADMIN);
      console.log(this.logTag + "Can edit: " + this.canEdit);
    });
  }

  ngAfterViewInit() {
    this.setAdaptiveColors()
  }


  setAdaptiveColors(): void {
    if (this.currentEvent == undefined) return;
    const gradientContainer = document.getElementById('gradientContainer');
    if (environment.development) {
      console.log(this.logTag + "Setting adaptive colors...");
      console.log(gradientContainer);
    }
    const adaptiveColor = new AdaptiveColor();
    adaptiveColor.getSchemeFromImageFast(this.currentEvent.imageUrls[0])
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

  protected readonly AppRoutes = AppRoutes;
}
