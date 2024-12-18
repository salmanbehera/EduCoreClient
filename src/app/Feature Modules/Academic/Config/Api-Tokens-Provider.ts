import { EnvironmentInjector, Provider } from '@angular/core';
import { CLASS_API_URL, SECTION_API_URL, STUDENT_API_URL } from './Api-Tokens';
import { environment } from '../environments/environment.dev';

export const apiTokenProviders: Provider[] = [
  { provide: CLASS_API_URL, useValue: environment.apiUrls.class },
  { provide: SECTION_API_URL, useValue: environment.apiUrls.section },
  { provide: STUDENT_API_URL, useValue: environment.apiUrls.student },
];
