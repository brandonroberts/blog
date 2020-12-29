import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then((m) => m.LazyModule),
  },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
