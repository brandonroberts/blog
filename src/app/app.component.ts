import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import * as css from './app.css';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    template: `
    <app-header></app-header>

    <main [class]="css.main">
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `
})
export class AppComponent {
  protected readonly css = css;
}
