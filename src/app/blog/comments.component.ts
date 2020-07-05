import {
  Component,
  NgModule,
  Renderer2,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-post-comments',
  template: ` <div id="commento"></div> `,
  styles: [''],
})
export class PostCommentsComponent implements OnInit {  
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    const commentoScript = this.renderer.createElement('script');
    commentoScript.id = 'commento-script';
    commentoScript.src = `https://cdn.commento.io/js/commento.js`;
    commentoScript.type = 'text/javascript';

    this.renderer.appendChild(document.body, commentoScript);
  }

  ngOnDestroy() {
    const cs = document.getElementById('commento-script');
    this.renderer.removeChild(document.body, cs);
  }
}

@NgModule({
  declarations: [PostCommentsComponent],
  exports: [PostCommentsComponent],
})
export class PostCommentsComponentModule {}
