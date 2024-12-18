import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMenuComponent } from '../CreateMenu/create-menu.component';
import { SignupComponent } from '../components/Signup/signup.component';
import { DashboardComponent } from '../components/Dashboard/dashboard.component';
import { MainLayoutComponent } from '../../../Layouts/MainLayout/main-layout.component';
import { DemoformComponent } from '../components/demoform.component';
 

const routes: Routes = [
  //{
    //path: '', // Empty path for the lazy-loaded module
   // component: MainLayoutComponent, // Layout with header and sidebar
   // children: [
    {path: 'create-menu', component: CreateMenuComponent },
    {path:'sign-up',component:SignupComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'demo',component:DemoformComponent}
  //]
//}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule  {}
