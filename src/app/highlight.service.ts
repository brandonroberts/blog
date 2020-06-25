import { Injectable, Inject } from '@angular/core';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var Prism: any;

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  highlightAll() {
    if (isPlatformBrowser(this.platformId)) {
      Prism.highlightAll();
    }
  }
}
