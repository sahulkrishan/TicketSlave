import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EventDetailComponent} from "./event-detail/event-detail.component";
import {EventOverviewComponent} from "./event-overview/event-overview.component";
import {AuthComponent} from "./auth/auth.component";
import {EventCreationformComponent} from "./event-creationform/event-creationform.component";

export const routes: Routes = [
    // FIXME: Add page not found component
    // { path: '**', component: AuthComponent },  // Wildcard route for a 404 page
    {path: '', redirectTo: '/events', pathMatch: 'full'},
    {path: 'events', component: EventOverviewComponent},
    {path: 'events/create', component: EventCreationformComponent},
    {path: 'events/:id', component: EventDetailComponent},
    {path: 'auth', component: AuthComponent},
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
