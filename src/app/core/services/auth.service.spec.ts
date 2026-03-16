import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from './auth.service';

import { APP_CONFIG } from '../config/app-config.token';
import { AppConfig } from '../config/app-config.interface';



/**
 * Unit Tests for AuthService
 *
 * This service handles authentication logic including:
 *  - login
 *  - storing JWT tokens
 *  - decoding tokens
 *  - permission checks
 *  - authentication status
 */
describe('AuthService', () => {

    let service: AuthService;


    /**
     * Mock HttpClient used to simulate API calls.
     */
    let httpMock: {
        post: ReturnType<typeof vi.fn>;
    };


    /**
     * Mock application configuration.
     */
    const mockConfig: AppConfig = {
        apiBaseUrl: 'https://localhost:5001/api'
    };



    beforeEach(() => {

        httpMock = {
            post: vi.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: HttpClient, useValue: httpMock },
                { provide: APP_CONFIG, useValue: mockConfig }
            ]
        });

        service = TestBed.inject(AuthService);

        /** Ensure localStorage is clean before every test. */
        localStorage.clear();

    });



    /**
     * Test #1
     * Login should call API and store JWT token in localStorage.
     */
    it('should store token after successful login', () => {

        const fakeToken = 'mock.jwt.token';

        httpMock.post.mockReturnValue(of(fakeToken));

        service.login({ email: 'admin@test.com', password: 'Password123' })
            .subscribe();

        expect(httpMock.post).toHaveBeenCalled();

        expect(localStorage.getItem('auth_token'))
            .toBe(fakeToken);

    });



    /**
     * Test #2
     * logout() should remove token from localStorage.
     */
    it('should remove token on logout', () => {

        localStorage.setItem('auth_token', 'some.token');

        service.logout();

        expect(localStorage.getItem('auth_token'))
            .toBeNull();

    });



    /**
     * Test #3
     * getToken() should retrieve token from localStorage.
     */
    it('should return token from localStorage', () => {

        localStorage.setItem('auth_token', 'sample.token');

        const token = service.getToken();

        expect(token).toBe('sample.token');

    });



    /**
     * Test #4
     * getPermissions() should return permissions from decoded JWT.
     */
    it('should return permissions from payload', () => {

        /**
         * Create a fake JWT payload
         */
        const payload = {
            exp: Math.floor(Date.now() / 1000) + 1000,
            permission: ['CanAddCategory', 'CanEditCategory']
        };

        /**
         * Create a simple fake token header.payload.signature
         */
        const token =
            'header.'
            + btoa(JSON.stringify(payload))
            + '.signature';

        localStorage.setItem('auth_token', token);

        const permissions = service.getPermissions();

        expect(permissions.length).toBe(2);

    });



    /**
     * Test #5
     * hasPermission() should return true if permission exists.
     */
    it('should return true when permission exists', () => {

        const payload = {
            exp: Math.floor(Date.now() / 1000) + 1000,
            permission: ['CanDeleteCategory']
        };

        const token =
            'header.'
            + btoa(JSON.stringify(payload))
            + '.signature';

        localStorage.setItem('auth_token', token);

        const result = service.hasPermission('CanDeleteCategory');

        expect(result).toBe(true);

    });



    /**
     * Test #6
     * hasPermission() should return false if permission does not exist.
     */
    it('should return false when permission does not exist', () => {

        const payload = {
            exp: Math.floor(Date.now() / 1000) + 1000,
            permission: ['CanViewCategory']
        };

        const token =
            'header.'
            + btoa(JSON.stringify(payload))
            + '.signature';

        localStorage.setItem('auth_token', token);

        const result = service.hasPermission('CanDeleteCategory');

        expect(result).toBe(false);

    });



    /**
     * Test #7
     * isAuthenticated() should return true when token is valid.
     */
    it('should return true when token is not expired', () => {

        const payload = {
            exp: Math.floor(Date.now() / 1000) + 1000
        };

        const token =
            'header.'
            + btoa(JSON.stringify(payload))
            + '.signature';

        localStorage.setItem('auth_token', token);

        const result = service.isAuthenticated();

        expect(result).toBe(true);

    });



    /**
     * Test #8
     * isAuthenticated() should return false when token is expired.
     */
    it('should return false when token is expired', () => {

        const payload = {
            exp: Math.floor(Date.now() / 1000) - 1000
        };

        const token =
            'header.'
            + btoa(JSON.stringify(payload))
            + '.signature';

        localStorage.setItem('auth_token', token);

        const result = service.isAuthenticated();

        expect(result).toBe(false);

    });

});
