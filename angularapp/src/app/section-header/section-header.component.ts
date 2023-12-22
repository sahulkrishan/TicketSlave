import {Component, Input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf
  ],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent {
  @Input({required: true}) title: string = '';
  @Input() icon: string | undefined;
}
