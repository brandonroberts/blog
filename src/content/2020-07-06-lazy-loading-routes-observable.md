---
title: 'Lazy Loading Routes using an Observable with the Angular Router'
description: 'Describes how to use an Observable when lazy loading routes with the Angular Router'
published: true
slug: 2020-07-06-lazy-loading-routes-observable
publishedDate: '2020-07-06 02:00 PM CST'
layout: ../../../layouts/BlogPostLayout.astro
---

<br/>

<a href="https://unsplash.com/@kevin_butz?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" title="Photo by Kevin Butz on Unsplash">
  <img src="/assets/posts/kevin-butz-4xZTX1CZBVE-unsplash.jpg" width="100%"/>
</a>

As I'm prone to do sometimes, I go digging through the Angular Router source code to see how it works. What I didn't expect to find was a different way to lazy load routes. A typical routing setup with lazy loading looks like this:

<!-- embedme apps/observable-load-children/src/app/app-routing.module.1.ts -->

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then((m) => m.LazyModule),
  },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
```

The snippet above uses the `loadChildren` property in the `Route` object to lazy load the route using a Promise. This API is defined as the [LoadChildrenCallback](https://angular.io/api/router/LoadChildrenCallback) as part of the public API of the Angular Router. Looking at the signature for the type, it has many different ways to load a module.

```ts
type LoadChildrenCallback = () =>
  | Type<any>
  | NgModuleFactory<any>
  | Observable<Type<any>>
  | Promise<NgModuleFactory<any> | Type<any> | any>;
```

All previous examples of lazy loading routes just use a callback than returns a Promise. To my surprise, you can also return an observable to handle lazy loading of routes. To make sure this wasn't something new, I went back through the commits, and I had to go back **4 years** to find the [commit](https://github.com/angular/angular/commit/6b26102931c722e4ddc0038059c1c851427f6374) that introduced this option. This seamlessly works in either scenario because the router will [wrap a Promise](https://github.com/angular/angular/blob/master/packages/router/src/router_config_loader.ts#L52) in an observable if its not one already.

Below is a snippet of the utility function:

```ts
export function wrapIntoObservable<T>(
  value: T | Promise<T> | Observable<T>
): Observable<T> {
  if (isObservable(value)) {
    return value;
  }

  if (isPromise(value)) {
    // Use `Promise.resolve()` to wrap promise-like instances.
    return from(Promise.resolve(value));
  }

  return of(value);
}
```

Knowing that information, instead of providing a callback that returns a Promise, a callback that returns an observable works also. This opens up much more flexiblity when handling lazy loading. Let's look at some examples.

<!-- embedme apps/observable-load-children/src/app/app-routing.module.2.ts -->

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () =>
      new Observable((observer) => {
        import('./lazy/lazy.module').then(
          (m) => {
            observer.next(m.LazyModule);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      }),
  },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
```

This example creates a new Observable, wraps the promise returned by the dynamic import, pushes a value and completes if the promise resolves, or pushes an error if the request fails.

Another example would be to use the `from` operator.

<!-- embedme apps/observable-load-children/src/app/app-routing.module.3.ts -->

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () =>
      from(import('./lazy/lazy.module')).pipe(map((m) => m.LazyModule)),
  },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
```

The example above of a new observable that wraps the promise is a basic equivalent of the `from` operator in the RxJS library. The `from` observable creation operator creates an observable that came from a promise. Combined with the `map` operator, the same result is achieved.

What about logging? The `tap` operator is useful for debugging.

<!-- embedme apps/observable-load-children/src/app/app-routing.module.4.ts -->

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () =>
      from(import('./lazy/lazy.module')).pipe(
        map((m) => m.LazyModule),
        tap(
          () => {
            console.log('Lazy Module Loaded');
          },
          () => {
            console.log('Lazy Module Load Failed');
          }
        )
      ),
  },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
```

With access to the `Observable` primitive, and its set of operators, with some slight modification, retrying a failed request is pretty straightforward also.

<!-- embedme apps/observable-load-children/src/app/app-routing.module.ts -->

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { defer } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () =>
      defer(() => import('./lazy/lazy.module')).pipe(
        map((m) => m.LazyModule),
        retry(2)
      ),
  },
  { path: '', redirectTo: 'lazy', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
```

The `defer` operator returns a new observable using a factory function each time its subscribed to. Compared to the `from` example above, adding the `retry(2)` to the observable wouldn't behave the way you'd expect. Because promises only resolve once, in order to retry the promise in case of a failure, a new promise needs to be returned each time we make the request.

Should you start using observables to lazy load your routes instead? Maybe not, but having the option to use an observable with the Angular Router to lazy load routes opens up a new set of possibilities that have been hiding in plain sight all along.

Follow me on [Twitter](https://twitter.com/brandontroberts), [YouTube](https://youtube.com/brandonrobertsdev), [Twitch](https://twitch.tv/brandontroberts), and consider [sponsoring me on GitHub](https://github.com/sponsors/brandonroberts).
