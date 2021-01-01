import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoutingModule } from 'angular-routing';
import { ScullyLibModule } from '@scullyio/ng-lib';

import { AppComponent } from './app.component';
import { FooterComponentModule } from './footer.component';
import { PageComponentModule } from './pages/page.component';
import { HeaderComponentModule } from './header.component';

@Component({
  template: '<scully-content></scully-content>',
})
export class ContentComponent {}

@NgModule({
  declarations: [AppComponent, ContentComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule.forRoot(),
    RouterModule.forRoot(
      [
        { path: 'blog/posts/:id', component: ContentComponent },
        { path: ':pageId', component: ContentComponent },
      ],
      { initialNavigation: false }
    ),
    FooterComponentModule,
    HeaderComponentModule,
    PageComponentModule,
    ScullyLibModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
