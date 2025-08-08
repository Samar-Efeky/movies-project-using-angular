import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { map, take } from 'rxjs';

export const logInGuard: CanActivateFn = (route, state) => {
  const userService =inject(UserService);
   const router = inject(Router);
   return userService.isLoggedIn().pipe(
    take(1),
    map(isLogged => {
      if (isLogged) {
        router.navigate(['/profile']); // أو أي صفحة تانية لو عاوزة
        return false;
      }
      return true;
    })
  );
};
