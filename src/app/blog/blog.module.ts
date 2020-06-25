import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponentModule } from './blog.component';
import { PostComponentModule } from './post.component';

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    BlogComponentModule,
    PostComponentModule,
  ],
})
export class BlogModule {}
