import { CommonModule } from '@angular/common';
import { NgModule, Component } from '@angular/core';
import { RoutingModule, ModuleWithRoute } from 'angular-routing';

import { BlogComponentModule } from './blog.component';
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
  `
})
export class PostsComponent { }

@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    BlogComponentModule,
    PostComponentModule,
    RoutingModule
  ],
})
export class BlogModule implements ModuleWithRoute {
  routeComponent = PostsComponent;
}
