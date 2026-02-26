const fs = require('fs');
const path = require('path');
const config = require('./podcast_config.json');
const episodes = require('./episodes.json');

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toUTCString();
}

let itemsHtml = '';

episodes.forEach(ep => {
  const isExternal = ep.audioFile.startsWith('http');
  const audioUrl = isExternal ? ep.audioFile : `${config.siteUrl}/episodes/${ep.audioFile}`;

  itemsHtml += `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description><![CDATA[${ep.description}]]></description>
      <pubDate>${formatDate(ep.publishDate)}</pubDate>
      <enclosure url="${audioUrl}" length="${ep.fileSize}" type="audio/mpeg" />
      <guid isPermaLink="false">${ep.id}</guid>
      <itunes:duration>${ep.duration}</itunes:duration>
      <itunes:episode>${ep.episodeNumber}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
    </item>`;
});

const coverUrl = config.coverImage.startsWith('http') ? config.coverImage : `${config.siteUrl}/${config.coverImage}`;

const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${config.title}</title>
    <description><![CDATA[${config.description}]]></description>
    <link>${config.siteUrl}</link>
    <language>${config.language}</language>
    <itunes:owner>
      <itunes:name>${config.author}</itunes:name>
      <itunes:email>${config.email}</itunes:email>
    </itunes:owner>
    <itunes:author>${config.author}</itunes:author>
    <itunes:image href="${coverUrl}" />
    <image>
      <url>${coverUrl}</url>
      <title>${config.title}</title>
      <link>${config.siteUrl}</link>
    </image>
    <itunes:category text="${config.category}">
      ${config.subcategory ? `<itunes:category text="${config.subcategory}"/>` : ''}
    </itunes:category>
    <itunes:explicit>${config.explicit ? 'true' : 'false'}</itunes:explicit>
${itemsHtml}
  </channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, 'feed.xml'), rssFeed);
console.log('✅ RSS feed.xml has been generated with ' + episodes.length + ' episodes.');
