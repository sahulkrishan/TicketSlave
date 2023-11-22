import {booleanAttribute, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({height: 0, opacity: 1, overflow: 'hidden', 'padding-top': '0', 'padding-bottom': '0'}),
            animate('200ms cubic-bezier(0.2, 0.0, 0, 1.0)',
              style({height: '*', opacity: 1, overflow: 'hidden', 'padding-top': '*', 'padding-bottom': '*'}))
          ]
        ),
        transition(
          ':leave',
          [
            style({height: '*', opacity: 1, overflow: 'hidden', 'padding-top': '*', 'padding-bottom': '*'}),
            animate('200ms cubic-bezier(0.2, 0.0, 0, 1.0)',
              style({height: 0, opacity: 1, overflow: 'hidden', 'padding-top': '0', 'padding-bottom': '0'}))
          ]
        )
      ]
    )
  ]
})
export class BannerComponent {
  @Input({required: true}) title!: string;
  @Input() description: string | undefined;
  @Input({transform: booleanAttribute}) visible: boolean = true;
  @Input() bannerState: BannerState = BannerState.info;
  @Input() icon: string | undefined;
  protected readonly BannerState = BannerState;

}

export enum BannerState {
  error,
  warning,
  success,
  info,
}
