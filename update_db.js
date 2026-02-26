const fs = require('fs');
const crypto = require('crypto');

const episodesPath = './episodes.json';
const configPath = './podcast_config.json';
const audioFile = 'Thoát_bẫy_công_nhân_khi_làm_Affiliate.m4a';

let episodes = require(episodesPath);
let config = require(configPath);

const stats = fs.statSync('./episodes/' + audioFile);

const ep = {
    id: crypto.randomUUID(),
    title: 'SIP 32 - Chiến Lược Affiliate: Từ Tư Duy Công Nhân Sang Chủ Hệ Thống',
    description: 'Bạn có đang làm Affiliate nhưng vẫn mang tư duy của một "công nhân số"? Trong tập SIP 32 này, chúng ta sẽ cùng bóc tách tư duy cốt lõi để chuyển mình từ người làm thuê vất vả sang một chủ hệ thống tạo ra thu nhập thụ động bền vững. Lắng nghe để thay đổi góc nhìn và chiến lược của bạn ngay hôm nay!',
    audioFile: audioFile,
    duration: '00:15:00', // Giả định
    fileSize: stats.size,
    publishDate: new Date().toISOString(),
    episodeNumber: config.nextEpisodeNumber
};

episodes.unshift(ep);
config.nextEpisodeNumber++;

fs.writeFileSync(episodesPath, JSON.stringify(episodes, null, 2));
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Update success');
