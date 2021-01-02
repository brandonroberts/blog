import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>

    <main class="flex flex-grow justify-center min-h-screen px-4">
      <router>
        <route path="/blog" [exact]="false" [load]="components.blog"></route>
        <route path="/live" [load]="components.live"></route>
        <route path="/:pageId">
          <app-page *routeComponent></app-page>
        </route>
        <route path="/" redirectTo="/blog"></route>
      </router>
    </main>

    <app-footer></app-footer>
  `,
})
export class AppComponent {
  components = {
    blog: () => import('./blog/blog.module').then((m) => m.BlogModule),
    live: () => import('./live/live.component').then((m) => m.LiveComponent),
  };
}
