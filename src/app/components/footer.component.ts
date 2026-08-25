import { Component } from '@angular/core';
import * as stylex from '@stylexjs/stylex';

import { colors } from '../styles/tokens.stylex';
import { sx } from '../styles/sx';

const styles = stylex.create({
  bar: {
    backgroundColor: colors.headerBg,
    paddingBlock: '1rem',
    display: 'flex',
    justifyContent: 'center',
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  text: {
    color: colors.white,
  },
  link: {
    textDecoration: {
      default: 'none',
      ':hover': 'underline',
    },
  },
});

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div [class]="cls.bar">
        <div [class]="cls.text">
          <a href="https://github.com/brandonroberts/blog" [class]="cls.link">Source Code</a> - ©
          Copyright 2019-{{ currentYear }}
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  protected readonly cls = {
    bar: sx(styles.bar),
    text: sx(styles.text),
    link: sx(styles.link),
  };
}
