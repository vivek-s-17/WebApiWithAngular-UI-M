import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth.service';

import { vi } from 'vitest';


/**
 * Unit Tests for AuthGuard
 *
 * AuthGuard protects routes that require authentication.
 *
 * Behaviour verified in these tests:
 *  - Allow navigation if user is authenticated
 *  - Block navigation if user is not authenticated
 *  - Redirect unauthenticated users to the login page
 */
describe('authGuard', () => {


    /**
     * Mock AuthService
     * Only the method used by the guard is mocked.
     */
    let authServiceMock: {
        isAuthenticated: ReturnType<typeof vi.fn>;
    };


    /**
     * Mock Router
     * Used to verify navigation redirection.
     */
    let routerMock: {
        navigate: ReturnType<typeof vi.fn>;
    };


    /**
     * Executes the functional guard within Angular's
     * dependency injection context.
     *
     * Functional guards rely on `inject()`, so they must be
     * executed using `TestBed.runInInjectionContext`.
     */
    const executeGuard = (route: ActivatedRouteSnapshot) =>
        TestBed.runInInjectionContext(() =>
            authGuard(route, {} as RouterStateSnapshot)
        );


    /**
    * Configure mocks before each test.
    */
    beforeEach(() => {

        authServiceMock = {
            isAuthenticated: vi.fn()
        };

        routerMock = {
            navigate: vi.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        });

    });


    /**
    * Test #1
    * Guard should allow navigation when the user is authenticated.
    */
    it('should allow navigation when user is authenticated', () => {

        const route = {} as unknown as ActivatedRouteSnapshot;

        authServiceMock.isAuthenticated.mockReturnValue(true);

        const result = executeGuard(route);

        expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
        expect(result).toBe(true);

    });



    /**
    * Test #2
    * Guard should block navigation when the user is not authenticated.
    */
    it('should block navigation when user is not authenticated', () => {

        const route = {} as unknown as ActivatedRouteSnapshot;

        authServiceMock.isAuthenticated.mockReturnValue(false);

        const result = executeGuard(route);

        expect(result).toBe(false);

    });


    /**
    * Test #3
    * Guard should redirect user to login page when authentication fails
    */
    it('should redirect to login when user is not authenticated', () => {

        const route = {} as unknown as ActivatedRouteSnapshot;

        authServiceMock.isAuthenticated.mockReturnValue(false);

        executeGuard(route);

        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);

    });

});
