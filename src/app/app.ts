import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { GlobalSpinnerComponent }
    from './shared/components/global-spinner/global-spinner.component';

import { AuthService } from './core/services/auth.service';


@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        GlobalSpinnerComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.css'
})


export class App {

    protected readonly title = signal('WebApiWithAngular-UI');

    /** Auth service exposed to template */
    public readonly authService = inject(AuthService);

    /** Router used for redirect after logout */
    private readonly router = inject(Router);

    /**
     * Logs the user out of the application.
     * Removes JWT token and redirects to login page.
     */
    logout(): void {

        this.authService.logout();

        this.router.navigate(['/login']);

    }

}
