import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ThemeService } from '../services/theme.service';
import * as css from './header.styles';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive],
    template: `
    <header [class]="css.root">
      <div [class]="css.nav">
        <div>
          <a
            routerLink="/blog"
            [routerLinkActive]="css.navActive"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Blog Posts"
            >Posts</a
          >
        </div>
        <!-- <div>
          <a
            routerLink="/live"
            [routerLinkActive]="css.navActive"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Live Streams"
            >Live Streams</a
          >
        </div> -->
        <!-- <div>
          <a
            routerLink="/talks"
            [routerLinkActive]="css.navActive"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Talks"
            >Talks</a
          >
        </div> -->
        <div>
          <a
            routerLink="/about"
            [routerLinkActive]="css.navActive"
            [routerLinkActiveOptions]="{ exact: false }"
            title="About Me"
            >About</a
          >
        </div>
        <div [class]="css.flexCenter">
          <button
            (click)="themeService.toggleTheme()"
            [class]="css.themeToggle"
            [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            [attr.title]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            @if (themeService.isDark()) {
              <!-- Sun icon for dark mode (click to switch to light) -->
              <svg xmlns="http://www.w3.org/2000/svg" [class]="css.toggleIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            } @else {
              <!-- Moon icon for light mode (click to switch to dark) -->
              <svg xmlns="http://www.w3.org/2000/svg" [class]="css.toggleIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            }
          </button>
        </div>
      </div>

      <div [class]="css.profile">
        <div [class]="css.avatarWrap">
          <img
            [class]="css.avatar"
            src="assets/images/brandonroberts.jpg"
            alt="Brandon Roberts headshot rounded"
          />
        </div>
        <div [class]="css.info">
          <h1 [class]="css.name">Brandon Roberts</h1>
          <p [class]="css.tagline">Notes to my future self</p>

          <div [class]="css.socialRow">
            <a href="https://twitter.com/brandontroberts" title="Twitter" [class]="css.socialLink">
              <img src="assets/images/logos/twitter-icon.svg" [class]="css.socialIcon" alt="Twitter" />
            </a>
            <a href="https://github.com/brandonroberts" title="GitHub" [class]="css.socialLink">
              <img src="assets/images/logos/github-icon.svg" [class]="css.socialIcon" alt="GitHub" />
            </a>
            <a href="https://bsky.app/profile/brandonroberts.dev" title="Bluesky" [class]="css.socialLink">
              <img src="assets/images/logos/bluesky-logo.png" [class]="css.socialIcon" alt="Bluesky" />
            </a>
            <a href="https://youtube.com/brandonrobertsdev" title="YouTube" [class]="css.socialLink">
              <img src="assets/images/logos/youtube-logo.png" [class]="css.socialIcon" alt="YouTube" />
            </a>
            <a href="https://twitch.tv/brandontroberts" title="Twitch" [class]="css.socialLink">
              <svg [class]="css.socialIcon" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.571 4.714h1.715v5.143H11.57V4.714zm4.715 0H18v5.143h-1.714V4.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0H6zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714v9.429z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  protected readonly css = css;
}
