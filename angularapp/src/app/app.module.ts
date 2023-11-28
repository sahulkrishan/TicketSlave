import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RegisterComponent} from "./register/register.component";
import {MatCardModule} from "@angular/material/card";
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
    AppComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ReactiveFormsModule, BrowserAnimationsModule, RegisterComponent, MatCardModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatTooltipModule, AuthComponent
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
