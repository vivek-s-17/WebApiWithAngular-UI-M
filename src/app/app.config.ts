import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { routes } from './app.routes';

import { APP_CONFIG } from './core/config/app-config.token';
import { AppConfig } from './core/config/app-config.interface';


/**
 * Runtime configuration object.
 * In enterprise systems, this can later be loaded from external JSON.
 */
const runtimeConfig: AppConfig = {
    apiBaseUrl: 'https://localhost:7123/api'
};


export const appConfig: ApplicationConfig = {
    providers: [								  // similar to the DI container collection in .NET
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                authInterceptor,                 // attach JWT firt
                loadingInterceptor,              // then, show loading (to ensure loading stops even if error occurs)
                httpErrorInterceptor             // and then, handle errors globally
            ])
        ),
        {
            provide: APP_CONFIG,
            useValue: runtimeConfig
        }
    ]
};
