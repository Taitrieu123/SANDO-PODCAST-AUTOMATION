/**
 * 📌 SCRIPT ĐĂNG TẬP PODCAST MỚI
 * ================================
 * Hướng dẫn sử dụng:
 * 1. Đổi FILE_NAME thành tên file .mp3 trong thư mục /episodes/
 * 2. Điền EPISODE_TITLE (tiêu đề tập)
 * 3. Viết EPISODE_DESCRIPTION theo template HTML bên dưới
 * 4. Chạy: node update_db.js
 * 5. Chạy: node generate_rss.js
 * 6. Chạy: ./publish.sh
 */

const fs = require('fs');
const config = require('./podcast_config.json');
let episodes = [];
try { episodes = require('./episodes.json'); } catch (e) { }
const crypto = require('crypto');

// ============================================================
// ✏️  ĐIỀN THÔNG TIN TẬP MỚI TẠI ĐÂY
// ============================================================

const FILE_NAME = 'ten_file_audio.mp3'; // Tên file trong thư mục /episodes/

const EPISODE_TITLE = 'SIP XX - Tiêu Đề Tập Podcast';

/**
 * TEMPLATE MÔ TẢ HTML ĐẸP
 * ========================
 * Hướng dẫn:
 * - Dùng <p>...</p> để tạo đoạn văn
 * - Dùng <strong>...</strong> để in đậm từ khóa quan trọng
 * - Dùng <em>...</em> để in nghiêng câu quote ấn tượng
 * - Thêm emoji phù hợp với nội dung (🎧 💡 🔑 ✅ ❌ 🚀)
 * - Mỗi điểm chính nên là 1 thẻ <p> riêng
 */
const EPISODE_DESCRIPTION = `<p><strong>Câu hỏi mở đầu thu hút sự chú ý của người nghe?</strong></p>

<p>Đoạn giới thiệu ngắn về nội dung chính của tập. Nêu bối cảnh và lý do tập này quan trọng với người nghe.</p>

<p>🎧 <strong>Những nội dung chính trong tập này:</strong></p>

<p>💡 <strong>Điểm 1:</strong> Mô tả ngắn gọn điểm nội dung thứ nhất.</p>

<p>🔑 <strong>Điểm 2:</strong> Mô tả ngắn gọn điểm nội dung thứ hai.</p>

<p>✅ <strong>Điểm 3:</strong> Mô tả ngắn gọn điểm nội dung thứ ba.</p>

<p><em>"Câu quote ấn tượng hoặc lời kêu gọi hành động để kết thúc." 🚀</em></p>`;

// ============================================================
// ⚙️  XỬ LÝ TỰ ĐỘNG (KHÔNG CẦN SỬA TỪ ĐÂY)
// ============================================================

const file = `episodes/${FILE_NAME}`;
const stats = fs.statSync(file);
const fileSize = stats.size;
const id = crypto.randomUUID();

const ep = {
    id: id,
    title: EPISODE_TITLE,
    description: EPISODE_DESCRIPTION,
    audioFile: FILE_NAME,
    duration: '00:15:00', // Thời lượng tạm tính (Spotify/Apple tự đọc lại)
    fileSize: fileSize,
    publishDate: new Date().toISOString(),
    episodeNumber: config.nextEpisodeNumber
};

episodes.unshift(ep);
config.nextEpisodeNumber++;

fs.writeFileSync('./episodes.json', JSON.stringify(episodes, null, 2));
fs.writeFileSync('./podcast_config.json', JSON.stringify(config, null, 2));

console.log('✅ Đã thêm episode mới:');
console.log('   Tiêu đề  :', ep.title);
console.log('   Số tập   :', ep.episodeNumber);
console.log('   File     :', ep.audioFile);
console.log('   Kích thước:', (ep.fileSize / 1024 / 1024).toFixed(1), 'MB');
console.log('');
console.log('📋 Bước tiếp theo:');
console.log('   1. node generate_rss.js   → Tạo file feed.xml mới');
console.log('   2. ./publish.sh           → Đăng lên GitHub Pages');
