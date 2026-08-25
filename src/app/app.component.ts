import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as stylex from '@stylexjs/stylex';

import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { sx } from './styles/sx';

const styles = stylex.create({
  main: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '1rem',
  },
});

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    template: `
    <app-header></app-header>

    <main [class]="cls.main">
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `
})
export class AppComponent {
  protected readonly cls = {
    main: sx(styles.main),
  };
}
