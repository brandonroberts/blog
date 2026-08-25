import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import * as stylex from '@stylexjs/stylex';

import { ThemeService } from '../services/theme.service';
import { colors } from '../styles/tokens.stylex';
import { sx } from '../styles/sx';

const MD = '@media (min-width: 768px)';
const LG = '@media (min-width: 1024px)';

const styles = stylex.create({
  header: {
    backgroundColor: colors.headerBg,
    paddingBlock: '0.5rem',
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: {
      default: '0.5rem',
      [MD]: '1rem',
    },
    fontSize: {
      default: null,
      [LG]: '1.5rem',
    },
    lineHeight: {
      default: null,
      [LG]: '2rem',
    },
    color: colors.white,
  },
  navActive: {
    color: colors.navActive,
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: '9999px',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.headerHoverBg,
    },
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  toggleIcon: {
    width: '1.25rem',
    height: '1.25rem',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  profile: {
    display: {
      default: 'block',
      [MD]: 'flex',
    },
    justifyContent: 'center',
    paddingBlock: '2rem',
  },
  avatarWrap: {
    padding: '0.5rem',
    marginBlock: 'auto',
  },
  avatar: {
    borderRadius: '9999px',
    height: '12rem',
    width: '12rem',
    marginInline: 'auto',
    borderWidth: '8px',
    borderStyle: 'solid',
    borderColor: colors.avatarBorder,
  },
  info: {
    padding: '2rem',
    marginBlock: 'auto',
  },
  name: {
    color: colors.white,
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    textAlign: 'center',
  },
  tagline: {
    color: colors.white,
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    textAlign: 'center',
  },
  socialRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: '0.5rem',
    columnGap: '1rem',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
  },
  socialIcon: {
    width: '1.5rem',
    height: '1.5rem',
    objectFit: 'contain',
  },
});

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive],
    template: `
    <header [class]="cls.header">
      <div [class]="cls.nav">
        <div>
          <a
            routerLink="/blog"
            [routerLinkActive]="cls.navActive"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Blog Posts"
            >Posts</a
          >
        </div>
        <!-- <div>
          <a
            routerLink="/live"
            [routerLinkActive]="cls.navActive"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Live Streams"
            >Live Streams</a
          >
        </div> -->
        <!-- <div>
          <a
            routerLink="/talks"
            [routerLinkActive]="cls.navActive"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Talks"
            >Talks</a
          >
        </div> -->
        <div>
          <a
            routerLink="/about"
            [routerLinkActive]="cls.navActive"
            [routerLinkActiveOptions]="{ exact: false }"
            title="About Me"
            >About</a
          >
        </div>
        <div [class]="cls.flexCenter">
          <button
            (click)="themeService.toggleTheme()"
            [class]="cls.themeToggle"
            [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            [attr.title]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            @if (themeService.isDark()) {
              <!-- Sun icon for dark mode (click to switch to light) -->
              <svg xmlns="http://www.w3.org/2000/svg" [class]="cls.toggleIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            } @else {
              <!-- Moon icon for light mode (click to switch to dark) -->
              <svg xmlns="http://www.w3.org/2000/svg" [class]="cls.toggleIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            }
          </button>
        </div>
      </div>

      <div [class]="cls.profile">
        <div [class]="cls.avatarWrap">
          <img
            [class]="cls.avatar"
            src="assets/images/brandonroberts.jpg"
            alt="Brandon Roberts headshot rounded"
          />
        </div>
        <div [class]="cls.info">
          <h1 [class]="cls.name">Brandon Roberts</h1>
          <p [class]="cls.tagline">Notes to my future self</p>

          <div [class]="cls.socialRow">
            <a href="https://twitter.com/brandontroberts" title="Twitter" [class]="cls.socialLink">
              <img src="assets/images/logos/twitter-icon.svg" [class]="cls.socialIcon" alt="Twitter" />
            </a>
            <a href="https://github.com/brandonroberts" title="GitHub" [class]="cls.socialLink">
              <img src="assets/images/logos/github-icon.svg" [class]="cls.socialIcon" alt="GitHub" />
            </a>
            <a href="https://bsky.app/profile/brandonroberts.dev" title="Bluesky" [class]="cls.socialLink">
              <img src="assets/images/logos/bluesky-logo.png" [class]="cls.socialIcon" alt="Bluesky" />
            </a>
            <a href="https://youtube.com/brandonrobertsdev" title="YouTube" [class]="cls.socialLink">
              <img src="assets/images/logos/youtube-logo.png" [class]="cls.socialIcon" alt="YouTube" />
            </a>
            <a href="https://twitch.tv/brandontroberts" title="Twitch" [class]="cls.socialLink">
              <svg [class]="cls.socialIcon" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
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

  protected readonly cls = {
    header: sx(styles.header),
    nav: sx(styles.nav),
    navActive: sx(styles.navActive),
    flexCenter: sx(styles.flexCenter),
    themeToggle: sx(styles.themeToggle),
    toggleIcon: sx(styles.toggleIcon),
    profile: sx(styles.profile),
    avatarWrap: sx(styles.avatarWrap),
    avatar: sx(styles.avatar),
    info: sx(styles.info),
    name: sx(styles.name),
    tagline: sx(styles.tagline),
    socialRow: sx(styles.socialRow),
    socialLink: sx(styles.socialLink),
    socialIcon: sx(styles.socialIcon),
  };
}
