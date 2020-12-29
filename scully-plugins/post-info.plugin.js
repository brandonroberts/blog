/** import from scully the register plugin function */
const { registerPlugin } = require('@scullyio/scully');
const fs = require('fs');
const readingTime = require('reading-time');

/** import from scully the register plugin function */
const postInfo = async (routes) => {
  routes.forEach((route) => {
    if (route.route.startsWith('/blog/posts')) {
      const content = fs.readFileSync(route.templateFile).toString('utf-8');
      const stats = readingTime(content);

      route.data.readingTime =
        stats.minutes > 1 ? parseInt(stats.minutes, 10) : 1;
    }
  });

  return Promise.resolve(routes);
};
/**
  You can add extra validator for your custom plugin
*/
const validator = async (conf) => [];
/**
  registerPlugin(TypeOfPlugin, name of the plugin, plugin function, validator)
*/
registerPlugin('routeProcess', 'postInfo', postInfo, validator);
