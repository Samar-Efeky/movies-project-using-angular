import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { map, take } from 'rxjs';
export const authGuardGuard: CanActivateFn = () => {
   const userService =inject(UserService);
   const router = inject(Router);
  return userService.isLoggedIn().pipe(
    take(1),
      map(isLogged => {
        if (!isLogged) {
          router.navigate(['/signIn']);
          return false;
        }
        return true;
      })
    );
  }
