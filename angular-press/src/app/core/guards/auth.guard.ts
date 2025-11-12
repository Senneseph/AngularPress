import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // During SSR, allow navigation (browser will handle actual auth check)
  if (!isBrowser) {
    return true;
  }

  if (authService.isAuthenticated()) {
    // Check if route requires specific capability
    if (route.data['capability']) {
      if (!authService.hasCapability(route.data['capability'])) {
        router.navigate(['/ap-admin/dashboard']);
        return false;
      }
    }
    return true;
  }

  // Redirect to admin login with return URL
  router.navigate(['/ap-admin/login'], { queryParams: { returnUrl: state.url } });
  return false;
};