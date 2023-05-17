import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  if (auth.isLoggedIn()) {
    return true;
  }

  inject(Router).navigate(['/login'], {
    skipLocationChange: false,
    queryParams: { redirect: state.url },
  });

  return false;
};

export const notLoggedInGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  if (auth.isLoggedOut()) {
    return true;
  }

  inject(Router).navigate(['/'], { skipLocationChange: false });

  return false;
};
