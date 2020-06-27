import {
  Component,
  NgModule,
  Renderer2,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';

import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { CommentsService } from './comments.service';

@Component({
  selector: 'app-post-comments',
  template: ` <div id="{{ containerId }}"></div> `,
  styles: [''],
})
export class PostCommentsComponent implements AfterViewInit {
  containerId = this.commentsService.containerId;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private routeService: ScullyRoutesService,
    private commentsService: CommentsService
  ) {}

  ngAfterViewInit() {
    this.routeService
      .getCurrent()
      .pipe(first())
      .subscribe((route) => {
        const config = {
          url: this.router.url,
          title: `Brandon Roberts - ${route.title}`,
        };

        this.commentsService.initialize(config, this.renderer, this.el);
      });
  }
}

@NgModule({
  declarations: [PostCommentsComponent],
  exports: [PostCommentsComponent],
})
export class PostCommentsComponentModule {}
