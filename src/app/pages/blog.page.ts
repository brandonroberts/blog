import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'blog',
    imports: [RouterOutlet],
    template: ` <router-outlet></router-outlet> `
})
export default class BlogComponent {}
