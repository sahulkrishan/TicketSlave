import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EventOverviewComponent } from './event-overview/event-overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventCardComponent } from './event-card/event-card.component';
import { EventCarouselComponent } from './event-carousel/event-carousel.component';
import {MatCardModule} from "@angular/material/card";
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, MatCardModule, EventOverviewComponent, EventCardComponent, EventCarouselComponent, AppRoutingModule
  ],
  providers: [],
  exports: [
    EventCardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
