import { Component } from '@angular/core';
import { Router } from '@blog/router';

@Component({
  template: ''
})
export class RedirectComponent {
  constructor(private router: Router) {
    this.router.go('/blog');
  }
}