import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { App } from './app';
import { AuthService } from './core/services/auth.service';

import { vi } from 'vitest';


/**
 * Unit tests for the root App component.
 *
 * The App component acts as the shell of the application.
 * These tests verify:
 *  - The application component is created successfully.
 *  - The navbar title is rendered correctly.
 *  - Logout triggers AuthService.logout() and redirects to /login.
 */
describe('App', () => {

    /**
     * Mock AuthService used by the component.
     */
    let authServiceMock: {
        logout: ReturnType<typeof vi.fn>;
        isAuthenticated: ReturnType<typeof vi.fn>;
    };


    /**
     * Setup executed before every test.
     */
    beforeEach(async () => {

        authServiceMock = {
            logout: vi.fn(),
            isAuthenticated: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [App],
            providers: [
                provideRouter([]),
                { provide: AuthService, useValue: authServiceMock }
            ]
        }).compileComponents();

    });


    /**
     * Test 1
     * Verify that the application component is created.
     */
    it('should create the app', () => {

        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;

        expect(app).toBeTruthy();

    });


    /**
     * Test 2
     * Verify that the navbar brand title is rendered.
     */
    it('should render navbar brand title', () => {

        const fixture = TestBed.createComponent(App);

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;

        const brand = compiled.querySelector('.navbar-brand');

        expect(brand?.textContent).toContain('WebApiWithAngular-UI');

    });


    /**
     * Test 3
     * Verify logout behaviour.
     *
     * Expected:
     *  - AuthService.logout() is called
     *  - Router navigates to /login
     */
    it('should logout and redirect to login', () => {

        const router = TestBed.inject(Router);

        const navigateSpy = vi.spyOn(router, 'navigate');

        const fixture = TestBed.createComponent(App);

        const app = fixture.componentInstance;

        app.logout();

        expect(authServiceMock.logout).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith(['/login']);

    });

});
