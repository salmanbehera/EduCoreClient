import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inject the AuthService
  const router = inject(Router);            // Inject the Router

  if (authService.isLoggedIn()) {
    return true;  // Allow access if the user is authenticated
  } else {
    router.navigate(['/login']);  // Redirect to login page if not authenticated
    return false;
  }
};
