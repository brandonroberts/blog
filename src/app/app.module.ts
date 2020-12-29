import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RoutingModule } from 'angular-routing';
import { ScullyLibModule } from '@scullyio/ng-lib';

import { AppComponent } from './app.component';
import { FooterComponentModule } from './footer.component';
import { PageComponentModule } from './pages/page.component';

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
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FooterComponentModule,
    PageComponentModule,
    ScullyLibModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
