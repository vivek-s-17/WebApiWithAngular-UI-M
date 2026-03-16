import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { permissionGuard } from './core/guards/permission-guard';

import { LoginComponent }
    from './features/auth/components/login/login.component'

import { CategoryCreateComponent }
    from './features/categories/components/category-create/category-create.component';
import { CategoryEditComponent }
    from './features/categories/components/category-edit/category-edit.component';
import { CategoryDeleteComponent }
    from './features/categories/components/category-delete/category-delete.component';

/****************************
 * NOTE:
 *    - loadComponent() Is the modern equivalent of lazy loading feature of the module.
 *    - pathMatch       Defines pattern matching for the route.
 *                      Has two values: 'full'    ensure that the complete path is matched, eg: '/categories'
 *                                      'prefix'  ensure that the path starts with, eg: '' == /<anything>   (DEFAULT)
 *                      ALWAYS place more specific routes before parameterized routes.
 ***********/


/**
 * Defines the Route Table
 */
export const routes: Routes = [
    {
        path: 'categories',
        pathMatch: 'prefix',                        // match with '/categories', '/categories/edit/10', '/categories/create', etc.
        canActivate: [authGuard, permissionGuard],  /* AuthGuard and PermissionGuard */
        data: { permission: 'CanViewCategory' },    // match permission(s)
        loadComponent: () =>
            import('./features/categories/components/category-list/category-list.component')
                .then(m => m.CategoryListComponent)
    },
    {
        path: 'categories/create',
        component: CategoryCreateComponent,
        canActivate: [authGuard, permissionGuard],  
        data: { permission: 'CanAddCategory' }      
    },
    {
        path: 'categories/edit/:id',
        component: CategoryEditComponent,
        canActivate: [authGuard, permissionGuard],
        data: { permission: 'CanEditCategory' }      
    },
    {
        path: 'categories/delete/:id',
        component: CategoryDeleteComponent,
        canActivate: [authGuard, permissionGuard],
        data: { permission: 'CanDeleteCategory' }      
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',                           /* Default Route */
        redirectTo: 'categories',
        pathMatch: 'full'
    }
];
