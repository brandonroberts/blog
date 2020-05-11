import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@blog/router';

import { PostComponent } from '../post/post.component';

import { PostsComponent } from './posts.component';
import { CommonModule } from '@angular/common';
import { Route } from '@blog/router';

@Component({
  selector: 'app-blog',
  template: `
    <router>
      <route 
        *ngFor="let route of routes"
        [path]="route.path"
        [component]="route.component">
      </route>
    </router>
  `
})
export class BlogComponent {
  routes: Route[] = [
    { path: '/posts/:postId', component: PostComponent },
    { path: '', component: PostsComponent }
  ];
}

@NgModule({
  declarations: [
    BlogComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class BlogComponentModule {}