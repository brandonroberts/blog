import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterModule } from '@blog/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FooterComponentModule } from '../../../shared/footer/footer.component';

import { PageComponentModule } from '../page/page.component';
import { RedirectComponent } from '../redirect/redirect.component';
import { PageNotFoundComponentModule } from '../page-not-found/page-not-found.component';

@Component({
  selector: 'app-layout',
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
          <a
            mat-list-item
            linkTo="/about"
            [queryParams]="{ test: 123 }"
            (click)="drawer.close()"
            >About</a
          >
          <a mat-list-item linkTo="/talks" (click)="drawer.close()">Talks</a>
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
            <a *ngIf="!(isHandset$ | async)" linkTo="/talks">Talks</a>

            <a
              *ngIf="!(isHandset$ | async)"
              linkTo="/about"
              [queryParams]="{ test: 123 }"
              fragment="bottom"
              >About</a
            >

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
            <route path="/blog/**" [loadComponent]="components.blog">
            </route>
            <route path="/404">
              <app-page-not-found *routeComponent></app-page-not-found>
            </route>
            <route path="/:pageId">
              <app-page *routeComponent></app-page>
            </route>
            <route path="/" redirectTo="/blog"></route>
            <route path="**">
              <app-page-not-found *routeComponent></app-page-not-found>
            </route>
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
export class LayoutComponent {
  components = {
    blog: () => import('../../../blog/blog/blog.component').then(m => m.BlogComponent)
  };

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}
}

@NgModule({
  declarations: [LayoutComponent, RedirectComponent],
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    PageComponentModule,
    PageNotFoundComponentModule,
    FooterComponentModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutComponentModule {}
