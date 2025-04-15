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
      preset: "lighthouse:recommended",
      assertions: {
        "first-contentful-paint": [
          "warn",
          {
            "maxNumericValue": 2500,
            "aggregationMethod": "optimistic"
          }
        ],
        interactive: [
          "warn",
          {
            "maxNumericValue": 5000,
            "aggregationMethod": "optimistic"
          }
        ],
        "uses-long-cache-ttl": "off",
        "uses-http2": "off"
      }
    },
  },
};
