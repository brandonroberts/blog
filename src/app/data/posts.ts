import { inject, InjectionToken } from '@angular/core';

import frontmatter from 'front-matter';

export interface Frontmatter {
  title: string;
  description: string;
  publishedDate: string;
  slug: string;
  published: boolean;
  [name: string]: any;
}

export interface Post {
  content: string;
  frontmatter: Frontmatter;
}

export function isPost(post: Post, liveStreams: boolean) {
  if (liveStreams) {
    return post.frontmatter.title.includes('Unfiltered');
  }

  return !post.frontmatter.title.includes('Unfiltered');
}

export const blogPosts = new InjectionToken<Post[]>('Blog Posts', {
  providedIn: 'root',
  factory() {
    const postFiles = import.meta.glob('/src/content/**/*.md', {
      eager: true,
      as: 'raw',
    });

    const posts = Object.keys(postFiles)
      .map((postFile) => {
        const metadata = frontmatter<Frontmatter>(postFiles[postFile]);

        return {
          content: metadata.body, 
          frontmatter: {
            title: metadata.attributes.title,
            description: metadata.attributes.description,
            slug: metadata.attributes.slug,
            publishedDate: metadata.attributes.publishedDate,
            published: metadata.attributes.published
          }
        };
      });

    posts.sort(
      (a, b) =>
        new Date(b.frontmatter.publishedDate).valueOf() -
        new Date(a.frontmatter.publishedDate).valueOf()
    );

    return posts;
  },
});

export function injectPosts(livestreams = false) {
  return inject(blogPosts).filter((post) => isPost(post, livestreams));
}