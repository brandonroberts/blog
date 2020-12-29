import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';
import { RoutingModule } from 'angular-routing';

@Component({
  selector: 'app-posts',
  template: `
    <h2>Posts</h2>

    <mat-list>
      <mat-list-item *ngFor="let post of posts$ | async">
        <h2 mat-line>
          <a linkTo="{{ post.route }}">{{ post.title }}</a>
        </h2>

        <p mat-line>
          {{ post.publishedDate | date: 'longDate' }} -
          {{ post.readingTime }} min read
        </p>
      </mat-list-item>
    </mat-list>
  `,
  styles: [
    `
      a {
        color: black;
        white-space: initial;
      }

      :host /deep/ .mat-list-item {
        font-size: 24px;
      }

      @media screen and (max-width: 480px) {
        :host /deep/ .mat-list-item {
          font-size: 16px;
        }
      }
    `,
  ],
})
export class PostsComponent {
  posts$ = this.routesService.available$.pipe(
    map((routes) => routes.filter((route) => this.isPost(route))),
    map((filteredRoutes) =>
      filteredRoutes
        .slice()
        .sort((a, b) =>
          new Date(a.publishedDate).getTime() >
          new Date(b.publishedDate).getTime()
            ? -1
            : 0
        )
    )
  );

  isPost(route: ScullyRoute) {
    return (
      route.route.startsWith('/blog/posts') &&
      !route.route.includes('angular-unfiltered')
    );
  }

  constructor(private routesService: ScullyRoutesService) {}
}

@NgModule({
  declarations: [PostsComponent],
  exports: [PostsComponent],
  imports: [CommonModule, MatListModule, RoutingModule],
})
export class PostsComponentModule {}
