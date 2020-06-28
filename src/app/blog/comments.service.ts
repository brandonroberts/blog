import {
  Injectable,
  InjectionToken,
  Inject,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { environment } from 'src/environments/environment';

export interface DisqusConfig {
  url: string;
  identifier: string;
  title: string;
}

export interface Disqus {
  reset: (config: object) => void;
}

export type WindowDisqus = Window & {
  DISQUS: Disqus;
  disqus_config: () => void;
  disqus_container_id: string;
};

export const WINDOW_TOKEN = new InjectionToken<WindowDisqus>('Window', {
  providedIn: 'root',
  factory: () => {
    return window as any;
  },
});

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  readonly containerId = 'comments_thread';
  private readonly scriptId = 'disqus-src';

  constructor(
    @Inject(WINDOW_TOKEN) private window: WindowDisqus
  ) {}

  initialize(
    page: { url: string; title: string },
    renderer: Renderer2,
    element: ElementRef
  ) {
    this.window.disqus_container_id = this.containerId;

    const config: DisqusConfig = {
      url: environment.disqusConfig.url,
      identifier: page.url,
      title: page.title,
    };

    if (!this.initialized()) {
      this.initializeComments(config, renderer, element);
    } else {
      this.reset(config);
    }
  }

  reset(page: DisqusConfig) {
    const config = this.getConfig(page);

    this.window.DISQUS.reset({
      reload: true,
      config,
    });
  }

  /**
   * Cleans up the Disqus script and comments,
   * so switching between posts loads the correct comments.
   * Code adapted from disqus-react:
   * 
   * https://github.com/disqus/disqus-react/blob/master/src/DiscussionEmbed.jsx#L53
   * 
   * @param el ElementRef that contains the Disqus comments
   */
  cleanupComments(el: ElementRef) {
    const disqusScript = document.getElementById(this.scriptId);

    el.nativeElement.removeChild(disqusScript);
    this.window.DISQUS.reset({});

    try {
      delete this.window.DISQUS;
    } catch (error) {
      this.window.DISQUS = undefined;
    }

    const thread = document.getElementById(this.containerId);

    while(thread.hasChildNodes()) {
      thread.removeChild(thread.firstChild);
    }
  }

  private initialized() {
    return !!this.window.DISQUS;
  }

  private initializeComments(
    page: DisqusConfig,
    renderer: Renderer2,
    element: ElementRef
  ) {
    this.window.disqus_config = this.getConfig(page);

    const disqusScript = renderer.createElement('script');
    disqusScript.id = this.scriptId;
    disqusScript.src = `//${environment.disqusConfig.shortname}.disqus.com/embed.js`;
    disqusScript.async = true;
    disqusScript.type = 'text/javascript';

    renderer.setAttribute(
      disqusScript,
      'data-timestamp',
      new Date().getTime().toString()
    );
    renderer.appendChild(element.nativeElement, disqusScript);
  }

  private getConfig(page: DisqusConfig) {
    return function () {
      this.page = page;
    };
  }
}
