import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UserModule } from './Feature Modules/User-Management/user.module';
import { MaterialModule } from './material.module';
 import { MenuService } from './Layouts/service/menu.service';
import { AppRoutingModule } from './app-routing.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AcademicModule } from './Feature Modules/Academic/academic.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { HttpErrorInterceptor } from './Shared/Interceptor/httperror.interceptor';

@NgModule({
  declarations: [
     
   ],
  imports: [
  
    BrowserModule, 
    MaterialModule,
    AcademicModule,
    UserModule,
    AppRoutingModule,
    NgxMaterialTimepickerModule

  ],
 
  providers: [
    {
      
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    MenuService,
    provideHttpClient(withFetch()), // Enable fetch API
  ],
  
  bootstrap: []
})
export class AppModule { }
