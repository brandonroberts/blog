import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';


import { RouterModule } from '@blog/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FooterComponentModule } from 'src/app/shared/footer/footer.component';

import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { PageComponent } from '../page/page.component';
import { RedirectComponent } from '../redirect/redirect.component';

@Component({
  selector: 'app-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport="true"
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          mode='over'>
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item linkTo="/" (click)="drawer.close()">Home</a>
          <a mat-list-item linkTo="/about" (click)="drawer.close()">About</a>
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
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          
          <a linkTo="/">Brandon Roberts</a>

          <div class="social">

            <a *ngIf="!(isHandset$ | async)" linkTo="/talks">Talks</a>

            <a *ngIf="!(isHandset$ | async)" linkTo="/about">About</a>

            <a href="https://twitter.com/brandontroberts" title="Twitter">
              <img src="assets/images/logos/twitter-icon.svg">
            </a>
            
            <a href="https://github.com/brandonroberts" title="GitHub">
              <img src="assets/images/logos/github-icon.svg">
            </a>
          </div>         
        </mat-toolbar>

        <div class="content" [class.container]="!(isHandset$ | async)">
          <router>
            <route 
              *ngFor="let route of routes"
              [path]="route.path"
              [component]="route.component"
              [loadComponent]="route.loadComponent">
            </route>
          </router>
        </div>
        
        <app-footer>
        </app-footer>

      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
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
  `]
})
export class LayoutComponent {
  routes = [
    { path: '/blog(.*)', loadComponent: () => import('src/app/blog/blog/blog.component').then(m => m.BlogComponent) },
    { path: '/404', component: PageNotFoundComponent },
    { path: '/talks', component: PageComponent },
    { path: '/about', component: PageComponent },
    { path: '/', component: RedirectComponent },
    { path: '/(.*)', component: PageNotFoundComponent }
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) {}
}

@NgModule({
  declarations: [
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FooterComponentModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutComponentModule { }
