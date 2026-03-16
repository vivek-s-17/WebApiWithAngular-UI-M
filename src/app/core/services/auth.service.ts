import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { APP_CONFIG } from '../config/app-config.token';
import { AppConfig } from '../config/app-config.interface';

import { LoginRequest, LoginResponse, JwtPayload } from '../models/auth.model';



/**
 * Service responsible for authentication operations.
 *
 * Responsibilities:
 *  - Login user
 *  - Store JWT token
 *  - Decode token
 *  - Provide permissions and roles
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly config = inject<AppConfig>(APP_CONFIG);

    private readonly loginUrl = `${this.config.apiBaseUrl}/auth/login`;

    /**
     * Local storage key used to persist the JWT token.
     */
    private readonly tokenKey = 'auth_token';



    /**
     * Authenticate the user.
     *
     * On successful login, the JWT token is stored in LocalStorage.
     */
    login(request: LoginRequest): Observable<string> {

        // NOTE: Since the API just returns the JWT Token as a string, we are using it as is.  
        //       Else, we would have used the LoginResponse model to modelBind the response,
        //       and extract the token.
        return this.http.post<string>(this.loginUrl, request).pipe(

            tap(response => {

                // store the JWT Token to the LocalStorage of the Browser
                localStorage.setItem(this.tokenKey, response);

            })

        );
    }



    /**
     * Remove the authentication token.
     */
    logout(): void {

        localStorage.removeItem(this.tokenKey);

    }



    /**
     * Retrieve the stored JWT token.
     */
    getToken(): string | null {

        return localStorage.getItem(this.tokenKey);

    }



    /**
     * Decode JWT token payload.
     */
    getPayload(): JwtPayload | null {

        const token = this.getToken();

        if (!token) {
            return null;
        }

        return jwtDecode<JwtPayload>(token);

    }


    /**
     * Retrieve user permissions from the token.
     */
    getPermissions(): string[] {

        const payload = this.getPayload();

        if (!payload || !payload.permission) {
            return [];
        }

        return payload.permission;

    }


    /**
     * Check if user has a specific permission.
     */
    hasPermission(permission: string): boolean {

        return this.getPermissions().includes(permission);

    }


    /**
     * Check whether user is authenticated.
     */
    isAuthenticated(): boolean {

        const payload = this.getPayload();

        if (!payload) {
            return false;
        }

        const expiry = payload.exp * 1000;

        return Date.now() < expiry;

    }

}
