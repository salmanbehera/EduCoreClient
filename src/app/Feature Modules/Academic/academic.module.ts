import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { apiTokenProviders } from './Config/Api-Tokens-Provider';
import { ClassService } from './services/Class.service';
 
@NgModule({
  declarations: [],
  imports: [
    CommonModule  
     
  ],
  providers: [...apiTokenProviders,ClassService],
})
export class AcademicModule { }
