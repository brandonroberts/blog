import { Component, NgModule } from '@angular/core';
import { ScullyLibModule } from '@scullyio/ng-lib';

@Component({
  selector: 'app-page',
  template: `
    <!-- This is where Scully will inject the static HTML -->
    <scully-content></scully-content>
  `,
})
export class PageComponent {}

@NgModule({
  declarations: [PageComponent],
  imports: [ScullyLibModule],
  exports: [PageComponent],
})
export class PageComponentModule {}
