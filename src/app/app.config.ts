import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideFileRouter } from '@analogjs/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withPrismHighlighter } from "@analogjs/content/prism-highlighter";

import { withDevToContentLoader } from './providers/content-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(),
    provideHttpClient(withFetch()),
    provideClientHydration(withIncrementalHydration()),
    provideContent(
      withMarkdownRenderer(), 
      withPrismHighlighter(),
      ...withDevToContentLoader()
    )
  ],
};
