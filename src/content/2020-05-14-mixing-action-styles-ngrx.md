---
title: Mixing Action Styles in NgRx State
description: 'Mixing Action Styles in NgRx State'
published: true
slug: 2020-05-14-mixing-action-styles-ngrx
publishedDate: '2020-05-14 02:00 PM CST'
layout: ../../../layouts/BlogPostLayout.astro
---

<div id="post-info"></div>

<br/>

<a href="https://unsplash.com/@franckinjapan?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" target="_blank" title="Photo by Franck V. on Unsplash">
  <img src="/assets/posts/franck-v-miWGZ02CLKI-unsplash.jpg" width="100%"/>
</a>

Prior to version 8 of the NgRx platform, actions were created using enums, classes, and union types. Many people thought this approach was too noisy, and refer to it as [boilerplate](https://www.youtube.com/watch?v=t3jx0EC-Y3c&t=325s) 😉. In [version 8](https://medium.com/ngrx/announcing-ngrx-version-8-ngrx-data-create-functions-runtime-checks-and-mock-selectors-a44fac112627), we introduced the new creator functions for actions, reducers, and effects. Recently, the question was asked, if you have an existing application, can you use the old syntax with the new syntax? Let's mix things up.

<iframe src="https://giphy.com/embed/RLPtfIGR5YoKQhHUSA" width="100%" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/rastamouse-cooking-masterchef-baking-RLPtfIGR5YoKQhHUSA">via GIPHY</a></p>

For this example, I'll start with the [counter example](https://ngrx.io/generated/live-examples/store/stackblitz.html) using StackBlitz from the [NgRx docs](https://ngrx.io).

### Using with Reducers

To separate the two action styles, put them in different files. In the `counter.actions.ts` file, there is an action creator.

```ts
import { createAction } from '@ngrx/store';

export const increment = createAction('[Counter Component] Increment');
```

Create a new file named `legacy-counter.actions.ts`. In the actions file, define an Increment action using the action class syntax.

```ts
import { Action } from '@ngrx/store';

export enum CounterActionTypes {
  Increment = '[Counter Component] Legacy Increment',
}

export class Increment {
  readonly type = CounterActionTypes.Increment;
}

export type Union = Increment;
```

The action type is different than the modern action using the creator function. In the counter.reducer.ts file, import the legacy actions. Before mixing the types of the legacy and modern syntax together, you need to create a union type of the two. The `@ngrx/store` package contains a helper utility function named `union` for returning the types of a dictionary of creator functions.

- Import the actions from `counter.actions.ts` using module import syntax
- Pass the object to the union function using the spread operator

```ts
import * as CounterActions from './counter.actions';

...

const CounterActionsUnion = union({...CounterActions});
```

This returns you the return types of the action creators. You already have an existing union of legacy counter actions, so you create a superset of the unions.

```ts
type Actions = LegacyCounterActions.Union | typeof CounterActionsUnion;
```

The reducer creation function handles action creators, but you still need a way to handle action classes. Use a simple switch case to handle this scenario. The switch case handles your legacy actions, and the default uses the created reducer function.

```ts
import { createReducer, on, union } from '@ngrx/store';
import * as LegacyCounterActions from './legacy-counter.actions';
import * as CounterActions from './counter.actions';

export const initialState = 0;

type State = number;

const counterReducer = createReducer(
  initialState,
  on(CounterActions.increment, (state) => state + 1)
);

const CounterActionsUnion = union({ ...CounterActions });

type Actions = LegacyCounterActions.Union | typeof CounterActionsUnion;

export function reducer(state: State | undefined, action: Actions) {
  switch (action.type) {
    case LegacyCounterActions.CounterActionTypes.Increment:
      return state + 1;
    default:
      return counterReducer(state, action);
  }
}
```

The reducer handles both actions with the same type safety as before. To read more about the redesign of actions in NgRx, visit [NgRx: Action Creators redesigned](https://medium.com/angular-in-depth/ngrx-action-creators-redesigned-d396960e46da) by NgRx team member [Alex Okrushko](https://twitter.com/alex-okrushko).

### Dispatching Actions

Dispatching actions hasn't changed. For an action class, dispatch the action using the created instance. For an action creator, dispatch the action using the called function.

```ts
export class MyCounterComponent {
...
  increment() {
    this.store.dispatch(CounterActions.increment());
  }
  legacyIncrement() {
    this.store.dispatch(new LegacyCounterActions.Increment());
  }
...
}
```

### Using with Effects

Using the two different action styles with Effects is more straightforward. Let's look a counter effects example.

```ts
import * as LegacyCounterActions from './legacy-counter.actions';
import * as CounterActions from './counter.actions';

@Injectable()
export class CounterEffects {
  increment$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          LegacyCounterActions.CounterActionTypes.Increment,
          CounterActions.increment
        ),
        tap((count) => console.log('incremented'))
      );
    },
    { dispatch: false }
  );
  constructor(private actions$: Actions) {}
}
```

The `ofType` operator takes multiple actions, and knows how to distinguish each action correctly. Underneath, the operator is looking at the `type` property of the action creator, or the `type` property on the action class instance. If you need to pass along some metadata with the action, you will need to specific the union types on the `Actions` generic.

That's It! To see a working example, see the completed [StackBlitz](https://stackblitz.com/edit/ngrx-mix-actions?embed=1&file=src/app/my-counter/my-counter.component.ts).

Follow me on [Twitter](https://twitter.com/brandontroberts), and [Twitch](https://twitch.tv/brandontroberts). If you like this content, consider [sponsoring me on GitHub](https://github.com/sponsors/brandonroberts).
