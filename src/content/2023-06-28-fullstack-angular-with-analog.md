---
title: 'Fullstack Angular with Analog'
description: 'Analog is the fullstack meta-framework for Angular'
published: true
slug: 2023-06-28-fullstack-angular-with-analog
publishedDate: '2023-06-28 02:00 PM CST'
---

With the current iteration of the web ecosystem, many frameworks are taking a server-first approach to building applications and websites. This is largely being done through meta-frameworks, such as Next.JS, SvelteKit, Nuxt, Qwik City, and more. These meta-frameworks have features such as filesystem-based routing, server-side rendering, static site generation, built-in API routes, and more integrated into the developer experience. 

Analog is the meta-framework that helps you ship applications and websites faster with Angular.

### Features

Analog is built on top of Angular with additional capabilities including:

- First-class support for the Vite ecosystem (Vitest, Playwright, Cypress, and more)
- [File-based routing](https://analogjs.org/docs/features/routing/overview)
- [Support for using markdown as content routes](https://analogjs.org/docs/features/routing/content)
- [Support for API/server routes](https://analogjs.org/docs/features/api/overview)
- Hybrid [SSR](https://analogjs.org/docs/features/server/server-side-rendering)/[SSG support](https://analogjs.org/docs/features/server/static-site-generation)
- Supports Angular CLI/[Nx workspaces](https://analogjs.org/docs/integrations/nx)
- And more integrations

Let's Dive In!

## Getting Started 🤓

To create a new Analog project, you can use the `create-analog` package with your package manager of choice:

```sh
npm create analog@latest analog-app
cd analog-app
```

You can also [scaffold a new project with Nx](https://analogjs.org/docs/integrations/nx).

Install the dependencies:

```sh
npm install
```

And serve the application:

```sh
npm start
```

Navigate to http://localhost:5173 to see the application running in your browser.

To build for deployment, run the build command:

```sh
npm run build
```

## Fileystem-based Routing 🤖

Analog provides filesystem-based routing on top of the Angular Router. 

For example, to define a `/about` route, create a file named `src/app/pages/about.page.ts` in the Analog project.

Next, add a standalone Angular component:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <h2>Hello Analog</h2>

    Analog is a meta-framework on top of Angular.
  `,
})
export default class AboutPageComponent {}
```

Save the changes and there's your route without any additional configuration!

Navigate to http://localhost:5173/about to see the about page.

Analog also supports static routes, dynamic routes, nested routes, catch-all routes, [and more](https://analogjs.org/docs/features/routing/overview).

## API Routes 🧑‍🔧

Analog supports defining API routes that can be used to serve data to the application.

API routes are defined in the `src/server/routes` folder. API routes are also filesystem-based, and are exposed under the default `/api` prefix in development.

For example, to define an API route to send a "Hello Word" message as JSON:

Create a `src/server/routes/v1/hello.ts` file

```ts
import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
  return { message: 'Hello World' };
});
```

Save the changes, and now you can access this API route at `/api/v1/hello`. Query databases, connect to your CMS, and perform other actions on the server.

## Server-side Rendering and Static Site Generation 📈

Server-side rendering and static generation can enhance your Angular application in terms of SEO and performance. Analog supports server-side rendering and static site generation out of the box by default.

To build for deployment, run the build command:

```sh
npm run build
```

To pre-render pages, configure them in the `vite.config.ts` at the root of the project:

```ts
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    analog({
      prerender: {
        routes: async () => [
          '/',
          '/about',
          '/blog',
          '/blog/posts/2023-06-28-my-first-post',
        ],
      },
    }),
  ],
}));
```

These routes are pre-rendered to static HTML at build time and sent to the client before the Angular application is loaded, providing a better user experience. The Angular application is then loaded providing a continued interactive user experience for the website or application.

## Deployment 🚀

You can also deploy Analog applications to many different providers with little to no configuration including Netlify, Vercel, Firebase, and more.

Visit the [deployment docs](https://analogjs.org/docs/features/deployment/overview) to learn more.

## Sponsor Analog 💰

Analog is an MIT-licensed open-source project, but the effort needed to maintain this project is supported through sponsorships and contributions. We are looking for sponsorships and partnerships to support future development of the project.

Consider [sponsoring the Analog project](https://analogjs.org/docs/sponsoring).

If you are a business using Angular to build a revenue-generating product, sponsoring Analog and its development also helps your interests in pushing Analog and Angular forward. If you are an individual who supports open-source projects, considering sponsoring and contributing to Analog.

## Join the Community 🤝

- Visit and Star the [GitHub Repo](https://github.com/analogjs/analog)
- Join the [Discord](https://chat.analogjs.org)
- Follow us on [Twitter](https://twitter.com/analogjs)

Follow [me on Twitter](https://twitter.com/brandontroberts) and subscribe to my [YouTube Channel](https://youtube.com/@brandonrobertsdev?sub_confirmation=1) for content on [Angular](https://angular.io), [Analog](https://analogjs.org), [NgRx](https://ngrx.io), and more!
