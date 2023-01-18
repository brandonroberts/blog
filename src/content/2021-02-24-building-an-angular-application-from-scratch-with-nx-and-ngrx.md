---
title: 'Building an Angular application from scratch with Nx and NgRx'
description: 'Running a few commands can get you started quickly when building features with NgRx and Nx'
published: true
slug: 2021-02-24-building-an-angular-application-from-scratch-with-nx-and-ngrx
publishedDate: '2021-02-24 02:00 PM CST'
layout: ../../../layouts/BlogPostLayout.astro
---

<br/>

<a href="https://unsplash.com/s/photos/first-step?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" title="Jyoti Singh on Unsplash">
  <img src="/assets/posts/singh-unsplash.jpg" width="100%" height/>
</a>

Structure and patterns go a long way when building scalable applications. [Nx](https://nx.dev) is a set of build tools that help you manage and maintain a monorepo, structure your codebase to contain many reusable libraries, and scale across many different applications. [NgRx](https://ngrx.io) is a framework of libraries to help you structure and build features in your application using a consistent pattern for state management. Using these two things together helps accelerate your development, but there are some steps you should follow to maximize the benefits they provide. This post walks through building a Seinfeld quotes generator in Angular using an Nx workspace and NgRx.

## Creating the workspace

Start with creating the Nx workspace with an Angular application.

```shell
npx create-nx-workspace@latest seinfeld --appName=quotes --preset=angular --style=css --routing
```

- Choose ESLint for linting files in your workspace.
- Optionally choose to connect your workspace to Nx Cloud.

This command generates a new workspace, and scaffolds out a new Angular application with modern tooling, including Jest for unit tests, and Cypress for E2E tests.

## Setting up NgRx Store, Effects, and Devtools

To get started with NgRx, the best place is to always start with the schematics, as they handle all the initial setup for the NgRx packages.

```shell
nx g ngrx app --root --no-interactive --project quotes --module apps/quotes-app/src/app/app.module.ts
```

This command does two things:

- Installs all the NgRx packages.
- Takes care of the initial setup for NgRx Store, Effects, and Store Devtools in the application AppModule.

Managing a feature with NgRx does involve using actions, reducers, selectors, and effects. Each one of these things has a specific purpose in state management.

- The Store is a singleton service that contains all of the shared feature states, managed by reducers. There is only one global `Store` with multiple feature states contained within that store.
- Actions represent unique events.
- Reducers handle state changes based on actions.
- Selectors provide real-time access to read state.
- Effects are listeners of observable streams that isolate side effects from components and handle tasks such as the business logic of data fetching.

Read more about these concepts in the [NgRx docs](https://ngrx.io/guide/store).

Serve up the application:

```shell
ng serve
```

The initial application component is displayed. The completed feature lists a set of Seinfeld quotes, including author, season, and episode.

Next up is generating libraries.

## Generating libraries

Generating libraries in an Nx workspace is done by using the generate command along with the Angular CLI. For the quotes feature, generate two libraries residing under a `quotes` folder. It's good to keep your folder structure relatively flat, but at least one level deep is good for flexibility.

Generate a library for setting up data access for quotes:

```shell
nx g lib quotes/data-access
```

A "data access" library is where functionality for fetching and storing data for a feature exists. So any services necessary to manage the quotes are placed in this library. Over the course of building applications, there will be data access libraries across multiple features.

Generate a library for the quotes page feature:

```shell
nx g lib quotes/page
```

Generate a service for fetching Seinfeld quotes:

```shell
nx g service quotes --project quotes-data-access
```

This generates the service inside of the data access library. 

## Setting up the feature

For the quotes feature page, a component is used to list the quotes.

Generate a component for the quotes page feature.

```shell
nx g component quotes-page --project quotes-page
```

With the feature page created, define a route in the `quotes-page.module.ts` with an empty path route. This module is lazy-loaded from the AppModule routes.

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { QuotesPageComponent } from './quotes-page/quotes-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: QuotesPageComponent } 
    ])
  ],
  declarations: [QuotesPageComponent],
})
export class QuotesPageModule {}
```

Update the `AppModule` in the quotes app to load this feature using the Angular Router. Also add the `HttpClientModule` to the `AppModule` imports array.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'quotes' },
      { path: 'quotes', loadChildren: () => import('@seinfeld/quotes/page').then(m => m.QuotesPageModule) }
    ]),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Update the app.component.html, and replace the contents of the `main` tag with the `<router-outlet></router-outlet>` directive.

```html
<main>

  <router-outlet></router-outlet>

</main>
```

Reloading the app in the browser displays `quotes page works!`.

## Setting up the NgRx feature state

As I mentioned before, schematics handle a lot of the wiring up of state for you. Generating state for the quotes feature can be done quickly using the `ngrx` schematic.

```shell
nx g ngrx quotes --project quotes-data-access --no-interactive --module libs/quotes/data-access/src/lib/quotes-data-access.module.ts --barrels
```

This schematic generates: 

- A `QuotesEntity` model representing a single quote.
- Quotes Page/API actions
- A reducer to handle the collection of quotes
- The selectors to "query" or read from the quote state
- Side effects to isolate interactions with external APIs
- Barrel exports in the `index.ts` file for consumption in other features.

The feature state and side effects are also added to the `QuotesDataAccessModule`

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromQuotes from './+state/quotes.reducer';
import { QuotesEffects } from './+state/quotes.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromQuotes.QUOTES_FEATURE_KEY, fromQuotes.reducer),
    EffectsModule.forFeature([QuotesEffects]),
  ],
})
export class QuotesDataAccessModule {}
```

The entire feature state is set up and ready to tweak for added functionality.

<div class="flex justify-center">

![Seinfeld - Kramer Mind Blown](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lmh5u289uvcctif9tsfb.gif)

</div>

When this feature is loaded, the `quotes` state is added to the global state, and the `QuotesEffects` start listening for dispatched actions to perform tasks.

**NgRx Tip**: To generate an empty feature state, use the feature schematic from the `@ngrx/schematics` package.

```shell
nx g @ngrx/schematics:feature quote
```
Follow the prompts to generate and set up the NgRx feature state.

## Setting up Services and Side Effects

The state for the feature is set up already, but the quotes service and quotes effects still need to be connected. Update the quotes service to fetch quotes from the Seinfeld API.

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { QuotesEntity } from './+state/quotes.models';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private API_URL = 'https://seinfeld-quotes.herokuapp.com';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<{ quotes: QuotesEntity[] }>(`${this.API_URL}/quotes`)
      .pipe(
        map(response => {
          return response.quotes.map((quote, index) => {
            return {
              id: index,
              ...quote
            };
          });
        })
      );
  }
}
```

The Seinfeld API being used returns all quotes, but without a unique ID, so the snippet above maps each quote and uses the array index as the id. With the quotes service defined, connect it to the Effects.

```ts
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map } from 'rxjs/operators';

import * as QuotesActions from './quotes.actions';
import { QuotesService } from '../quotes.service';

@Injectable()
export class QuotesEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesActions.init),
      fetch({
        run: (action) => {
          return this.quotesService.getAll()
            .pipe(
              map(quotes => QuotesActions.loadQuotesSuccess({ quotes }))
            );
        },

        onError: (action, error) => {
          console.error('Error', error);
          return QuotesActions.loadQuotesFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions, private quotesService: QuotesService) {}
}
``` 

Effects listen to _all_ actions that are dispatched from the `Store`. After the `init` action is dispatched, the quotes are fetched, and the response is mapped into the `loadQuotesSucess` action. This action is used in the `quotes` reducer to load the quotes into the quotes state.

```ts
const quotesReducer = createReducer(
  initialState,
  on(QuotesActions.init, (state) => ({ ...state, loaded: false, error: null })),
  on(QuotesActions.loadQuotesSuccess, (state, { quotes }) =>
    quotesAdapter.setAll(quotes, { ...state, loaded: true })
  ),
  on(QuotesActions.loadQuotesFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
```
The generated reducer also listens to _all_ dispatched actions and updates the state if necessary. The collection of quotes is managed with an adapter created using NgRx Entity. This reduces the amount of code you have to write to manage these collections across your application.

## Registering the feature state

The feature state is ready to use in the quotes page library. Import the `QuotesDataAccessModule` and add it to the `imports` array of the `QuotesPageModule`. This registers the NgRx quotes state in the Store when the feature is loaded.

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuotesDataAccessModule } from '@seinfeld/quotes/data-access';

import { QuotesPageComponent } from './quotes-page/quotes-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: QuotesPageComponent } 
    ]),
    QuotesDataAccessModule
  ],
  declarations: [QuotesPageComponent],
})
export class QuotesPageModule {}
```

## Dispatching actions

In the `QuotesPageComponent`, inject the `Store` service from the `@ngrx/store` package, and use the `ngOnInit` lifecycle method and the `Store.dispatch` method to dispatch the `QuotesActions.init()` action. 

```ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { QuotesActions } from '@seinfeld/quotes/data-access';

@Component({
  selector: 'seinfeld-quotes-page',
  templateUrl: './quotes-page.component.html',
  styleUrls: ['./quotes-page.component.css']
})
export class QuotesPageComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(QuotesActions.init());
  }
}
```

The `QuotesEffects` are listening for this action and will fetch the quotes, and load them into the quotes feature state.

## Querying Data with Selectors

After the API request finishes successfully, the quotes state contains all the requested quotes. Only a subset of that data is needed in this example. Using selectors is the recommended way to transform pieces of state from the store.

In the `quotes.selectors.ts`, create a new selector named `getRandomQuotes` that takes 10 quotes from the complete list of quotes. This selector builds on top of the `getAllQuotes` selector generated with the feature.

```ts
export const getRandomQuotes = createSelector(getAllQuotes, (quotes) => {
  const start = Math.floor(Math.random() * quotes.length);

  return quotes.slice(start, start + 10).map((quote, index) => {
    return {
      id: index,
      ...quote,
    };
  });
});
```

This selector takes a random starting point from the collection of quotes and creates a new array of 10 quotes to return.

To list the quotes, define a `quotes$` property in the `QuotesPageComponent` that uses the `Store.select` method, and the `QuotesSelectors.getRandomQuotes` selector.

```ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { QuotesActions, QuotesSelectors } from '@seinfeld/quotes/data-access';

@Component({
  selector: 'seinfeld-quotes-page',
  templateUrl: './quotes-page.component.html',
  styleUrls: ['./quotes-page.component.css']
})
export class QuotesPageComponent implements OnInit {
  quotes$ = this.store.select(QuotesSelectors.getRandomQuotes);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(QuotesActions.init());
  }
}
```

Update the `QuotesPageComponent` template to display the list of quotes.

```html
<h2>Quotes</h2>

<div *ngFor="let quote of quotes$ | async">
  <div>
    {{ quote.quote }}
  </div>
  <div>
    Author: {{ quote.author }}
  </div>
  <div>
    Season {{ quote.season }} Episode {{ quote.episode }}
  </div>
  <br/>
</div>
```

Reloading the application displays a list of Seinfeld quotes, include author, season, and episode.

And that's it! 

<div class="flex justify-center">

![Seinfeld - Jerry Won The Race](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bw75f9tir54n6eeunnry.gif)

</div>

What did we cover?

- Initial setup of the Nx workspace and application
- Initial setup of NgRx for the application
- Generating feature libraries
- Quickly scaffolding NgRx feature state
- Connecting NgRx feature state to the feature page

You can see the complete example [here on GitHub](https://github.com/brandonroberts/nx-ngrx-seinfeld-app)

In future posts, I'll cover dealing with [Good Action Hygiene](https://www.youtube.com/watch?v=JmnsEvoy-gY) and local state management with [NgRx ComponentStore](https://ngrx.io/guide/component-store) within an Nx workspace.

**Credits**
- Thanks to the creator of the [Seinfeld API](https://seinfeld-quotes.herokuapp.com) used in this example.
- Thanks to [Zack DeRose](https://zackderose.dev/blogs) and [Colum Ferry](https://twitter.com/ferrycolum) for review feedback.

Like this post? Support my OSS work and content by [sponsoring me on GitHub!](https://github.com/sponsors/brandonroberts)

You can also follow me on [Twitter](https://twitter.com/brandontroberts), [Twitch](https://twitch.tv/brandontroberts), and [GitHub](https://github.com/brandonroberts)!
