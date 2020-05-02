import {
  Component,
  OnInit,
  Input,
  Type,
  ViewChild,
  ElementRef,
  Injector,
  ɵrenderComponent as renderComponent,
  ɵmarkDirty as markDirty,
  ɵcreateInjector as createInjector
} from "@angular/core";

import { Subject, BehaviorSubject, merge, of } from "rxjs";
import { tap, distinctUntilChanged, filter, takeUntil, mergeMap } from "rxjs/operators";

import { LoadComponent, Route } from "./route";
import { RouteParams, Params } from "./route-params.service";
import { RouterComponent } from "./router.component";


@Component({
  selector: "route",
  template: `
    <div #outlet></div>
  `
})
export class RouteComponent implements OnInit {
  private destroy$ = new Subject();
  @ViewChild("outlet", { read: ElementRef, static: true }) outlet: ElementRef;
  @Input() path: string;
  @Input() component: Type<any>;
  @Input() loadComponent: LoadComponent;
  route!: Route;
  rendered = null;
  private _routeParams$ = new BehaviorSubject<Params>({});
  routeParams$ = this._routeParams$.asObservable();

  constructor(private injector: Injector, private router: RouterComponent) {}

  ngOnInit(): void {
    // account for root level routes, don't add the basePath
    const path = this.router.parentRouterComponent
      ? this.router.basePath + this.path
      : this.path;

    this.route = this.router.registerRoute({
      path,
      component: this.component,
      loadComponent: this.loadComponent
    });

    const activeRoute$ = this.router.activeRoute$
      .pipe(
        filter(ar => ar !== null),
        distinctUntilChanged(),
        mergeMap(current => {
          if (current.route === this.route) {
            this._routeParams$.next(current.params);

            if (!this.rendered) {
              return this.loadAndRenderRoute(current.route);
            }
          } else if (this.rendered) {
            return of(this.clearView());
          }

          return of(null);
        })
      );

    const routeParams$ = this._routeParams$
      .pipe(
        distinctUntilChanged(),
        filter(() => !!this.rendered),
        tap(() => markDirty(this.rendered))
      );
    
    merge(activeRoute$, routeParams$).pipe(
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  loadAndRenderRoute(route: Route) {
    if (route.loadComponent) {
      return route.loadComponent().then(component => {
        return this.renderView(component, this.outlet.nativeElement);
      });
    } else {
      return of(this.renderView(route.component, this.outlet.nativeElement));
    }
  }

  renderView(component: Type<any>, host: any) {
    const cmpInjector = createInjector({}, this.injector, [
      { provide: RouteParams, useValue: this.routeParams$ }
    ]);

    this.rendered = renderComponent(component, {
      host,
      injector: cmpInjector
    });

    return this.rendered;
  }

  clearView() {
    this.outlet.nativeElement.innerHTML = "";
    this.rendered = null;

    return this.rendered;
  }
}
