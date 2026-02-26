const fs = require('fs');
const https = require('https');

// Chạy: node import_existing.js "<RSS_URL_CŨ>"
const oldRssUrl = process.argv[2];

if (!oldRssUrl) {
    console.log("Vui lòng cung cấp link RSS cũ. VD: node import_existing.js https://anchor.fm/s/xxx/podcast/rss");
    process.exit(1);
}

https.get(oldRssUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Parser cùi bắp nhưng hiệu quả cho regex lấy item
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(data)) !== null) {
            const itemContent = match[1];

            const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
            const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemContent.match(/<description>([\s\S]*?)<\/description>/);
            const guidMatch = itemContent.match(/<guid[^>]*>(.*?)<\/guid>/);
            const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
            const encMatch = itemContent.match(/<enclosure url="(.*?)" length="(.*?)"/);
            const durationMatch = itemContent.match(/<itunes:duration>(.*?)<\/itunes:duration>/);
            const epNumMatch = itemContent.match(/<itunes:episode>(.*?)<\/itunes:episode>/);

            if (titleMatch && encMatch) {
                items.push({
                    id: guidMatch ? guidMatch[1] : crypto.randomUUID(),
                    title: titleMatch[1],
                    description: descMatch ? descMatch[1].trim() : '',
                    audioFile: encMatch[1], // Lưu URL GỐC, KHÔNG CẦN TẢI LẠI
                    duration: durationMatch ? durationMatch[1] : "00:15:00",
                    fileSize: parseInt(encMatch[2] || "0"),
                    publishDate: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
                    episodeNumber: epNumMatch ? parseInt(epNumMatch[1]) : 0
                });
            }
        }

        // Sort items by date (oldest first if we want to assign episode numbers, but typically RSS is newest first)
        // We'll just write it straight in.

        fs.writeFileSync('./episodes.json', JSON.stringify(items, null, 2));
        console.log(`✅ Đã import thành công ${items.length} episodes từ RSS cũ!`);
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
