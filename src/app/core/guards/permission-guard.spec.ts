import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { permissionGuard } from './permission-guard';
import { AuthService } from '../services/auth.service';

import { vi } from 'vitest';


/**
 * Unit tests for PermissionGuard.
 *
 * The guard checks whether the current user has the permission
 * required by the route configuration.
 */
describe('permissionGuard', () => {

    let authServiceMock: {
        hasPermission: ReturnType<typeof vi.fn>;
    };

    let routerMock: {
        navigate: ReturnType<typeof vi.fn>;
    };


    /**
     * Helper method to execute the guard inside Angular's DI context.
     * Functional guards use inject(), therefore they must run inside
     * TestBed.runInInjectionContext().
     */
    const executeGuard = (route: ActivatedRouteSnapshot) =>
        TestBed.runInInjectionContext(() =>
            permissionGuard(route, {} as RouterStateSnapshot)
        );


    beforeEach(() => {

        authServiceMock = {
            hasPermission: vi.fn()
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
     * Test 1
     * Guard should allow navigation if the route does not require permission.
     */
    it('should allow navigation when no permission is required', () => {

        const route = {
            data: {}
        } as unknown as ActivatedRouteSnapshot;

        const result = executeGuard(route);

        expect(result).toBe(true);

    });


    /**
     * Test 2
     * Guard should allow navigation when the user has the required permission.
     */
    it('should allow navigation when user has required permission', () => {

        const route = {
            data: { permission: 'CanViewCategory' }
        } as unknown as ActivatedRouteSnapshot;

        authServiceMock.hasPermission.mockReturnValue(true);

        const result = executeGuard(route);

        expect(authServiceMock.hasPermission)
            .toHaveBeenCalledWith('CanViewCategory');

        expect(result).toBe(true);

    });


    /**
     * Test 3
     * Guard should block navigation when the user does not have permission.
     */
    it('should block navigation when user lacks permission', () => {

        const route = {
            data: { permission: 'CanDeleteCategory' }
        } as unknown as ActivatedRouteSnapshot;

        authServiceMock.hasPermission.mockReturnValue(false);

        const result = executeGuard(route);

        expect(result).toBe(false);

    });


    /**
     * Test 4
     * Guard should redirect the user to home when permission check fails.
     */
    it('should redirect to home when permission check fails', () => {

        const route = {
            data: { permission: 'CanDeleteCategory' }
        } as unknown as ActivatedRouteSnapshot;

        authServiceMock.hasPermission.mockReturnValue(false);

        executeGuard(route);

        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);

    });

});
