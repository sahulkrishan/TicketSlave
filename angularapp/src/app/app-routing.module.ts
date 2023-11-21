import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EventDetailComponent} from "./event-detail/event-detail.component";
import {EventOverviewComponent} from "./event-overview/event-overview.component";

const routes: Routes = [
  { path: '', component: EventOverviewComponent }, // Default route
  { path: 'details/:id', component: EventDetailComponent },
  // Add more routes as needed
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
