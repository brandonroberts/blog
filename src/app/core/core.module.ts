import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { LayoutComponent, PageNotFoundComponent, PageComponent } from './components';
import { FooterModule } from '../shared/footer';

@NgModule({
  declarations: [
    LayoutComponent,
    PageComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FooterModule,
    MarkdownModule.forChild()
  ],
  exports: [
    LayoutComponent
  ]
})
export class CoreModule { }
