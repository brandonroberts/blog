import { NgModule, ModuleWithProviders } from '@angular/core';
import { LocationStrategy, PathLocationStrategy, CommonModule } from '@angular/common';

import { RouterComponent } from './router.component';
import { RouteComponent } from './route.component';
import { RouteComponentTemplate } from './route-component.directive';
import { LinkTo } from './link.component';
import { UrlParser } from './url-parser';

const components = [
  RouterComponent,
  RouteComponent,
  LinkTo,
  RouteComponentTemplate
];

@NgModule({
  imports: [CommonModule],
  declarations: [components],
  exports: [components]
})
export class RouterModule {

  static forRoot(): ModuleWithProviders<RouterModule> {
    return {
      ngModule: RouterModule,
      providers: [
        UrlParser,
        { provide: LocationStrategy, useClass: PathLocationStrategy }
      ]
    }
  }
}
