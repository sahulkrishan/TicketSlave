import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { EventOverviewComponent } from './event-overview/event-overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventCardComponent } from './event-card/event-card.component';
import { EventCarouselComponent } from './event-carousel/event-carousel.component';
import {MatCardModule} from "@angular/material/card";
import { AppRoutingModule } from './app-routing.module';
import {RegisterComponent} from "./register/register.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AuthComponent} from "./auth/auth.component";
import {APP_BASE_HREF} from "@angular/common";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, MatCardModule, EventOverviewComponent, EventCardComponent, EventCarouselComponent, AppRoutingModule, ReactiveFormsModule, RegisterComponent, MatIconModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatTooltipModule, AuthComponent
  ],
  providers: [],
  exports: [
    EventCardComponent
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
