import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EventDetailComponent} from "./event-detail/event-detail.component";
import {EventOverviewComponent} from "./event-overview/event-overview.component";
import {AuthComponent} from "./auth/auth.component";
import {EventCreationformComponent} from "./event-creationform/event-creationform.component";
import { LocationCreationformComponent } from './location-creationform/location-creationform.component';
import {LocationOverviewComponent} from "./location-overview/location-overview.component";
import {LocationDetailComponent} from "./location-detail/location-detail.component";

export const routes: Routes = [
    // FIXME: Add page not found component
    // { path: '**', component: AuthComponent },  // Wildcard route for a 404 page
    {path: '', redirectTo: '/events', pathMatch: 'full'},
    {path: 'events', component: EventOverviewComponent},
    {path: 'events/create', component: EventCreationformComponent},
    {path: 'events/:id', component: EventDetailComponent},
    {path: 'auth', component: AuthComponent},
    {path: 'locations/create', component: LocationCreationformComponent },
    {path: 'locations/overview', component: LocationOverviewComponent },
    {path: 'location/detail/:id', component: LocationDetailComponent},
];


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
