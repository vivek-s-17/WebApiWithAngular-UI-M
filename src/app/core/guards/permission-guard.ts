import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';


/**
 * Permission Guard
 *
 * Prevents access to routes if the user does not have the required permission.
 */
export const permissionGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);


    /**
     * Permission required for the route.
     * Defined in the route configuration.
     */
    const requiredPermission = route.data?.['permission'];


    /** If no permission is specified, allow navigation. */
    if (!requiredPermission) {
        return true;
    }


    /** Check if the user has the required permission. */
    if (authService.hasPermission(requiredPermission)) {
        return true;
    }


    /** If permission check fails, redirect user. */
    router.navigate(['/']);

    return false;

};
