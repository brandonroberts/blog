import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Component } from '@angular/core';
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
import { provideAngularRouter } from './angular-router.service';
import { NavigationEndDirectiveModule } from './shared/navigation-end.directive';

@Component({
  selector: 'app-empty',
  template: ''
})
export class EmptyComponent {}

@NgModule({
  declarations: [AppComponent, EmptyComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule.forRoot(),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FooterComponentModule,
    PageComponentModule,
    ScullyLibModule,
    NavigationEndDirectiveModule
  ],
  providers: [provideAngularRouter()],
  bootstrap: [AppComponent],
})
export class AppModule {}
