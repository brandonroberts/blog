/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ['main', { name: 'beta', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/github',
      {
        successComment: false,
      }
    ],
    [
      '@semantic-release/npm',
      {
        'npmPublish': false
      }
    ],    
    '@semantic-release/git'
  ],
  'preset': 'angular'
};