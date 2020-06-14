import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterModule } from '@blog/router';

@Component({
  selector: 'app-footer',
  template: `
    <mat-toolbar color="primary">
      <div class="links">
        © Copyright 2019-2020
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      :host {
        width: 100%;
        justify-content: space-around;
        color: #eee;
      }

      a {
        color: #eee;
      }

      a:after {
        content: ' ';
      }

      .links {
        display: block;
        text-align: center;
        width: 100%;
      }
    `,
  ],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, MatToolbarModule, RouterModule],
  exports: [FooterComponent],
})
export class FooterComponentModule {}
