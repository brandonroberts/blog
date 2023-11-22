import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-my-lib',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      my-lib works!
    </p>
  `,
  styles: ``
})
export class MyLibComponent {

}
