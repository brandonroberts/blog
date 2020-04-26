import { Component, OnInit } from '@angular/core';

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
    `
  ]
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
