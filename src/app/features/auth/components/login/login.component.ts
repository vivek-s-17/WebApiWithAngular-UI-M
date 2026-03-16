import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.model';
import { LoginForm } from './login.form';


/**
 * Component responsible for authenticating users.
 *
 * Responsibilities:
 * - Render login form
 * - Validate credentials
 * - Call authentication API
 * - Redirect user on success
 */
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html'
})
export class LoginComponent {

    /** Strongly typed reactive login form. */
    loginForm: FormGroup<LoginForm>;


    /** Error message returned by API. */
    apiError: string | null = null;


    /** Getter for the email textbox control in the form */
    // So, instead of using a statement like this in the .HTML file:
    //      *ngIf="loginForm.controls.email.touched && loginForm.controls.email.errors"
    // we can write:
    //      *ngIf="email.touched && email.errors"
    get email() {
        return this.loginForm.controls.email;
    }


    /** Getter for the password textbox control in the form */
    get password() {
        return this.loginForm.controls.password;
    }


    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {

        /**
         * Build the typed reactive form with validators.
         */
        this.loginForm = this.fb.group({

            email: this.fb.nonNullable.control('', {
                validators: [
                    Validators.required,
                    Validators.email
                ]
            }),

            password: this.fb.nonNullable.control('', {
                validators: [
                    Validators.required,
                    Validators.minLength(6)
                ]
            })

        });

    }


    /**
     * Submit handler for login form.
     */
    onSubmit(): void {

        this.apiError = null;

        if (this.loginForm.invalid) {

            // Trigger validation messages
            this.loginForm.markAllAsTouched();

            return;
        }

        /** Map form values to API request model. */
        const request: LoginRequest = {
            email: this.loginForm.controls.email.value,
            password: this.loginForm.controls.password.value
        };

        this.authService.login(request).subscribe({

            next: () => {

                /** Redirect to application home page after successful login. */
                this.router.navigate(['/']);

            },

            error: (error) => {

                /** Display error returned by API. */
                this.apiError = error.detail ?? 'Login failed';

            }

        });

    }

}
