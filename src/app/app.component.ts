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
          <a mat-list-item routerLink="/" (click)="drawer.close()">Home</a>
          <a mat-list-item routerLink="/about" (click)="drawer.close()"
            >About</a
          >
          <a mat-list-item routerLink="/talks" (click)="drawer.close()"
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

          <a routerLink="/">Brandon Roberts</a>

          <div class="social">
            <a *ngIf="!(isHandset$ | async)" routerLink="/talks">Talks</a>

            <a *ngIf="!(isHandset$ | async)" routerLink="/about">About</a>

            <a href="https://twitter.com/brandontroberts" title="Twitter">
              <img src="assets/images/logos/twitter-icon.svg" />
            </a>

            <a href="https://github.com/brandonroberts" title="GitHub">
              <img src="assets/images/logos/github-icon.svg" />
            </a>

            <iframe
              src="https://github.com/sponsors/brandonroberts/button"
              title="Sponsor brandonroberts"
              height="35"
              width="107"
              style="border: 0;margin-left: 16px;"
            ></iframe>
          </div>
        </mat-toolbar>

        <div class="content" [class.container]="!(isHandset$ | async)">
          <router-outlet></router-outlet>
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
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}
}
