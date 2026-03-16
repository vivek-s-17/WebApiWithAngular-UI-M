import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';



/**
 * Unit tests for LoginComponent.
 *
 * These tests verify:
 *  - Component creation
 *  - Form validation
 *  - Successful authentication flow
 *  - Error handling when authentication fails
 */
describe('LoginComponent', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    let router: Router;


    /**
     * Mocked AuthService.
     *
     * Only the methods used by the component need to be mocked.
     */
    let authServiceMock: {
        login: ReturnType<typeof vi.fn>;
    };


    beforeEach(async () => {

        /**
         * Create mock implementation for AuthService.
         */
        authServiceMock = {
            login: vi.fn()
        };


        await TestBed.configureTestingModule({

            imports: [LoginComponent],

            providers: [
                provideRouter([]),

                {
                    provide: AuthService,
                    useValue: authServiceMock
                }

            ]

        }).compileComponents();


        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;

        router = TestBed.inject(Router);

        fixture.detectChanges();
    });



    /**
     * Test #1
     * Component should be created successfully.
     */
    it('should create the component', () => {

        expect(component).toBeTruthy();

    });



    /**
     * Test #2
     * Email field should be required.
     */
    it('should require email', () => {

        component.loginForm.controls.email.setValue('');

        expect(component.loginForm.controls.email.valid).toBe(false);

    });



    /**
     * Test #3
     * Password field should be required.
     */
    it('should require password', () => {

        component.loginForm.controls.password.setValue('');

        expect(component.loginForm.controls.password.valid).toBe(false);

    });



    /**
     * Test #4
     * Should call AuthService.login() and navigate on successful login.
     */
    it('should call login API and navigate on success', () => {

        /** Spy on Router navigation. */
        const navigateSpy = vi.spyOn(router, 'navigate');

        /** Mock successful API response. */
        authServiceMock.login.mockReturnValue(of({ token: 'dummy-jwt-token' }));

        /**
         * Simulate user input.
         */
        component.loginForm.controls.email.setValue('admin@demo.com');
        component.loginForm.controls.password.setValue('Password@123');

        /** Submit the form. */
        component.onSubmit();

        /** Verify API call occurred. */
        expect(authServiceMock.login).toHaveBeenCalled();

        /** Verify navigation occurred. */
        expect(navigateSpy).toHaveBeenCalledWith(['/']);

    });



    /**
     * Test #5
     * Should display API error message when login fails.
     */
    it('should display error message when login fails', () => {

        /**
         * Mock failed API response.
         */
        authServiceMock.login.mockReturnValue(
            throwError(() => ({
                detail: 'Invalid login credentials'
            }))
        );

        /**
         * Simulate user input.
         */
        component.loginForm.controls.email.setValue('admin@demo.com');
        component.loginForm.controls.password.setValue('wrong-password');

        /** Submit the form. */
        component.onSubmit();

        /** Verify the error message was captured. */
        expect(component.apiError)
            .toBe('Invalid login credentials');

    });

});
