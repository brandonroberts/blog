import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

const routes: Routes = [
  {
    path: 'lazy', loadChildren: () => new Observable(observer => {
      import('./lazy/lazy.module').then(m => {
        observer.next(m.LazyModule);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    })
  },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)  
  ],
})
export class AppRoutingModule { }