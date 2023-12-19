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
import {AccountComponent} from "./account/account.component";
import {AccountLayoutComponent} from "./account/account-layout/account-layout.component";

export class AppRoutes {
  public static ROOT = '';
  public static PARAM_ID = ':id';
  public static EVENTS = 'events';
  public static EVENTS_CREATE = 'createEvent';
  public static ACCOUNT = 'account';
  public static ACCOUNT_PROFILE = `profile`;
  public static ACCOUNT_ORDERS = `orders`;
  public static AUTH = 'auth';
  public static LOGIN = 'login';
  public static REGISTER = 'register'
  public static AUTH_LOGIN = `/${AppRoutes.AUTH}/${AppRoutes.LOGIN}`;
  public static AUTH_REGISTER = `/${AppRoutes.AUTH}/${AppRoutes.REGISTER}`;
  public static FORBIDDEN = `forbidden`;
}

export const routes: Routes = [
  {path: AppRoutes.ROOT, redirectTo: '/events', pathMatch: 'full'},
  {
    path: AppRoutes.AUTH,
    component: AuthComponent,
    children: [
      {path: AppRoutes.LOGIN, component: AuthComponent},
      {path: AppRoutes.REGISTER, component: AuthComponent},
    ]
  },
  {
    path: AppRoutes.EVENTS,
    component: EventOverviewComponent,
  },
  {path: `${AppRoutes.EVENTS}/${AppRoutes.PARAM_ID}`, component: EventDetailComponent},
  {
    path: AppRoutes.EVENTS_CREATE,
    component: EventCreationformComponent,
    canActivate: [authGuard],
    data: {roles: [Roles.ADMIN]}
  },
  {
    path: AppRoutes.ACCOUNT,
    component: AccountLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: AppRoutes.ROOT, redirectTo: AppRoutes.ACCOUNT_PROFILE, pathMatch: 'full'},
      {path: AppRoutes.ACCOUNT_PROFILE, component: AccountComponent},
    ]
  },
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
