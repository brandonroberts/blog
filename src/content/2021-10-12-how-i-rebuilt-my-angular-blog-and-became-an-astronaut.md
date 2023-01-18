---
title: 'How I rebuilt my Angular blog and became an Astronaut'
description: 'I was ready to rebuild my blog with Next.JS
but then decided to take another approach'
published: true
slug: 2021-10-12-how-i-rebuilt-my-angular-blog-and-became-an-astronaut
publishedDate: '2021-10-12 02:00 PM CST'
layout: ../../../layouts/BlogPostLayout.astro
---

Building your own blogging platform is no small feat. From picking the stack you want to use, along with CSS solutions, to how you're going to organize your content are all the decisions that you have to make. I have gone down this path a few times with my own blog built with just Angular, and Angular and Scully, and hosted solutions like Dev.to. I continue to want something with low-friction so that I could get my thoughts out and be able to write blog posts more quickly about things that I've learned along the way or things that I'm tinkering with. This post is how I started on a different path, ended up rebuilding my blog and became an Astronaut 🚀.

TL;DR - [GitHub Repo](https://github.com/brandonroberts/astro-blog) for my blog rebuilt with Astro.

<br/>

## Backstory

My friend and colleague [Juri](https://juri.dev) just finished a blog post series on [building a blog with Next.JS](https://juristr.com/blog/2021/06/create-nextjs-webapp-nx/), so I was all but ready to rebuild my Angular blog using the same stack. But as with all things in tech, when something else comes along the way we want to take a look and see what can be done with that also. Along my Twitter feed, I noticed a relatively new static site builder named [Astro](https://astro.build) that piqued my interest. 

## Astro

<div class="flex justify-center">
  <a href="https://astro.build" title="Astro logo" target="_blank">
    <img src="/assets/posts/astro-logo.jpg" title="Astro logo" />
  </a>
</div>

Astro is a new and different type of approach to building a static site. It ships _zero_ JavaScript by default, has its own notion of components, and one of the most interesting parts of it is that you can bring your own framework. 

After reading the docs, I _originally_ sought out to build an Astro renderer for Angular components. I made some progress there, but that’s a digression for another post. While reading the docs, most of what I needed to rebuild my relatively simple blog was supported by Astro, so I decided to try it out. 

### My Current Stack

Before getting started, this is what my current blog platform stack looks like:

- [Angular](https://angular.io) - Frontend framework for web development
- [Angular Component Router](https://github.com/angular-component/router) - My declarative router for Angular
- [Firebase](https://firebase.com) - Hosting solution for websites
- [Prism](https://prismjs.com) - A JavaScript library that provides syntax highlighting for code snippets 
- [Prism Themes](https://github.com/PrismJS/prism-themes) - Themes for syntax highlighting
- [Reading Time](https://www.npmjs.com/package/reading-time) - Calculates the minutes it takes to read the blog post
- [Scully](https://scully.io) - A JAMstack static site builder for Angular apps w/Markdown support
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework

Currently, no interactive JavaScript functionality is present. Scully is the main tool behind the stack. At a high level, I build my Angular application first. Scully then takes the built Angular application and renders each page statically using Puppeteer underneath the hood.

So why switch? Mainly for two reasons.

- I wanted explore building the same site without shipping any JavaScript.
- I wanted to have a better workflow for building the components that make up the site without having to rebuild the application and content every time I make a change.

Now let's get started with Astro.

<br/>

## Getting Started with Astro

To create a new project with Astro, I followed the [Quickstart](https://docs.astro.build/quick-start) from the docs to create a new project.

Open a terminal, create the directory for the project, and navigate into that directory.

```shell
mkdir astro-blog && cd astro-blog
```

Next, initialize the project with Astro

```shell
npm init astro
```

> I chose the `Generic` site.

Install the project dependencies

```shell
npm install
```

Run the dev server:

```shell
npm run dev
```

After the site starts running, visit http://localhost:3000 in your browser to view the landing page.

Next, I jumped into making components.

<br/>

## Astro Components = HTML+BYOC (Bring Your Own Components)

Astro introduces its own component syntax using the `.astro` extension. Astro’s Component Syntax is a special HTML-like file format which Astro uses for templating. It looks and feels very familiar to people familiar with HTML or JSX.

The first page I migrated was `/blog`, which lists each blog post by title. I copied my markdown files into the `src/pages/blog/posts` directory. I then created a `src/components/Posts.astro` file to read the contents of those files to get the metadata from the Markdown file, or frontmatter. I then used the `Astro.fetchContent()` method to read those files and list them in the content area below the code.

```html
---
// Posts.astro
let allPosts = Astro.fetchContent('../pages/blog/posts/*.md');
allPosts = allPosts.sort((a, b) => new Date(b.publishedDate).valueOf() - new Date(a.publishedDate).valueOf());

const posts = allPosts.filter(post => post.published);
---

<div class="text-2xl w-4/5">
  {posts.map(post => {
    return (
      <div class="py-4">
        <a href={'/blog/posts/' + post.slug} class="text-gray-600">{post.title}</a>

        <p class="text-sm">
          {post.publishedDate}
        </p>
      </div>
    );
  })}
</div>
```

From the snippet above, Astro let’s you embed code directly into the `.astro` file enclosed in a block of three dashes. This is where you can bring in JSX style templates, along with React/Svelte/Vue/Lit/etc components for use in the template area, and use JavaScript/TypeScript code directly. The one caveat is that there is no type-checking a compile time.

The area below the embedded code is your template. You can also embed `style` and `script` tags directly in the `.astro` file.

The `Posts.astro` file is now a reusable component I can use within a page. 

<br/>

## Using Tailwind

Using Tailwind inside an Astro project is a matter of installing Tailwind, adding a Tailwind config, enabling the Tailwind config in the Astro config, and setting up a global css file to import it. I won’t rehash those instructions here, but you can reference them in the Astro docs for [setting up Tailwind](https://docs.astro.build/guides/styling#-tailwind).

<br/>

## Routing

Astro uses file-based routing, which has really grown on me from seeing it in other React frameworks like Next.js, and Vue's Nuxt.js. To create a “route”, I created an `index.astro` file inside the `src/pages/blog` directory. 

In the `src/pages/blog/index.astro` file, I imported the `Posts` component and drop it into the template.

```html
---
// index.astro
import Posts from '../../components/Posts.astro';
---

<Posts />
```

No configuration to update, no components to map, just following folder and file conventions. My custom declarative router? Nowhere to be found 😢,  but that’s ok. Now when I navigate to http://localhost:3000/blog, I see a listing of blog posts. 

Any file within the `src/pages` directory with an `.astro` or `.md` extension is treated as a route. It also supports static routes, dynamic routes, 404 routes, along with named and rest parameters.

For redirecting from `/` to `/blog`, I updated the `src/pages/index.astro` to use a meta tag.

```html
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>Brandon Roberts - Web Developer</title>
    <meta http-equiv="refresh" content="0; URL=/blog" />
</head>

<body>
</body>

</html>
```

<br/>

## Using Layouts for Common Pages

The blog posts page is just a plain list of posts, and I will have other pages also, so next I needed to create a layout. A **Layout** in Astro is a special type of `Component` to help you share and reuse common layouts within the project.

I created a `src/layouts/BaseLayout.astro` file, and added some static HTML markup for structure

```html
// BaseLayout.astro
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Brandon Roberts - Web Developer</title>
    <base href="/" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="Brandon Roberts - Web Developer, Angular Team Member, NgRx Core Team, Open Source Project Maintainer"
    />
    <meta
      name="keywords"
      content="Brandon Roberts, Blog, Web Development, Angular, HTML, CSS, JavaScript, TypeScript"
    />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <link rel="stylesheet" href={Astro.resolve("../styles/global.css")} />    
  </head>

  <body>
      <main class="flex flex-grow justify-center min-h-screen p-4">
        <slot/>
      </main>
  </body>
</html>
```

The `BaseLayout` includes the global styles setup with Tailwind. 

```html
<link rel="stylesheet" href={Astro.resolve("../styles/global.css")} />
```

The `Astro.resolve()` handles retrieving contents of files embedded in your templates.

I updated the `src/pages/blog/index.astro` component to use the `BaseLayout`.

```html
---
// index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import Posts from '../../components/Posts.astro';
---

<BaseLayout>
  <Posts />
</BaseLayout>
```

I also needed a layout for each blog post, so I created a `src/layouts/BlogPostLayout.astro` with similar HTML structure for the blog posts, along with the title of the blog post, and the date it was published.

```html
---
// BlogPostLayout.astro
const { content } = Astro.props;
---

<html lang="en">
  <head>
    <title>{content.title}</title>
    <!-- excluded for brevity -->
    <link rel="stylesheet" href={Astro.resolve("../styles/global.css")} />
    <link rel="stylesheet" href={Astro.resolve("../themes/prism-atom-dark.css")} />    
  </head>

  <body>
    <main>

      <div class="flex flex-grow justify-center min-h-screen">
        <article class="w-screen max-w-4xl p-8">
          <h2 class="text-gray-600 text-2xl">{content.title}</h2>

          <span class="font-light text-sm">
            {content.publishedDate}
          </span>

          <slot/>
        </article>  
      </div>
      
    </main>
  </body>
</html>
```

Things to note:

- The [Astro](https://docs.astro.build/reference/api-reference) object is global and provides information about the page, provided props, and so on.
- In order for the syntax highlighting from Prism to work, I copied the theme into the `src/themes` directory and referenced it in the `BlogPostLayout` markup.
- The `<slot/>` is used to render the content from the markdown inside the layout.

Now that I have layouts for pages and posts, I needed to render the blog post content.

<br/>

## Using Markdown for page content

In Astro, markdown files are treated as plain text, and converted to HTML using [remark](https://remark.js.org/) with syntax highlighting done using [Prism](https://prismjs.com/) pre-enabled. In order to use the `BlogPostLayout.astro` in my markdown files, I had to add the `layout` property to the frontmatter in the markdown file. One example file looks like this:

```html
// 2021-10-12-how-i-rebuilt-my-angular-blog-and-became-an-astronaut.md
---
title: 'How I rebuilt my Angular blog and became an Astronaut'
description: 'I was ready to rebuild my blog with Next.JS
but then decided to take another approach'
published: true
slug: 2021-10-12-how-i-rebuilt-my-angular-blog-and-became-an-astronaut
publishedDate: '2021-10-12 02:00 PM CST'
layout: ../../../layouts/BlogPostLayout.astro
---
```

Astro also has a **Markdown** component you can embed into your own components and layouts for rendering markdown content inline. Now when visiting a link to a blog post, it is displayed with the structure of the layout.

<br/>

## Additional migrations without special plugins

There were a few things that Astro didn’t provide me out of the box, including: 

- Date formatting
- Reading time for blog posts

For date formatting, I installed the `date-fns` npm package.

```shell
npm install date-fns
```

I used the `format` function to give me a well-formatted date based on the `publishedDate` from my markdown frontmatter. Read more about date-fns from their docs.

```ts
---
// BlogPostLayout.astro
import { format } from 'date-fns';
---
```

To add reading time for blog posts, I installed the `reading-time` npm package.

```shell
npm install reading-time
```

After I mported it, I used it to read the contents of the markdown source compiled by Astro. There global **Astro** object provided the source of the markdown content for the blog post.

```ts
---
// BlogPostLayout.astro
import { format } from 'date-fns';
import readingTime from 'reading-time';
const { content } = Astro.props;
const stats = readingTime(content.astro.source);
---
```

The `readingTime` function can read the source content of the blog post to calculate the reading time. This gave me stats from the blog post in minutes to add to the template of the `BlogPostLayout.astro` file.

```html
// BlogPostLayout.astro
<div class="flex flex-grow justify-center min-h-screen">
  <article class="w-screen max-w-4xl p-8">
    <h2 class="text-gray-600 text-2xl">{content.title}</h2>

    <span class="font-light text-sm">
      {format(new Date(content.publishedDate), 'MMMM dd, yyyy')}
      -
      {stats.minutes > 1 ?  Math.ceil(stats.minutes) : 1} min read
    </span>

    <slot/>
  </article>  
</div>
```

<br/>

## Build and Deployment

To build the website, I used the npm command:

```shell
npm run build
```

Which runs Astro:

```shell
astro build
```

This produces the statically built version of the site.I can also preview the statically built version with:

```shell
npm run preview
```

I’m currently using Firebase to host my site, so there were no real changes here for deployment. Other static site hosts such as Netlify, GitHub Pages, Vercel, Azure Static Websites, and others are [all supported](https://docs.astro.build/guides/deploy).

After deploying, I must post the obligatory Lighthouse scores, so here you go.

<img src="/assets/posts/astro-blog-lighthouse.png" title="Blog Lighthouse Scores">

Not bad for a day’s work, right?

<br/>

## Wrap-up

After the changes, this is what my current new stack looks like.

- [Astro](https://astro.build) - Static site builder that includes Markdown, Prism, Routing, and more.
- [date-fns](https://date-fns.org/) - Modern functional library for working with dates.
- [Firebase](https://firebase.com) - Hosting solution for websites
- [Prism Themes](https://github.com/PrismJS/prism-themes) - Themes for syntax highlighting
- [Reading Time](https://www.npmjs.com/package/reading-time) - Calculates the minutes it takes to read the blog post
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework

One of the biggest things I gained was not having to rebuild my Angular application every time I made a change, and not having to rebuild all of my content when editing. If I’m working on a single blog post or page, only that page is built and served when I need it. Astro is still a work in progress, but I enjoy using it. I may need to add some interactivity to the site at some point, and I could do that with Astro’s support for integrating most frontend frameworks.

You can visit my site at [https://brandonroberts.dev](https://brandonroberts.dev) and  [my GitHub repo](https://github.com/brandonroberts/astro-blog) to see the full source code for my blog. Feel free to send me PRs for CSS 😉.

So what do you think? Leave a comment and let me know your thoughts. 

Like this post? You can also follow me on [Twitter](https://twitter.com/brandontroberts), [YouTube](https://youtube.com/brandonrobertsdev), [Twitch](https://twitch.tv/brandontroberts), and [GitHub](https://github.com/brandonroberts)!
