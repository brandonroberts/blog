import { defineRouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

export const routeMeta = defineRouteMeta({
  canActivate: [
    () => {
      const router = inject(Router);
      router.navigate(['/blog']);
      return false;
    }
  ]
})

@Component({
  selector: 'app-home',
  standalone: true,
  template: ``
})
export default class HomeComponent {}
