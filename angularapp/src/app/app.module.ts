import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RegisterComponent} from "./register/register.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ReactiveFormsModule, BrowserAnimationsModule, RegisterComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
