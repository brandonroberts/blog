import { Component } from '@angular/core';

import * as css from './footer.css';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div [class]="css.bar">
        <div [class]="css.text">
          <a href="https://github.com/brandonroberts/blog" [class]="css.link">Source Code</a> - ©
          Copyright 2019-{{ currentYear }}
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  protected readonly css = css;
}
