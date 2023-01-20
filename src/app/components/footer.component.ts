import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <div class="bg-blue-600 py-4 flex justify-center">
        <div class="text-white">
          <a href="https://github.com/brandonroberts/blog">Source Code</a> - © Copyright 2019-2023
          | <a rel="me" href="https://mastodon.social/@brandontroberts">Mastodon</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
