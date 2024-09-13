import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inject AuthService
  const router = inject(Router);  // Inject Router

  if (authService.isAuthenticated()) {
    return true; // Allow route navigation
  } else {
    // Redirect to login page and pass the return URL
    router.navigate(['/sign-in'], { queryParams: { redirectUrl: state.url } });
    return false; // Block route navigation
  }
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inject AuthService
  const router = inject(Router);  // Inject Router

  if (authService.isAdmin()) {
    return true; // Allow route navigation
  } else {
    // Redirect to login page and pass the return URL
    router.navigate(['/'] );
    return false; // Block route navigation
  }
};
