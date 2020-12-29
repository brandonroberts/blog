import { Directive, NgModule, OnDestroy, OnInit } from "@angular/core";
import { RoutePath } from 'angular-routing';
import { Subject } from 'rxjs';
import { tap, takeUntil, filter } from 'rxjs/operators';

import { AngularRouter } from '../angular-router.service';

@Directive({
  selector: '[navigationEnd]'
})
export class NavigationEndDirective implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  constructor(
    private routePath$: RoutePath,
    private router: AngularRouter
  ) {}

  ngOnInit() {
    this.routePath$.pipe(
      filter(_url => !!_url),
      tap(url => this.router['sendEvent'](url)),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}

@NgModule({
  declarations: [NavigationEndDirective],
  exports: [NavigationEndDirective]
})
export class NavigationEndDirectiveModule {}