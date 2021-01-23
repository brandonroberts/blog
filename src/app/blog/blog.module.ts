import { CommonModule } from '@angular/common';
import { NgModule, Component } from '@angular/core';
import { ComponentRouterModule, ModuleWithRoute } from '@angular-component/router';

import { PostsComponentModule } from './posts.component';
import { PostComponentModule } from './post.component';

@Component({
  template: `
    <router>
      <route path="/posts/:id">
        <app-post *routeComponent></app-post>
      </route>
      <route path="/">
        <app-posts *routeComponent></app-posts>
      </route>
    </router>
  `,
})
export class PostsComponent {}

@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    PostsComponentModule,
    PostComponentModule,
    ComponentRouterModule,
  ],
})
export class BlogModule implements ModuleWithRoute {
  routeComponent = PostsComponent;
}
