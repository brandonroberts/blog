## Handling Error States with NgRx

<img src="/content/posts/david-travis-548920-unsplash.jpg" width="100%"/>


When building applications with NgRx, one thing you have to be aware of is how to handle error states. Whether this be from submitting a login form, making a request for loading data, or handling user timeouts, errors still need to be displayed to the user in some way. The question arises of where do you put the error information. Should your error state be handled locally in the component, or added to your global state? There are multiple ways to do this, each with different advantages and drawbacks. Let's look at a movies page to walk through the different ways of handling and displaying errors.

#### Handling Errors In Your Component

With NgRx, we recommend you to keep your smart components responsibilities to expressing intents, and reflecting what's in your state. But there are cases where you don't need to share some state globally. The example below shows a movies page component without error handling.

```ts
@Component({
  selector: 'app-movies-page',
  template: `
    <h1>Movies Page</h1>
  `
})
export class MoviesPageComponent implements OnInit {

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.store.dispatch({ type: '[Movies Page] Load Movies' });
  }
}
```

Now let's look at how you would listen for the action that signals an error occurred when loading the movies. The `@ngrx/store` package exposes a service named **ScannedActionsSubject**. This provides an observable of the latest dispatched action after that action has reduced a new state. This same service is what `@ngrx/effects` uses as a source to provide the Actions service, which is an observable stream of each dispatched action.
Using the **[Movies/API] Load Movies Failure** action, you can listen for when this action occurs and store the error message locally in the component.

```ts
@Component({
  selector: 'app-movies-page',
  template: `
    <h1>Movies Page</h1>
    <div *ngIf="error">
      {{ error }}
    </div>
  `
})
export class MoviesPageComponent implements OnInit {
  error = '';

  constructor(
    private store: Store<fromRoot.State>
    actions$: ScannedActionsSubject
  ) {
    actions$.pipe(
      filter(action => action.type === '[Movies/API] Load Movies Failure'),
    ).subscribe(action => this.error = action.payload);
  }
    
  ngOnInit() {
    this.store.dispatch({ type: '[Movies Page] Load Movies' });
  }
}
```

Using the **ScannedActionSubject** observable is more manual as there are no built-in operators to filter on the action type. If you're more familiar with `@ngrx/effects`, you could use the Actions service, and the `ofType` operator to filter on the action type.

```ts
@Component({
  selector: 'app-movies-page',
  template: `
    <h1>Movies Page</h1>
    <div *ngIf="error">
      {{ error }}
    </div>
  `
})
export class MoviesPageComponent implements OnInit {
  error = '';

  constructor(
    private store: Store<fromRoot.State>,
    actions$: Actions
  ) {
    actions$.pipe(
      ofType('[Movies/API] Load Movies Failure'),
    ).subscribe(action => this.error = action.payload);
  }

  ngOnInit() {
    this.store.dispatch({ type: '[Movies Page] Load Movies' });
  }
}
```


**Pros:**

- The example above give you the option of not managing the error state globally.
- Listening to actions provides a local messaging bus of which to make decisions.
- The error message is cleaned up when the component is destroyed.

**Cons:**

- The consuming of actions is no longer left to reducers and effects.
- This has re-introduced side effect code into your component. Now the component has knowledge of what triggered the error message.
- There are additional observable subscriptions to clean up.
- There are more dependencies to mock during testing.

The impact of managing the error state is greater than intended. Ideally, components are to express intent in the form of dispatching actions, and connect data to the component through selectors.

#### Handling Errors in Your Shared State

Managing the error state in your global state part of the movie state is an alternative approach. You're already working with shared data, being the movies in this case, and that data is retrieved via side effect. The error state is directly tied to the loaded movies. It fits naturally to manage the error state with the movies.

In order to manage the error state globally, add the error property to your existing state, and handle the error action in your reducer.

```ts
export interface State {
  items: Movie[];
  error: string | null; // track errors
}

export const initialState = {
  items: [],
  error: null // default error value
}

export function reducer(
  state = initialState,
  action: MoviesActions
) {
  switch(action.type) {
    case '[Movies Page] Load Movies': {
      return initialState; // reset state
    }

    case '[Movies/API] Load Movies Success': {
      return {
        ...state,
        movies: action.payload,
        error: null // clear error message
      }
    }

    case '[Movies/API] Load Movies Failure': {
      return {
        ...state,
        error: action.payload  // capture error message
      }
    }

    default:
      return state;
  }
}
```

The **Load Movies Failure** action sets the error message in the global state. The** Load Movies** and **Load Movies Success** actions clears the error property, and are already actions being handled as a result of the dispatched actions from side effects. You use a selector to retrieve the error state.

```ts
export const selectMoviesPageError = createSelector(
  selectMoviesState,
  state => state.error // return error message
)
```

The error state is reset before the component initializes the subscriptions in the template, preventing flickering due to state changes. The updated component uses a selector and the async pipe in the component template.

```ts
@Component({
  selector: 'app-movies-page',
  template: `
    <h1>Movies Page</h1>
    <div *ngIf="error$ | async as errorMessage">
      {{ errorMessage }}
    </div>
  `
})
export class MoviesPageComponent implements OnInit {
  error$ = this.store.select(fromRoot.selectMoviesPageError);
  
  constructor(private store: Store<fromRoot.State>) {}
  
  ngOnInit() {
    this.store.dispatch('[Movies Page] Load Movies');
  }
}
```

Using the selector in the movies page component connects the error message to your template and the subscription is cleaned up when the component is destroyed because you are using Angular's async pipe.

**Pros:**

- You clean up the error state as part of your existing workflow with actions to load data, handle success and errors.
- You keep your side effect code isolated, keeping your component "pure" by only dispatching actions and connecting data with selectors.
- No additional management of observable subscriptions is needed.
- Component testing doesn't require any additional dependencies to mock out besides the Store.

**Cons:**

- You could retain the error state if the user navigates away from the page without attempting to reload the data.

Whether you choose to handle error states locally, or globally with NgRx depends on your use case. If you want to manage less in your global state store, or add more for convenience, just be aware of the trade-offs of each choice.

Thanks to [Michael Hladky](https://twitter.com/michael_hladky), [Wes Grimes](https://twitter.com/wesgrimes), and [Tim Deschryver](https://twitter.com/tim_deschryver) for the inspiration and push to write this blog post!