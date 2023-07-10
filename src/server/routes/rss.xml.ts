//server/routes/rss.xml.ts

import { defineEventHandler } from 'h3';
import RSS from 'rss';
import * as fs from 'fs';
import * as path from 'path';
import fm from 'front-matter';
const posts = fs.readdirSync('./src/content');
async function generateRssFeed() {
 const site_url = 'https://brandonroberts.dev';

 const feedOptions = {
  title: 'Brandon Roberts Blog | RSS Feed',
  description: 'Notes to my future self.',
  site_url: site_url,
  feed_url: `${site_url}/api/rss.xml`,
  image_url: `${site_url}/assets/images/brandonroberts.jpg`,
  pubDate: new Date(),
  copyright: `All rights reserved ${new Date().getFullYear()}`,
 };

 const feed = new RSS(feedOptions);

 posts.forEach((postFile) => {
  
  const fileContents = fs.readFileSync(path.resolve('src/content', postFile), 'utf8');
  const post: any = fm(fileContents).attributes;  
  
    feed.item({
      title: post.title,
      description: post.description,
      url: `${site_url}/blog/posts/${post.slug}`,
      date: post.publishedDate,
    });
  });

  return feed.xml({ indent: true });
}

export default defineEventHandler(async(event) => {
  const feedString = await generateRssFeed();
  event.node.res.setHeader('content-type', 'text/xml');
  event.node.res.end(feedString);
});
