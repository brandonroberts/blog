import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ThemeService } from '../services/theme.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive],
    template: `
    <header class="bg-blue-600 dark:bg-blue-800 py-2 transition-colors duration-200">
      <div
        class="flex justify-center items-center content-between space-x-2 md:space-x-4 lg:space-x-4 lg:text-2xl text-white"
      >
        <div>
          <a
            routerLink="/blog"
            routerLinkActive="text-blue-200 dark:text-blue-300"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Blog Posts"
            >Posts</a
          >
        </div>
        <!-- <div>
          <a
            routerLink="/live"
            routerLinkActive="text-blue-200 dark:text-blue-300"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Live Streams"
            >Live Streams</a
          >
        </div> -->
        <!-- <div>
          <a
            routerLink="/talks"
            routerLinkActive="text-blue-200 dark:text-blue-300"
            [routerLinkActiveOptions]="{ exact: false }"
            title="Talks"
            >Talks</a
          >
        </div> -->
        <div>
          <a
            routerLink="/about"
            routerLinkActive="text-blue-200 dark:text-blue-300"
            [routerLinkActiveOptions]="{ exact: false }"
            title="About Me"
            >About</a
          >
        </div>
        <div class="flex items-center">
          <button
            (click)="themeService.toggleTheme()"
            class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-500 dark:hover:bg-blue-700 transition-colors duration-200"
            [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            [attr.title]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            @if (themeService.isDark()) {
              <!-- Sun icon for dark mode (click to switch to light) -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            } @else {
              <!-- Moon icon for light mode (click to switch to dark) -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            }
          </button>
        </div>
      </div>

      <div class="md:flex justify-center py-8">
        <div class="p-2 my-auto">
          <img
            class="rounded-full h-48 w-48 mx-auto border-8 border-blue-400 dark:border-blue-500"
            src="assets/images/brandonroberts.jpg"
            alt="Brandon Roberts headshot rounded"
          />
        </div>
        <div class="p-8 my-auto">
          <h1 class="text-white text-3xl text-center">Brandon Roberts</h1>
          <p class="text-white text-xl text-center">Notes to my future self</p>

          <div class="flex justify-center items-center py-2 space-x-4">
            <a href="https://twitter.com/brandontroberts" title="Twitter" class="flex items-center justify-center w-8 h-8">
              <img src="assets/images/logos/twitter-icon.svg" class="w-6 h-6 object-contain" alt="Twitter" />
            </a>
            <a href="https://github.com/brandonroberts" title="GitHub" class="flex items-center justify-center w-8 h-8">
              <img src="assets/images/logos/github-icon.svg" class="w-6 h-6 object-contain" alt="GitHub" />
            </a>
            <a href="https://bsky.app/profile/brandonroberts.dev" title="Bluesky" class="flex items-center justify-center w-8 h-8">
              <img src="assets/images/logos/bluesky-logo.png" class="w-6 h-6 object-contain" alt="Bluesky" />
            </a>
            <a href="https://youtube.com/brandonrobertsdev" title="YouTube" class="flex items-center justify-center w-8 h-8">
              <img src="assets/images/logos/youtube-logo.png" class="w-6 h-6 object-contain" alt="YouTube" />
            </a>
            <a href="https://twitch.tv/brandontroberts" title="Twitch" class="flex items-center justify-center w-8 h-8">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
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
}
