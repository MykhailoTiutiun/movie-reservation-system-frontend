import {HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "./services/auth.service";

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const token = authService.getToken();

  // Clone the request and add the Authorization header if token exists
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned)
  }
  // If no token, continue with the request as is
  return next(req);
}
