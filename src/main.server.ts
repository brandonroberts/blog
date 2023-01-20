import 'zone.js/node';
import { enableProdMode } from '@angular/core';
import { renderApplication, ɵSERVER_CONTEXT } from '@angular/platform-server';
import { provideFileRouter } from '@analogjs/router';
import { withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';

import { AppComponent } from './app/app.component';

if (import.meta.env.PROD) {
  enableProdMode();
}

export default async function render(url: string, document: string) {
  const html = await renderApplication(AppComponent, {
    appId: 'analog-app',
    document,
    url,
    providers: [
      provideFileRouter(withEnabledBlockingInitialNavigation()),
      provideContent(withMarkdownRenderer()),
      { provide: ɵSERVER_CONTEXT, useValue: 'analog-ssg' }
    ],
  });

  return html;
}
