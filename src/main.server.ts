import 'zone.js/node';
import { render } from '@analogjs/router/server';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

export default render(AppComponent, appConfig);
