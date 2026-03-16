import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';



/**
 * Authentication Guard.
 *
 * Responsibilities:
 * - Prevent access to routes if the user is not authenticated
 * - Redirect unauthenticated users to the login page
 */
export const authGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);

    const router = inject(Router);


    /**
     * Check if user is authenticated.
     */
    if (authService.isAuthenticated()) {
        return true;
    }


    /**
     * Else, Redirect user to login page.
     */
    router.navigate(['/login']);


    return false;

};
