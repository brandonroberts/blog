import {
  Component,
  OnInit,
  Input,
  Type,
  Injector,
  ɵrenderComponent as renderComponent,
  ɵmarkDirty as markDirty,
  ɵcreateInjector as createInjector,
  ViewContainerRef,
  ComponentFactoryResolver,
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  AfterContentInit
} from "@angular/core";

import { Subject, BehaviorSubject, merge, of } from "rxjs";
import { tap, distinctUntilChanged, filter, takeUntil, mergeMap, withLatestFrom } from "rxjs/operators";

import { LoadComponent, Route } from "./route";
import { RouteParams, Params } from "./route-params.service";
import { RouterComponent } from "./router.component";
import { Router } from './router.service';


@Component({
  selector: "route",
  template: `
    <ng-container *ngIf="(shouldRender$ | async) && template">
      <ng-container [ngTemplateOutlet]="template"></ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteComponent implements OnInit {
  @ContentChild(TemplateRef) template: TemplateRef<any> | null;
  @Input() path: string;
  @Input() component: Type<any>;
  @Input() loadComponent: LoadComponent;
  @Input() reuse = true;
  @Input() redirectTo!: string;
  // rendered = null;
  private destroy$ = new Subject();
  private _routeParams$ = new BehaviorSubject<Params>({});

  protected _shouldRender$ = new BehaviorSubject<boolean>(false);
  readonly shouldRender$ = this._shouldRender$.asObservable();

  routeParams$ = this._routeParams$.asObservable();
  route!: Route;

  constructor(
    // private injector: Injector,
    private router: Router,
    private routerComponent: RouterComponent,
  ) {}

  ngOnInit(): void {
    // account for root level routes, don't add the basePath
    const path = this.routerComponent.parentRouterComponent
      ? this.routerComponent.parentRouterComponent.basePath + this.path
      : this.path;

    this.route = this.routerComponent.registerRoute({
      path,
      component: this.component,
      loadComponent: this.loadComponent
    });

    const activeRoute$ = this.routerComponent.activeRoute$
      .pipe(
        filter(ar => ar !== null),
        distinctUntilChanged(),
        withLatestFrom(this.shouldRender$),
        mergeMap(([current, rendered]) => {
          if (current.route === this.route) {           
            this._routeParams$.next(current.params);
            
            if (this.redirectTo) {
              this.router.go(this.redirectTo);
              return of(null);
            }

            if (!rendered) {
              if (!this.reuse) {
                this.clearView();
              }

              return this.loadAndRenderRoute(current.route);
            }
          } else if (rendered) {
            return of(this.clearView());
          }

          return of(null);
        })
      );

    // const routeParams$ = this._routeParams$
    //   .pipe(
    //     distinctUntilChanged(),
    //     filter(() => !!this.rendered),
        // tap(() => markDirty(this.rendered))
      // );
    
    merge(activeRoute$).pipe(
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private loadAndRenderRoute(route: Route) {
    if (route.loadComponent) {
      return route.loadComponent().then(component => {
        return this.renderView(component);
      });
    } else {
      return of(this.renderView(route.component));
    }
  }

  private renderView(component: Type<any>) {
    // const cmpInjector = createInjector({}, this.injector, [
    //   { provide: RouteParams, useValue: this.routeParams$ }
    // ]);
    setTimeout(() => {
      this._shouldRender$.next(true);
    });
  }

  private clearView() {
    this._shouldRender$.next(false);
  }
}
