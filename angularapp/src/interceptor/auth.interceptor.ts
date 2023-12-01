import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpRequest, HttpClient, HttpErrorResponse} from "@angular/common/http";
import {HttpInterceptor} from "@angular/common/http";
import {catchError, from, Observable, switchMap, throwError} from "rxjs";
import {TokenRefreshModel} from "../model/token-refresh.model";
import {AuthService} from "../service/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{

  constructor(
    public http: HttpClient,
    public authService: AuthService
  ) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    const token = localStorage.getItem('accessToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          'accessToken': token
        }
      });
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error?.status == 403) {
          // REFRESH
          return throwError(() => error);
        } else {
          return throwError(() => error);
        }
      })
    )

  }

  refreshAccessToken(
    request: HttpRequest<any>,
    next: HttpHandler,
    tokenRefreshModel: TokenRefreshModel
  ): Observable<HttpEvent<any>> {
    return from(this.authService.refreshToken(tokenRefreshModel)).pipe(
      switchMap((res: TokenRefreshModel) => {
        // DO SOMETHING WITH TOKEN REFESH RESULT
        return next.handle(request)
      }),
      catchError((error) => {
        //Refresh Token Issue.
        if (error.status == 403) {
          // GO TO LOG IN
        }
        return throwError(() => error);
      })
    )
  }
}
