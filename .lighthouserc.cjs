const staticDistDir = './dist/analog/public';

module.exports = {
  ci: {
    collect: {
      staticDistDir,
      url: ['http://localhost', 'http://localhost/blog'],
      maxAutodiscoverUrls: 0,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          assertions: {
            'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
          },
        },
      ],
    },
  },
};
