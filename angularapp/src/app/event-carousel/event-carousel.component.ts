import {booleanAttribute, Component, Input, OnInit} from '@angular/core';
import {Event} from "../interfaces/event";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {AdaptiveColor} from "../adaptive-color";
import {MaterialDynamicColors} from "@material/material-color-utilities";

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgIf
  ],
  selector: 'app-event-carousel',
  templateUrl: './event-carousel.component.html',
  styleUrls: ['./event-carousel.component.scss']
})
export class EventCarouselComponent implements OnInit {
  @Input() eventData!: Event;
  @Input({transform: booleanAttribute}) moreInfoButtonVisible: boolean = true;

  titleColor: string = 'white';
  subtitleColor: string = 'white';
  buttonText: string = '';
  buttonBackground: string = '';

  ngOnInit() {
    this.setAdaptiveColors();
  }

  setAdaptiveColors(): void {
    const adaptiveColor = new AdaptiveColor();
    adaptiveColor.getSchemeFromImageFast(
      this.eventData.imageUrls[0],
      true,
    ).then(scheme => {
      const titleColor = scheme.primaryPalette.tone(99);
      const subtitleColor = scheme.neutralPalette.tone(88);
      const primary = MaterialDynamicColors.primary.getArgb(scheme);
      const onPrimary = MaterialDynamicColors.onPrimary.getArgb(scheme);

      this.titleColor = adaptiveColor.argbIntToRgb(titleColor)
      this.subtitleColor = adaptiveColor.argbIntToRgb(subtitleColor)
      this.buttonText = adaptiveColor.argbIntToRgb(onPrimary)
      this.buttonBackground = adaptiveColor.argbIntToRgb(primary)
    })
  }

  getBannerText(): string | undefined {
    if (this.eventData.saleStartAt > new Date()) {
      return `Tickets te koop vanaf ${this.eventData.saleStartAt.toLocaleDateString()}`;
    } else if (this.eventData.availableSeats === 0) {
      return 'Uitverkocht';
    } else if (this.eventData.totalSeats * 0.1 < this.eventData.availableSeats) {
      return this.eventData.lowestPrice !== undefined ? `Bijna uitverkocht! Koop nu je tickets vanaf €${this.eventData.lowestPrice!.toFixed(2)}.` : 'Bijna uitverkocht!';
    } else if (this.eventData.availableSeats > 0 && this.eventData.lowestPrice !== undefined) {
      return `Tickets verkrijgbaar vanaf €${this.eventData.lowestPrice.toFixed(2)}`;
    }
    return undefined;
  }
}
