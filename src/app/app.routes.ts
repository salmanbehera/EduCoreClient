 

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'user-management', loadChildren: () => import('./Feature Modules/User-Management/routing/user-management-routing.module').then(m => m.UserManagementRoutingModule) },
   {path:'Academic',loadChildren: () => import('./Feature Modules/Academic/academic.module').then(m => m.AcademicModule)},
  //{ path: '', component: AppComponent },  // Default route points to AppComponent
  //{ path: '**', redirectTo: '' }  // Wildcard route redirects to the default pathWildcard redirect to dashboard

  //{ path: 'admission', loadChildren: () => import('./Feature Modules/Admission/admission.module').then(m => m.AdmissionModule) },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }  // Default redirect to dashboard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  
exports: [RouterModule]
})
export class AppRoutingModule {}
