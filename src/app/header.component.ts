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
