import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassMasterComponent } from '../components/class-master.component';
import { SectionMasterComponent } from '../components/section-master.component';
import { StudentCategoryComponent } from '../components/student-category.component';
 
 

const routes: Routes = [
  //{
    //path: '', // Empty path for the lazy-loaded module
   // component: MainLayoutComponent, // Layout with header and sidebar
   // children: [
    {path: 'class', component: ClassMasterComponent },
    {path:'section',component:SectionMasterComponent},
    {path:'category',component:StudentCategoryComponent},
    
  //]
//}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicRoutingModule  {}
