require('./scully-plugins/post-info.plugin.js');
import { HandledRoute, registerPlugin, ScullyConfig } from '@scullyio/scully';
import { readdirSync } from 'fs';

// registerPlugin('router', 'posts', async(route: string, config) => {
//   const posts: HandledRoute[] = readdirSync('./content/posts').map(post => ({
//     route: `/blog/posts/${post.split('.md')[0]}`
//   }));console.log(posts);

//   return posts;
// });

// registerPlugin('router', 'pages', async(route: string, config) => {
//   const pages: HandledRoute[] = readdirSync('./content/pages').map(page => ({
//     route: `/${page.split('.md')[0]}`
//   }));console.log(pages);

//   return pages;
// });

const getRoutes = new Promise<string[]>((res) => {
  const posts = readdirSync('./content/posts').map(post => `/blog/posts/${post.split('.md')[0]}`);
  const pages = readdirSync('./content/pages').map(page => `/${page.split('.md')[0]}`);
  const otherPages = ['/live'];

  res([...posts, ...pages, ...otherPages]);
});

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'blog',
  outDir: './dist/static',
  routes: {
    '/blog/posts/:id': {
      type: 'contentFolder',
      id: {
        folder: './content/posts',
      }
    },
    '/:pageId': {
      type: 'contentFolder',
      pageId: {
        folder: './content/pages',
      }
    }
  },
  extraRoutes: [
    '/blog',
    '/live'
  ]
};
