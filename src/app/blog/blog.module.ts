import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material';
import { MarkdownModule } from 'ngx-markdown';

import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [
    BlogComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'posts/:postId', component: PostComponent },
      { path: '', component: BlogComponent }
    ]),
    MarkdownModule.forChild(),
    MatListModule
  ]
})
export class BlogModule { }
