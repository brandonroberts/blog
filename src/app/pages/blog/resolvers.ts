import { injectContentFiles } from '@analogjs/content';
import { MetaTag } from '@analogjs/router';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { Post } from '../../data/posts';

function injectActivePostAttributes(
  route: ActivatedRouteSnapshot
): Post {
  const file = injectContentFiles<Post>().find((contentFile) => {
    return (
      contentFile.filename === `/src/content/${route.params['slug']}.md` ||
      contentFile.slug === route.params['slug']
    );
  });

  return file!.attributes;
}

export const postTitleResolver: ResolveFn<string> = (route) =>
  injectActivePostAttributes(route).title;

export const postMetaResolver: ResolveFn<MetaTag[]> = (route) => {
  const postAttributes = injectActivePostAttributes(route);
  const base =
    import.meta.env['VITE_ANALOG_BASE_URL'] || 'http://localhost:5173';
  const title = encodeURIComponent(postAttributes.title);
  const slug = postAttributes.slug;
  const imageUrl = `${base}/api/v1/og-images/${slug}.png?title=${title}`;

  return [
    {
      name: 'description',
      content: postAttributes.description,
    },
    {
      name: 'author',
      content: 'Brandon Roberts',
    },
    {
      property: 'og:title',
      content: postAttributes.title,
    },
    {
      property: 'og:description',
      content: postAttributes.description,
    },
    {
      property: 'og:image',
      content: imageUrl,
    },
    {
      property: 'twitter:image',
      content: imageUrl,
    },
  ];
};
