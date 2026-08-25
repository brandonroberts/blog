import { bootstrapApplication } from '@angular/platform-browser';

import './styling/global.css';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
