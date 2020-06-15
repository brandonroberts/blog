import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@blog/router';

import { PostComponentModule } from '../post/post.component';

import { PostsComponentModule } from './posts.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  template: `
    <router>
      <route path="/posts/:postId">
        <app-post *routeComponent></app-post>
      </route>
      <route path="/">
        <app-posts *routeComponent></app-posts>
      </route>
    </router>
  `,
})
export class BlogComponent {}

@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    RouterModule,
    PostsComponentModule,
    PostComponentModule,
  ],
  exports: [BlogComponent],
})
export class BlogComponentModule {}
