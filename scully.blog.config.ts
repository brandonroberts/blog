require('./scully-plugins/post-info.plugin.js');
import { ScullyConfig } from '@scullyio/scully';

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'blog',
  outDir: './dist/static',
  routes: {
    '/blog/posts/:id': {
      type: 'contentFolder',
      id: {
        folder: './content/posts',
      },
    },
    '/:pageId': {
      type: 'contentFolder',
      pageId: {
        folder: './content/pages',
      },
    },
  },
};
