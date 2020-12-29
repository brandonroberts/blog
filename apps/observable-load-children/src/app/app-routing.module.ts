import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { defer } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () =>
      defer(() => import('./lazy/lazy.module')).pipe(
        map((m) => m.LazyModule),
        retry(2)
      ),
  },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
