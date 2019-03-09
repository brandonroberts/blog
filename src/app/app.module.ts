import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './core/components';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/blog', pathMatch: 'full' },
      { path: 'blog', loadChildren: './blog/blog.module#BlogModule' },
      { path: '**', component: PageNotFoundComponent }
    ]),
    MarkdownModule.forRoot({
      loader: HttpClient
    }),
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
