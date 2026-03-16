import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { APP_CONFIG } from '../config/app-config.token';
import { AppConfig } from '../config/app-config.interface';


/**
 * Authentication HTTP Interceptor.
 *
 * Responsibilities:
 * - Automatically attach JWT token to outgoing HTTP requests
 * - Ensure authenticated API calls include the Authorization header
 *
 * This avoids manually adding the token in every service in the Angular application.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);
    const config = inject<AppConfig>(APP_CONFIG);

    /** If request is to other APIs, simply continue the request. Do not attach the JWT Token. */
    if (!req.url.startsWith(config.apiBaseUrl)) {
        return next(req);
    }

    /** Retrieve the stored JWT token, if it exists */
    const token = authService.getToken();


    /** If no token exists, simply continue the request. */
    if (!token) {
        return next(req);
    }


    /**
     * Clone the request and attach the Authorization header.
     */
    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });


    /** Forward the modified request. */
    return next(authReq);

};
