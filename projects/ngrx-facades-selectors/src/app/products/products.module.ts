import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

import { EffectsModule } from '@ngrx/effects';

import { ProductEffects } from '../shared/state/products/product.effects';

import { ProductsPageComponent } from './components/products-page/products-page.component';

@NgModule({
  declarations: [ProductsPageComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatListModule,
    EffectsModule.forFeature([ProductEffects]),
    RouterModule.forChild([
      { path: '', component: ProductsPageComponent }
    ])
  ]
})
export class ProductsModule { }
