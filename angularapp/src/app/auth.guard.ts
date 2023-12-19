import {inject} from "@angular/core";
import {first, map, of, switchMap} from "rxjs";
import {CanActivateFn, Router} from "@angular/router";
import {Roles} from "./roles";
import {AccountService} from "../service/account.service";
import {AppRoutes} from "./app-routing.module";
import {environment} from "../environments/environment";


/**
 * Checks if user has sufficient permissions to access a route
 * Required role can be specified in the route data attribute "roles"
 * Defaults to checking if user is signed in
 */
export const authGuard: CanActivateFn = (route) => {
  const logTag = "[authGuard]: ";
  const accountService = inject(AccountService);
  const router = inject(Router);
  const requiredRole = route.data["roles"];
  const loginUrl = router.parseUrl(AppRoutes.AUTH_LOGIN);
  const forbiddenUrl = router.parseUrl(AppRoutes.FORBIDDEN);
  console.log(logTag + "AuthGuard called")

  return accountService.signedIn$
    .pipe(
      switchMap((signedIn: boolean) => {
        if (signedIn) {
          console.log(logTag + "User is signed in. Checking authorization...")
          return accountService.userProfile$.pipe(
            map((user) => {
              if (environment.development) {
                console.log(logTag + `Required role: ${requiredRole}`);
                console.log(logTag + `User role(s): ${user?.roles}`);
              }
              if (user === undefined || (requiredRole !== undefined && !user.roles.includes(requiredRole.toString()))) {
                if (environment.development) {
                  console.log(logTag + "User is not authorized");
                }
                return forbiddenUrl;
              }
              if (environment.development) {
                console.log(logTag + "User is authorized");
              }
              return true;
            })
          );
        }
        console.log(logTag + "User is not signed in")
        return of(loginUrl);
      })
    );

};
