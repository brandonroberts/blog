import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="bg-blue-600 dark:bg-blue-800 py-4 flex justify-center transition-colors duration-200">
        <div class="text-white">
          <a href="https://github.com/brandonroberts/blog" class="hover:underline">Source Code</a> - ©
          Copyright 2019-2025
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent { }
