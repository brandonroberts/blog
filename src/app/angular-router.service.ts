import { Injectable } from '@angular/core';
import { Router as AngularRouter, NavigationEnd } from '@angular/router';
import { Router } from 'angular-routing';
import { Subject } from 'rxjs';

@Injectable()
export class NgRouter {
  private navigationId = 0;
  private _events = new Subject();
  events = this._events.asObservable();

  constructor(private router: Router) {}

  navigate(commands: string[]) {
    const url = commands.join('/');
    this.router.go(this.router.getExternalUrl(`${url}`));

    return Promise.resolve(true);
  }

  sendEvent(url: string) {
    this.navigationId++;

    this._events.next(new NavigationEnd(this.navigationId, url, url));
  }
}

export function provideAngularRouter() {
  return [
    { provide: AngularRouter, useClass: NgRouter }
  ];
}

export { AngularRouter };