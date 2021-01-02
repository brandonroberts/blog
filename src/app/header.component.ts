import { Component, NgModule } from '@angular/core';
import { RoutingModule } from 'angular-routing';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-blue-600 py-2">
      <div
        class="flex justify-center content-between space-x-2 md:space-x-4 lg:space-x-4 lg:text-2xl text-white"
      >
        <div>
          <a
            linkTo="/blog"
            linkActive="text-blue-200"
            [activeOptions]="{ exact: false }"
            title="Blog Posts"
            >Posts</a
          >
        </div>
        <div>
          <a
            linkTo="/live"
            linkActive="text-blue-200"
            [activeOptions]="{ exact: false }"
            title="Blog Posts"
            >Live Stream</a
          >
        </div>
        <div>
          <a
            linkTo="/talks"
            linkActive="text-blue-200"
            [activeOptions]="{ exact: false }"
            title="Blog Posts"
            >Talks</a
          >
        </div>
        <div>
          <a
            linkTo="/about"
            linkActive="text-blue-200"
            [activeOptions]="{ exact: false }"
            title="Blog Posts"
            >About</a
          >
        </div>
      </div>

      <div class="md:flex justify-center py-8">
        <div class="p-2 my-auto">
          <img
            class="rounded-full h-48 w-48 mx-auto border-8 border-blue-400"
            src="assets/images/brandonroberts.jpg"
          />
        </div>
        <div class="p-8 my-auto">
          <h1 class="text-white text-3xl text-center">Brandon Roberts</h1>
          <p class=" text-white text-xl text-center">Notes to my future self</p>

          <div class="flex justify-center space-around py-2 space-x-4">
            <div class="w-8">
              <a href="https://twitter.com/brandontroberts" title="Twitter">
                <img src="assets/images/logos/twitter-icon.svg" />
              </a>
            </div>
            <div class="w-8">
              <a href="https://github.com/brandonroberts" title="GitHub">
                <img src="assets/images/logos/github-icon.svg" />
              </a>
            </div>
            <div class="w-8">
              <a href="https://twitch.tv/brandontroberts" title="Twitch">
                <svg width="43" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <g id="icon-twitch">
                      <path d="M8.927 0L0 8.929V41.07h10.712V50l8.927-8.929h7.14L42.849 25V0H8.927zm30.35 23.214l-7.141 7.143h-7.142l-6.248 6.25v-6.25h-8.034V3.571h28.565v19.643z"></path>
                      <path d="M24.131 9.826h-3.61v10.695h3.61V9.826zM33.957 9.826h-3.61v10.695h3.61V9.826z"></path>
                    </g>
                  </defs>
                  <use class="off" href="#icon-twitch" fill="#ffffff" opacity="0" data-svg-origin="21.5 25" transform="matrix(0.75,0,0,0.75,5.375,6.25)" style="transform-origin: 0px 0px; opacity: 1;"></use>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}

@NgModule({
  declarations: [HeaderComponent],
  imports: [RoutingModule],
  exports: [HeaderComponent],
})
export class HeaderComponentModule {}
