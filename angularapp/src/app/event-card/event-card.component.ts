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
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements AfterViewInit {
  @Input()
  eventData!: Event;

  constructor(private router: Router) {
  }

  ngAfterViewInit() {
    this.getMainColor()
  }

  getMainColor(): void {
    const eventcontainer = document.getElementById(this.eventData.id);
    // console.log(eventcontainer)

    const start = new Date().getTime();
    const adaptiveColor = new AdaptiveColor();
    adaptiveColor.getSchemeFromImageFast(
      this.eventData.imageUrls[0]
    ).then(scheme => {
      // console.log(r)
      let elapsed = new Date().getTime() - start;
      console.log('time elapsed scheme generator (fac): ' + elapsed + 'ms. id: ' + this.eventData.id)
      const primary = MaterialDynamicColors.primary.getArgb(scheme);
      const primaryRgba10 = adaptiveColor.argbIntToRgb(primary, 0.1)
      const primaryRgba60 = adaptiveColor.argbIntToRgb(primary, 0.6)
      const bg = `radial-gradient(circle, ${primaryRgba10} 0%, ${primaryRgba60} 100%), transparent`
      console.log(bg)
      eventcontainer!.style.background = bg

      //             radial-gradient(circle, rgba(122, 89, 0, 0.1) 0%, rgba(122, 89, 0, 0.6) 100%), transparent;
      // const bg = 'radial-gradient(circle, rgba(122, 89, 0, 0.1) 0%, rgba(122, 89, 0, 0.6) 100%), transparent';
      // console.log(bg);
      // eventcontainer!.style.background = bg;
    })

    // const start2 = new Date().getTime();
    // adaptiveColor.getSchemeFromImageFast(
    //   this.eventData.imageUrls[0]
    // ).then(r => {
    //   console.log(r)
    //   const elapsed2 = new Date().getTime() - start2;
    //   console.log('fast: ' + elapsed2)
    // })

    // this.imageToPixels(this.eventData.imageUrls[0], targetWidth, targetHeight)
    //   .then((pixels) => {
    //     console.log(pixels); // Uint32Array representing resized image pixels
    //     const quantizerResult = QuantizerCelebi.quantize(pixels, 32);
    //     console.log(quantizerResult)
    //     const scoredColors = Score.score(quantizerResult);
    //     console.log(scoredColors)
    //     const scheme = new SchemeVibrant(Hct.fromInt(scoredColors[0]), false, 0);
    //     console.log(scheme)
    //     // const tonalPalette = CorePalette.of(scoredColors[0]);
    //     // console.log(tonalPalette)
    //     const argb = MaterialDynamicColors.primary.getArgb(scheme);
    //     const onPrimary = MaterialDynamicColors.inverseSurface.getArgb(scheme);
    //     eventcontainer!.style.color = this.argbIntToRgba(onPrimary);
    //
    //     const bg = `radial-gradient(circle, ${this.argbIntToRgb(argb, 0.1)} 0%, ${this.argbIntToRgb(argb, 0.6)} 100%), transparent;`
    //     console.log(bg)
    //     eventcontainer!.style.background = bg;
    //
    //     console.log(elapsed)
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });


    // const start = new Date().getTime();
    // fac.getColorAsync(this.eventData.imageUrls[0], {
    //
    // })
    //   .then(color => {
    //     // console.log(color.rgb)
    //     // const colorCenter = color.rgb.slice(0, 3) + "a" + color.rgb.slice(3, -1) + ",0.1" + color.rgb.slice(-1);
    //     // const colorOuter = color.rgb.slice(0, 3) + "a" + color.rgb.slice(3, -1) + ",0.5" + color.rgb.slice(-1);
    //     // const bg = `radial-gradient(50.08% 102.9% at 50% 50%, ${colorCenter} 0%, ${colorOuter} 100%), transparent;`
    //     // console.log(bg)
    //     // eventcontainer!.style.background = bg;
    //     eventcontainer!.style.background = color.rgb;
    //
    //     // maakt text wit als kleur donker is, misschien handig voor later. maar voor nublijft de kaart wit
    //     eventcontainer!.style.color = color.isDark ? '#fff' : '#000';
    //       let elapsed = new Date().getTime() - start;
    //       console.log(elapsed)
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  }

  navigateToEventDetails(id: string): void {
    const url = `events/${id}`
    this.router.navigate([url]);
  }


}
