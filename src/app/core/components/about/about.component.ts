import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <h2>About Me</h2>

    <div class="pic">
      <img src="/assets/images/brandonroberts.jpg" width="300" height="300"/>
    </div>

    <p class="bio">
      I am an Angular Team member working on guides, tutorials, application development, 
      and infrastructure for the Angular docs. I enjoys learning new things, helping other 
      developers solve problems, and contributing to open source. I am also a maintainer of the 
      NgRx project, building reactive libraries for Angular.
    </p>

  `,
  styles: [
    `
    :host {
      width: 80%;
    }
    
    .pic {
      display: flex;
      justify-content: space-around;
    }
    `
  ]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
