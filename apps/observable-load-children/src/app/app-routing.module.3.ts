import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const routes: Routes = [
  { path: 'lazy', loadChildren: () => from(import('./lazy/lazy.module')).pipe(map(m => m.LazyModule)) },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)  
  ],
})
export class AppRoutingModule { }
