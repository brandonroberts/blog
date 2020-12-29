import { Component } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport="true"
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        mode="over"
      >
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item linkTo="/" (click)="drawer.close()">Home</a>
          <a mat-list-item linkTo="/blog" (click)="drawer.close()">Posts</a>
          <a mat-list-item linkTo="/live" (click)="drawer.close()">Live Stream</a>
          <a mat-list-item linkTo="/about" (click)="drawer.close()"
            >About</a
          >
          <a mat-list-item linkTo="/talks" (click)="drawer.close()"
            >Talks</a
          >
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async"
          >
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>

          <a linkTo="/">Brandon Roberts</a>

          <div class="social">
            <a *ngIf="!(isHandset$ | async)" linkTo="/blog">Posts</a>

            <a *ngIf="!(isHandset$ | async)" linkTo="/live">Live Stream</a>

            <a *ngIf="!(isHandset$ | async)" linkTo="/talks">Talks</a>

            <a *ngIf="!(isHandset$ | async)" linkTo="/about">About</a>

            <a href="https://twitter.com/brandontroberts" title="Twitter">
              <img src="assets/images/logos/twitter-icon.svg" />
            </a>

            <a href="https://github.com/brandonroberts" title="GitHub">
              <img src="assets/images/logos/github-icon.svg" />
            </a>
          </div>
        </mat-toolbar>

        <div class="content" [class.container]="!(isHandset$ | async)">
          <router>
            <route path="/blog" [exact]="false" [load]="components.blog"></route>
            <route path="/live" [load]="components.live"></route>
            <route path="/:pageId">
              <app-page *routeComponent></app-page>
            </route>
            <route path="/" redirectTo="/blog"></route>
          </router>
        </div>

        <app-footer></app-footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100%;
      }

      .content {
        display: flex;
        justify-content: center;
        min-height: calc(100% - (63px));
      }

      .sidenav {
        width: 200px;
      }

      .sidenav .mat-toolbar {
        background: inherit;
      }

      .mat-toolbar.mat-primary {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .social {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: flex-end;
      }

      .social a {
        display: flex;
        align-items: center;
        margin-left: 16px;
      }

      .social a:hover {
        opacity: 0.8;
      }

      .social img {
        height: 24px;
      }

      @media screen and (max-width: 480px) {
        .social a {
          margin-left: 8px;
        }
      }
    `,
  ],
})
export class AppComponent {
  components = {
    blog: () => import('./blog/blog.module').then((m) => m.BlogModule),
    live: () => import('./live/live.component').then((m) => m.LiveComponent),
  }
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}
}
