## Facades with NgRx Selectors: Create Before You Combine

When using NgRx Store for state management in Angular applications, a common pattern is to use a facade to further isolate NgRx from your component. A facade is just an additional service where you inject the `Store` service, define properties that use `Store.select` with a defined selector, and potentially wrap your dispatch methods. This is one way to give your slice of state a defined API in a service many developers are more familiar with. It also isolates your component from the importing things needed for NgRx directly in your component.

Facades themselves are not harmful, but they can lead you to use some additional patterns that go against idiomatic NgRx usage. In NgRx, selectors provide the APIs to select and combine data from different pieces of your shared state relatively easily. One pitfall many developers get caught in when using facades is treating pieces of NgRx state like isolated services. This post focuses on how to take advantage of NgRx selectors with facades.

Let's say we have two pieces of state in our Store, products, and categories. The example below displays a `ProductsFacadeService` with a `selectAllProducts$` property to use a selector to get all the products.

<!-- embedme ../../../projects/ngrx-facades-selectors/src/app/shared/state/products/products-facade.service.1.ts#L9-L16 -->

```ts
export class ProductsFacadeService {
  selectAllProducts$ = this.store.select(fromProducts.selectAllProducts);

  constructor(private store: Store<{}>) { }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
```

As facades are usually defined per slice of state, you have another facade that manages the data for the categories.

<!-- embedme ../../../projects/ngrx-facades-selectors/src/app/shared/state/categories/categories-facade.service.ts#L9-L16 -->

```ts
export class CategoriesFacadeService {
  selectAllCategories$ = this.store.select(fromCategories.selectAllCategories);

  constructor(private store: Store<{}>) { }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
```

Naturally, when you need to combine these two sets of data, you inject both facades into your component and use the RxJS `combineLatest` observable creation method to combine the latest values from each observable.

<!-- embedme ../../../projects/ngrx-facades-selectors/src/app/products/components/products-page/products-page.component.1.ts#L24-L54 -->

```ts
export class ProductsPageComponent implements OnInit {
  allProducts$ = this.productsFacade.selectAllProducts$;
  allCategories$ = this.categoriesFacade.selectAllCategories$;

  products$ = combineLatest([
    this.allProducts$,
    this.allCategories$
  ]).pipe(
    tap(data => console.log('products/categories', data)),
    map(([products, categories]) => {
      return products.map(product => {
        const category = categories.find(category => category.id === product.categoryId);

        return {
          ...product,
          category: category ? category.name : ''
        };
      })
    })
  );

  constructor(
    private productsFacade: ProductsFacadeService,
    private categoriesFacade: CategoriesFacadeService
  ) {}

  ngOnInit() {
    this.productsFacade.dispatch(ProductActions.enter());
  }
}

```

The observable emits each time either one of the observable emits a new value. This in isolation would be fine in some cases. When the observable is first subscribed to, it will get the latest value emitted from both observables. Then after `allProducts$` observable emits, or the `allCategories$` observable emits, and a new combined result is emitted. If each one of these observable emits separately, you get a total of 3 calls before all data is loaded.

As you're working with shared state, if you change the behavior to load products and categories in a single sequence, you would expect a decrease in the number of emissions, right? This isn't the case because you're still dealing with two separate streams, even if they are coming from a single source of truth. This is rather inefficient and becomes more apparent if you combine more observables of data from your state that are updated at the same time. If you combine more shared state streams using `combineLatest`, and you update these states simultaneously, you're running unnecessary computations on the get the combined data.

These are scenarios where you want to use the `createSelector` function provided by `@ngrx/store`. By creating a new selector to combine `products` and `categories`, even if they are updated simultaneously, you will only get one emission of combined data. The code below combines `products`, and `categories` in a selector. 

<!-- embedme ../../../projects/ngrx-facades-selectors/src/app/shared/state/products/products.selectors.ts#L11-L24 -->

```ts

export const selectProductsAndCategories = createSelector(
  selectAllProducts,
  selectAllCategories,
  (products, categories) => products.map(product => {
    const category = categories.find(category => category.id === product.categoryId);

    return {
      ...product,
      category: category ? category.name : ''
    };
  })
);

```

Selectors operate on all inputs in a single sequence, so even if both states are updated at the same time, all inputs will be checked for changes and produce a new output in a single operation. Now you can expose the newly created selector in your facade.

<!-- embedme ../../../projects/ngrx-facades-selectors/src/app/shared/state/products/products-facade.service.ts#L9-L18 -->

```ts
export class ProductsFacadeService {
  selectAllProducts$ = this.store.select(fromProducts.selectAllProducts);
  selectProductsAndCategories$ = this.store.select(fromProducts.selectProductsAndCategories);

  constructor(private store: Store<{}>) { }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
```

Once the selector is defined in the facade, consume the combined observable of data in your component. When the selector of `products` and `categories` is subscribed to, you receive your initial emission of their initial values, and when both states are updated at the same time, you only receive one additional emission with all data combined.

<!-- embedme ../../../projects/ngrx-facades-selectors/src/app/products/components/products-page/products-page.component.ts#L22-L33 -->

```ts
export class ProductsPageComponent implements OnInit {
  products$ = this.productsFacade.selectProductsAndCategories$
    .pipe(tap(data => console.log('products/categories', data)));

  constructor(
    private productsFacade: ProductsFacadeService
  ) {}

  ngOnInit() {
    this.productsFacade.dispatch(ProductActions.enter());
  }
}
```

This also keeps the number of facades you inject into your component to a minimum, keeping your component thin, with fewer dependencies to manage during testing. When using NgRx with facades, keep a simple rule, _**create before you combine**_. Use a selector to combine and consume your shared data from multiple states before exposing it to your components with the facade.