/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ['main', { name: 'beta', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        'assets': ['dist/analog/public'],
        successComment: false,
      }
    ],
    '@semantic-release/git'
  ],
  'preset': 'angular'
};