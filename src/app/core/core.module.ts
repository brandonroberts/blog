import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { LayoutComponent, PageNotFoundComponent, AboutComponent } from './components';
import { FooterModule } from '../shared/footer';

@NgModule({
  declarations: [
    LayoutComponent,
    PageNotFoundComponent,
    AboutComponent
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
    FooterModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class CoreModule { }
