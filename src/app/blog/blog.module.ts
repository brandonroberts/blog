import { CommonModule } from '@angular/common';
import { NgModule, Component } from '@angular/core';
import { RoutingModule, ModuleWithRoute } from 'angular-routing';

import { NavigationEndDirectiveModule } from '../shared/navigation-end.directive';
import { BlogComponentModule } from './blog.component';
import { PostComponentModule } from './post.component';

@Component({
  template: `
    <router>
      <route path="/posts/:id">
        <app-post *routeComponent [navigationEnd]></app-post>
      </route>
      <route path="/">
        <app-posts *routeComponent [navigationEnd]></app-posts>
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
    RoutingModule,
    NavigationEndDirectiveModule
  ],
})
export class BlogModule implements ModuleWithRoute {
  routeComponent = PostsComponent;
}
