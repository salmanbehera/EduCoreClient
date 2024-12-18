import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { ResetpasswordComponent } from './ResetPassword/resetpassword.component';
import { authGuard } from './Shared/Guard/auth.guard';
import { MainLayoutComponent } from './Layouts/MainLayout/main-layout.component';
import { DashboardComponent } from './Feature Modules/User-Management/components/Dashboard/dashboard.component';
 

export const routes: Routes = [
//   { path: 'admin/users', component: UsersComponent },
{path: '', redirectTo: 'login', pathMatch: 'full' },
{path:'login',component:LoginComponent},
{path:'reset',component:ResetpasswordComponent},
 
// Protected routes, only accessible after login
{
  path: '', // Empty path for authenticated routes
  component: MainLayoutComponent, // Main layout (header + sidenav)
  canActivate: [authGuard], // Guarded route
  children: [
    
      { path: 'dashboard', component: DashboardComponent },
      {
      path: 'user-management',
      loadChildren: () =>
        import('./Feature Modules/User-Management/routing/user-management-routing.module').then(
          (m) => m.UserManagementRoutingModule
        ),
    },
    {
      path: 'Academic',
      loadChildren: () =>
        import('./Feature Modules/Academic/routing/academic-routing.module').then(
          (m) => m.AcademicRoutingModule
        ),
    },
    // Add more feature modules if needed
  ],
},

// Wildcard route: Redirect to login for unknown paths
{ path: '**', redirectTo: 'login' }
];
 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule {}
