import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {Title} from "@angular/platform-browser";
import {RouterOutlet} from "@angular/router";
import {NavigationBarComponent} from "./navigation-bar/navigation-bar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, NavigationBarComponent]
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title) {}
  title = environment.applicationName;

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
