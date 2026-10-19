import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideFileRouter } from '@analogjs/router';
import { withContentRoutes } from '@analogjs/router/content';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';

import { withDevToContentLoader } from './providers/content-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(withContentRoutes()),
    provideHttpClient(withFetch()),
    provideClientHydration(withIncrementalHydration()),
    provideContent(
      withMarkdownRenderer(),
      ...withDevToContentLoader()
    )
  ],
};
