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

export const DISQUS_TOKEN = new InjectionToken<Disqus>('DISQUS', {
  providedIn: 'root',
  factory: () => {
    return (window as any).DISQUS;
  },
});

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  readonly containerId = 'comments_thread';

  constructor(
    @Inject(WINDOW_TOKEN) private window: WindowDisqus,
    @Inject(DISQUS_TOKEN) private disqus: Disqus
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

    this.disqus.reset({
      reload: true,
      config,
    });
  }

  private initialized() {
    return !!this.disqus;
  }

  private initializeComments(
    page: DisqusConfig,
    renderer: Renderer2,
    element: ElementRef
  ) {
    this.getConfig(page);

    const disqusScript = renderer.createElement('script');
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
    this.window.disqus_config = function () {
      this.page = page;
    };

    return this.window.disqus_config;
  }
}
