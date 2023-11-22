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
    [
      '@semantic-release/npm',
      {
        'npmPublish': false,
        'pkgRoot': './projects/my-lib/package.json'
      }
    ],     
    [
      '@semantic-release/git',
      { 
        'assets': ['CHANGELOG.md', 'package.json', 'projects/my-lib/package.json'],
        'message': 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}' 
      }
    ]
  ],
  'preset': 'angular'
};