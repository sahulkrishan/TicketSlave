import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EventDetailComponent} from "./event-detail/event-detail.component";
import {EventOverviewComponent} from "./event-overview/event-overview.component";
import {AuthComponent} from "./auth/auth.component";
import {EventCreationformComponent} from "./event-creationform/event-creationform.component";
import {authGuard} from "./auth.guard";
import {Roles} from "./roles";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {AccountLayoutComponent} from "./account/account-layout/account-layout.component";
import {AccountProfileComponent} from "./account/account-profile/account-profile.component";
import {AccountEventsComponent} from "./account/account-events/account-events.component";
import {CheckoutComponent} from "./payment/checkout/checkout.component";
import {SeatSelectorComponent} from "./events/seat-selector/seat-selector.component";
import {LocationOverviewComponent} from "./location-overview/location-overview.component";
import {LocationDetailComponent} from "./location-detail/location-detail.component";

export class AppRoutes {
  public static ROOT = '';
  public static PARAM_ID = ':id';
  public static OVERVIEW = 'overview';
  public static ACCOUNT = 'account';
  public static PROFILE = `profile`;
  public static ORDERS = `orders`;
  public static TICKETS = `tickets`;
  public static EVENTS = `events`;
  public static SEAT_SELECTOR = `seatsSelector`;
  public static CREATE = 'create';
  public static LOCATIONS = `locations`;
  public static USERS = `users`;
  public static AUTH = 'auth';
  public static LOGIN = 'login';
  public static REGISTER = 'register'
  public static AUTH_LOGIN = `/${AppRoutes.AUTH}/${AppRoutes.LOGIN}`;
  public static AUTH_REGISTER = `/${AppRoutes.AUTH}/${AppRoutes.REGISTER}`;
  public static FORBIDDEN = `forbidden`;
  public static CHECKOUT = `checkout`;
}

export const routes: Routes = [
  {path: AppRoutes.ROOT, redirectTo: `/${AppRoutes.OVERVIEW}`, pathMatch: 'full'},
  {
    path: AppRoutes.AUTH,
    component: AuthComponent,
    children: [
      {path: AppRoutes.LOGIN, component: AuthComponent},
      {path: AppRoutes.REGISTER, component: AuthComponent},
    ]
  },
  {
    path: AppRoutes.OVERVIEW,
    component: EventOverviewComponent,
  },
  {
    path: `${AppRoutes.EVENTS}/${AppRoutes.PARAM_ID}`,
    component: EventDetailComponent,
  },
  {
    path: `${AppRoutes.EVENTS}/${AppRoutes.PARAM_ID}/${AppRoutes.SEAT_SELECTOR}`,
    component: SeatSelectorComponent,
  },
  {
    path: AppRoutes.ACCOUNT,
    component: AccountLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: AppRoutes.ROOT, redirectTo: AppRoutes.PROFILE, pathMatch: 'full'},
      {path: AppRoutes.PROFILE, component: AccountProfileComponent},
      {
        path: AppRoutes.EVENTS,
        component: AccountEventsComponent,
        canActivate: [authGuard],
        data: {roles: [Roles.ADMIN]},
      },

      {
        path: `${AppRoutes.EVENTS}/${AppRoutes.CREATE}`,
        component: EventCreationformComponent,
        canActivate: [authGuard],
        data: {roles: [Roles.ADMIN]}
      },
      {
        path: AppRoutes.ACCOUNT_ADMIN_LOCATIONS,
        component: LocationOverviewComponent,
        canActivate: [authGuard],
        data: {roles: [Roles.ADMIN]},
      },
      {
        path: `${AppRoutes.ACCOUNT_ADMIN_LOCATIONS}/${AppRoutes.PARAM_ID}`,
        component: LocationDetailComponent,
        canActivate: [authGuard],
        data: {roles: [Roles.ADMIN]}
      },
    ]
  },
  {path: AppRoutes.CHECKOUT, component: CheckoutComponent},
  {path: AppRoutes.FORBIDDEN, component: PageNotFoundComponent},
  {path: '**', component: PageNotFoundComponent},  // Wildcard route for a 404 page
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
