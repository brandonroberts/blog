---
title: Custom Route Matching with the Angular Router
description: 'Custom Route Matching with the Angular Router'
published: true
slug: 2019-03-27-custom-route-matching-angular-router
publishedDate: '2019-03-27 02:00 PM CST'
layout: ../../../layouts/BlogPostLayout.astro
---

<br/>

<a href="https://unsplash.com/@soymeraki?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" title="Photo by Javier Allegue Barros on Unsplash">
  <img src="/assets/posts/javier-allegue-barros-761133-unsplash.jpg" width="100%"/>
</a>

When using the [Angular Router](https://angular.io/guide/router), there are usually only a few types of routes you need to create. A static route with no parameters, a variable route for dynamic parameters, and catchall routes for [404 pages](https://bobrov.dev/blog/angular-smart-404-page/). The Angular Router can handle all these scenarios with its powerful [route matching strategy](https://blog.angularindepth.com/angular-routing-series-pillar-1-router-states-and-url-matching-12520e62d0fc). The Angular Router also supports custom pattern matching for URL paths for more complex URLs. You've seen this before on Medium where it uses your Twitter handle in the URL. If you were building this route in your own application, you want to use this handle in your application as a route parameter but you don't want to parse out the `@` symbol every time.

Let’s start out with a simple route that captures a Twitter handle.

```ts
RouterModule.forRoot([{ path: ':username', component: ProfileComponent }]);
```

This variable path is what you normally use to define a route. The Angular Router takes this path, applies a [default matcher](https://github.com/angular/angular/blob/7.0.x/packages/router/src/shared.ts#L113), and uses a first match wins strategy to determine whether to load the component or module. A route that matches is returned as a **MatchResult**, made up of the consumed segments of the URL path, whether this is the last match in the segments consumed, and any variable parameters.

If you're navigating to **/@yourusername**, you get the entire handle as the username property. As mentioned before, you only want to return the string after the @ sign. To use a custom matcher, instead of providing a `path`, you provide a `matcher` property in your route definition. The `matcher` defines a function that receives an array of URL segments, the segment group, and the route definition. You could also use a combination of the provided arguments to determine a match, but in this case, you'll only need the URL segments. You'll parse the URL to check if it matches the pattern you want, and you'll return the consumed URL, along with custom route parameter.

```ts
RouterModule.forRoot([
  {
    matcher: (url) => {
      if (url.length === 1 && url[0].path.match(/^@[\w]+$/gm)) {
        return {
          consumed: url,
          posParams: {
            username: new UrlSegment(url[0].path.substr(1), {}),
          },
        };
      }

      return null;
    },
    component: ProfileComponent,
  },
]);
```

The example above checks to see that there is only one segment in the array, then uses regex to make sure the format of the username is a match. When it matches, it returns the entire URL consumed, and defines the username route parameter as a sub-string of the path. If there is no match, it returns null and the router continues to look for other routes that may match the URL. This works just as other routes do, allow you to define child routes, or even lazy loaded routes.

You still subscribe to the router parameters in your component the same way.

```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  username$ = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('username'))
  );
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}
}
```

When you use the ActivatedRoute in your component and subscribe to the **paramMap** observable, the username is already parsed and ready to use. Pattern matching with the Angular Router opens up a lot more power and flexibility when dealing with dynamic URLs in your apps. To see it in action, visit this [live example on StackBlitz](https://stackblitz.com/edit/angular-router-matcher?file=src%2Fapp%2Fapp.module.ts).
