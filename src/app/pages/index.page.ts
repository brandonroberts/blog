import { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

export const routeMeta: RouteMeta = {
  canActivate: [
    () => {
      const router = inject(Router);
      router.navigate(['/blog']);
      return false;
    }
  ]
};

@Component({
  selector: 'app-home',
  standalone: true,
  template: ``
})
export default class HomeComponent {}
