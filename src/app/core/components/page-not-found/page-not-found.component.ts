import { Component, OnInit, NgModule } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <h2>Whoops...</h2>
    <hr />

    Page Not Found
  `,
  styles: [
    `
      :host {
        width: 80%;
      }
    `,
  ],
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@NgModule({
  declarations: [PageNotFoundComponent],
  exports: [PageNotFoundComponent],
})
export class PageNotFoundComponentModule {}
