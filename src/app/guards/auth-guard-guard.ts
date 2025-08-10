import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { map, take } from 'rxjs';

// Auth guard function to protect routes
export const authGuardGuard: CanActivateFn = () => {
  // Inject the UserService to check login status
  const userService = inject(UserService);

  // Inject the Router to navigate if not logged in
  const router = inject(Router);

  return userService.isLoggedIn().pipe(
    take(1), // Take only the first emitted value, then automatically unsubscribe
    map(isLogged => {
      // If user is not logged in, redirect to sign-in page
      if (!isLogged) {
        router.navigate(['/signIn']);
        return false; // Block route activation
      }
      // Allow route activation
      return true;
    })
  );
}
