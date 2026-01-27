import { injectContentFiles, injectContentListLoader } from '@analogjs/content';
import { MetaTag } from '@analogjs/router';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { ExtendedPost } from '../../data/posts';

function injectActivePostAttributes(
  route: ActivatedRouteSnapshot
): ExtendedPost | undefined {
  // Try to find in all content files (local + dev.to via custom loader)
  const allFiles = injectContentFiles<ExtendedPost>();
  const file = allFiles.find((contentFile) => {
    return (
      contentFile.filename === `/src/content/${route.params['slug']}.md` ||
      contentFile.slug === route.params['slug']
    );
  });

  return file?.attributes;
}

export const postTitleResolver: ResolveFn<string> = (route) => {
  const attrs = injectActivePostAttributes(route);
  return attrs?.title || 'Blog Post';
};

export const postMetaResolver: ResolveFn<MetaTag[]> = (route) => {
  const postAttributes = injectActivePostAttributes(route);
  
  if (!postAttributes) {
    return [
      { name: 'author', content: 'Brandon Roberts' },
    ];
  }
  
  const base =
    import.meta.env['VITE_ANALOG_BASE_URL'] || 'http://localhost:5173';
  const title = encodeURIComponent(postAttributes.title);
  const slug = postAttributes.slug;
  
  // Use dev.to social image if available, otherwise use generated OG image
  const imageUrl = postAttributes.socialImage || 
    `${base}/api/v1/og-images/${slug}.png?title=${title}`;

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
