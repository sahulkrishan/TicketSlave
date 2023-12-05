import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Event} from "../interfaces/event";
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {FastAverageColor} from "fast-average-color";
import {Router} from '@angular/router';
import {MatRippleModule} from "@angular/material/core";
import {
  CorePalette, Hct, MaterialDynamicColors,
  QuantizerCelebi, SchemeContent, SchemeFidelity, SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  Score,
  TonalPalette
} from "@material/material-color-utilities";
import {MatButtonModule} from "@angular/material/button";
import {SchemeFruitSalad} from "@material/material-color-utilities/scheme/scheme_fruit_salad";
import {SchemeRainbow} from "@material/material-color-utilities/scheme/scheme_rainbow";
import {AdaptiveColor} from "../adaptive-color";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {isDark} from "fast-average-color/dist/helpers/color";


@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    MatGridListModule,
    CommonModule,
    EventCardComponent,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
  ],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements AfterViewInit {
  @Input()
  eventData!: Event;
  titleColor: string = 'white';
  subtitleColor: string = 'white';

  constructor(private router: Router) {
  }

  ngAfterViewInit() {
    this.getMainColor()
  }

  getMainColor(): void {
    const eventcontainer = document.getElementById(this.eventData.id);
    const fab = document.getElementById('fab-' + this.eventData.id);

    const start = new Date().getTime();
    const adaptiveColor = new AdaptiveColor();
    adaptiveColor.getSchemeFromImageFast(
      this.eventData.imageUrls[0],
      true,
    ).then(scheme => {
      // console.log(r)
      const elapsed = new Date().getTime() - start;
      console.log('time elapsed scheme generator (fac): ' + elapsed + 'ms. id: ' + this.eventData.id)
      const primary = MaterialDynamicColors.primary.getArgb(scheme);
      const onPrimary = MaterialDynamicColors.onPrimary.getArgb(scheme);
      const titleColor = scheme.primaryPalette.tone(99);
      const subtitleColor = scheme.neutralPalette.tone(88);
      const onPrimaryFixedVariant = MaterialDynamicColors.onPrimaryFixedVariant.getArgb(scheme);
      const primaryRgba10 = adaptiveColor.argbIntToRgb(onPrimaryFixedVariant, 0.1)
      const primaryRgba60 = adaptiveColor.argbIntToRgb(onPrimaryFixedVariant, 0.6)
      const bg = `radial-gradient(circle, ${primaryRgba10} 10%, ${primaryRgba60} 100%), rgb(0 0 0 / 15%)`
      fab!.style.background = adaptiveColor.argbIntToRgb(primary)
      fab!.style.color = adaptiveColor.argbIntToRgb(onPrimary)
      this.titleColor = adaptiveColor.argbIntToRgb(titleColor)
      this.subtitleColor = adaptiveColor.argbIntToRgb(subtitleColor)
      console.log(bg)
      eventcontainer!.style.background = bg
    })
  }

  navigateToEventDetails(id: string): void {
    const url = `events/${id}`
    this.router.navigate([url]);
  }


}
