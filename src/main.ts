import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';

import AppComponent from './app/app.component.ng';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
