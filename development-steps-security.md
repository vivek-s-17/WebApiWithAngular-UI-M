# Development Steps for implementing Security in Angular Project


I have completed configuring the ASP.NET Web API Project to use Cookies-based authentication for the 
ADMIN Razor Pages created to add/edit users and roles, configured for role-based permissions management in the project.  


Here is the typical 401 response from the API:
```
{
  "title": "Unauthorized",
  "status": 401,
  "detail": "Invalid login credentials",
  "instance": "/api/auth/login"
}
```

However, on submitting correct login credentials, like:
```
{
  "email": "admin@demo.com",
  "password": "Password@123"
}
```

The JWT token generated carries the following information (as extracted from jwt.io):

```
{ 
  "sub": "d4550f9e-4acf-4dd8-81ff-148736c56cb3",
  "email": "admin@demo.com",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "d4550f9e-4acf-4dd8-81ff-148736c56cb3",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
  "permission": [
    "CanAddCategory",
    "CanEditCategory",
    "CanDeleteCategory",
    "CanViewCategory",
    "CanAddProduct",
    "CanEditProduct",
    "CanDeleteProduct",
    "CanViewProduct",
    "CanViewReports"
  ],
  "exp": 1773404138,
  "iss": "DemoWebApi",
  "aud": "DemoWebApiClient"
}
```

As you can see, the JWT Token from the API Application provides the ASP.NET Identity information like 
- UserName (email)
- Roles[] 
- Permissions[]


---

# The auth foundation used by the Angular stack

| Layer             | Purpose                            |
|-------------------|------------------------------------|
| AuthService       | Handles login/logout/token storage |
| AuthStateService  | Holds current user info            |
| JwtTokenService   | Decode JWT claims                  |
| AuthInterceptor   | Adds Authorization: Bearer header  |
| AuthGuard	        | Protects routes                    |
| PermissionService | Checks permissions                 |
| LoginComponent	| UI for login                       |


```
src/app
 ├── core
 │    ├── services
 │    │     auth.service.ts
 │    ├── models
 │    │     auth.model.ts
 │    ├── helpers
 │    │     jwt-helper.ts
 │    └── interceptors
 │          auth.interceptor.ts
 │
 ├── features
 │     └── auth
 │          login
 │             login.component.ts
 │             login.component.html
 │
 └── guards
       auth.guard.ts
       permission.guard.ts
```


## 01. Install JWT Helper library

```
    > npm install jwt-decode
```

- Run a Build on the project to ensure it compiles successfully.
- You might need to upgrade the Angular Build and CLI version.  Refer notes for info.

## 02. Create Authentication Models

Add the file:
```
src/app/core/models/auth.model.ts
```
and define the following models:
- LoginRequest
- LoginResponse
- JwtPayload

## 03. Create the Authentication Service

```
src/app/core/services/auth.service.ts
```

## 04. Add the Login Component.

```
    > ng g c features/auth/components/login/login --standalone
```

Then, rename the generated files to add the `.component` suffix:
  - `src/app/features/auth/components/login/login.component.spec.ts`
  - `src/app/features/auth/components/login/login.component.ts`
  - `src/app/features/auth/components/login/login.component.css`
  - `src/app/features/auth/components/login/login.component.html`

Don't forget to update the references in the `login.component.ts` file:
```
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
```
and in the reference in the `login.component.spec.ts` file:
```
    import { LoginComponent } from './login.component';
```

Next, check if the generated component builds and tests properly
```
    > ng build
    > ng test
    > ng serve
```

### Next, we will implement the component logic and UI.

STEPS:
1. Create the `login.form.ts` file, and define the Typed Reactive Form in it.
2. Implement the component logic in the `login.component.ts` file
3. Implement the component UI in the `login.component.html` file
4. Customize the UI with CSS in the `login.component.css` file, if needed.
5. Define the tests in the `login.component.spec.ts` file
6. Build
7. Test


## 05. Register the Route in `app.routes.ts` 

```
{
  path: 'login',
  component: LoginComponent
}
```

## 06. Create the Auth Interceptor 

```
`src/app/core/interceptors/auth.interceptor.ts`
```

## 07. Register the Interceptor in `app.config.ts` file

- Register the `authInterceptor` in the provider's HttpClient WithInterceptors collection!
- Ensure the sequence of how the interceptors are processed, is correct.

## 08. Validate that the code is building and testing fine.

- Build
- Test

## 09. Create the AuthGaurd and Register it in `app.routes.ts`

The **AuthGaurd** acts as the First Protection Layer for the routes in the Angular application.

To create the Gaurd, run the following command:
```
> ng g guard core/guards/auth --functional
```

This will create:
    ```
    src/app/core/guards/auth-guard.spec.ts
    src/app/core/guards/auth-guard.ts 
    ```

You will be prompted:
    ```
    ? Which type of guard would you like to create?
    >(*) CanActivate
     ( ) CanActivateChild
     ( ) CanDeactivate
     ( ) CanMatch
    ```
Choose **CanActivate**  

| Guard                | Purpose                  | Example                   |
| -------------------- | ------------------------ | ------------------------- |
| **CanActivate**      | Block entering a route   | `/categories`             |
| **CanActivateChild** | Protect all child routes | `/admin/*`                |
| **CanDeactivate**    | Prevent leaving a page   | unsaved form warning      |
| **CanMatch**         | Prevent route matching   | role-based route matching |


- Update the code in the `auth-guard.ts` file
- Configure the **Route** in the `app.routes.ts` file to use the AuthGuard.  For example:
    ```
    import { authGuard } from './core/guards/auth-guard';
    
    ...
    
    {
        path: 'categories',
        pathMatch: 'prefix',
        canActivate: [authGuard],               /* Auth Guard */
        component: CategoryListComponent
    }
    ```
- Build
- Test

## 10. Run the Applications`

1. Run the API Project
2. Run the Angular Project
   - Check out if you are able to navigate to the Categories Listing Page!
3. Check the **Developer Tools > Application > Local storage** (for the JWT token)


## 11. Create the Permission Guard

Now that AuthGaurd is working correctly, we can now create a `PermissionGuard`

```
> ng g guard core/guards/permission --functional
? Which type of guard would you like to create?
>(*) CanActivate
 ( ) CanActivateChild
 ( ) CanDeactivate
 ( ) CanMatch
```

To generate 
    ```
    src/app/core/guards/permission-guard.spec.ts
    src/app/core/guards/permission-guard.ts 
    ```

## 12. Add Permission Checks to Routes in `app.routes.ts`

After implementing the `permission-guard.ts` file, 
configure the permissions in the `app.routes.ts` file

    ```
    import { permissionGuard } from './core/guards/permission-guard';
    
    ...
    
    {
        path: 'categories',
        pathMatch: 'prefix',                        // match with '/categories', '/categories/edit/10', '/categories/create', etc.
        canActivate: [authGuard, permissionGuard],  /* AuthGuard and PermissionGuard */
        data: { permission: 'CanViewCategory' },    // match permission(s)
        loadComponent: () =>
            import('./features/categories/components/category-list/category-list.component')
                .then(m => m.CategoryListComponent)
    },
    ```
- Configure the permissions for all the needed navigation routes.
- Build

## 13. Add Permission-Based UI

Control the UI elements based on permissions in the `category-list.component.ts` file:

```
<button
  class="btn btn-primary"
  *ngIf="authService.hasPermission('CanAddCategory')">
  Add Category
</button>
```

NOTE: 
Since the CategoryListComponent now injects the `AuthService`, 
and since AuthService internally injects `APP_CONFIG`, 
the unit testing file needs to be updated.
- Correct the `category-list.component.spec.ts` file by mocking the `AppConfig` and updating the Providers.


## 14. Setup Logout 

Finally:

1. configure the `App` Component for **Logout** in the `app.ts` file
2. update the UI in `app.html` file
3. update the tests for the App Component in `app.spec.ts` file
4. Build
5. Test
6. Run



