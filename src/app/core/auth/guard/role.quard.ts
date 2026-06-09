import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = (route.data?.['roles'] as string[]) || [];

  if (expectedRoles.length === 0) {
    return true;
  }

  const userRoles = authService.getUserRoles(); 
  
  const hasRole = expectedRoles.some(role => userRoles.includes(role));

  if (hasRole) {
    return true;
  }

  return false;
};