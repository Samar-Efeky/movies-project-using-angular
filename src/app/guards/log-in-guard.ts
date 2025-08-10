import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { map, take } from 'rxjs';

// Route guard to prevent logged-in users from accessing certain pages (e.g., login page)
export const logInGuard: CanActivateFn = (route, state) => {
  // Inject UserService to check if the user is already logged in
  const userService = inject(UserService);

  // Inject Router to navigate to another page if needed
  const router = inject(Router);

  return userService.isLoggedIn().pipe(
    take(1), // Only take the first emitted value and then unsubscribe automatically (prevents memory leaks)
    map(isLogged => {
      // If the user is already logged in, redirect to the profile page (or any other page)
      if (isLogged) {
        router.navigate(['/profile']);
        return false; // Block navigation to the current route
      }
      // If not logged in, allow navigation
      return true;
    })
  );
};
