import { FormControl } from '@angular/forms';

/**
 * The Typed Reactive Form definition for the Login form.
 *
 * Ensures compile-time safety when accessing form controls.
 */
export interface LoginForm {

    /**
     * User email address.
     */
    email: FormControl<string>;


    /**
     * User password.
     */
    password: FormControl<string>;

}
