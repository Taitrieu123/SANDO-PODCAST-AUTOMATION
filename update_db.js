const fs = require('fs');
const config = require('./podcast_config.json');
let episodes = [];
try { episodes = require('./episodes.json'); } catch (e) { }
const crypto = require('crypto');

const file = 'episodes/5_người_bạn_cần_để_thành_công.mp3';
const stats = fs.statSync(file);
const fileSize = stats.size;
const id = crypto.randomUUID();

const ep = {
    id: id,
    title: 'SIP 33 - Công Thức "Hu": 4 Người Bạn Cần Có Để Rút Ngắn Hành Trình Thành Công',
    description: `Tại sao 90% người học và đầu tư không đạt được kết quả như mong muốn? Lý do rất đơn giản: Chúng ta thường quá tập trung vào "Uột" (học cái gì) và "Hao" (học như thế nào) mà quên mất yếu tố quan trọng nhất: "Hu" — Học từ ai.
Chào mừng bạn quay trở lại với Sando Investment Podcast (SIP)! Quan sát những người thành công nhất thế giới từ Uo-rần Bắp-phít đến I-lon Mắt-xờ, San-đô nhận thấy một khuôn mẫu chung: Họ không bao giờ học một mình. Thay vào đó, họ xây dựng một hệ thống những người xung quanh để tăng tốc quá trình học hỏi.
Trong tập SIP 33 tuần này, chúng ta sẽ cùng giải mã "Công Thức Hu" — một chiến lược cốt lõi giúp bạn tránh được nhiều năm tự mò mẫm vô ích và rút ngắn thời gian thành công xuống chỉ còn vài tháng.
🎧 Những nội dung chính trong tập này:
Người Dạy: Tại sao người giỏi nhất chưa chắc đã là người dạy tốt nhất? Cách tìm người giúp bạn đi từ con số 0 đến khi có nền tảng vững chắc.
Người Men-tơ (Cố vấn): Tầm quan trọng của việc có một người đi trước để vạch trần những "điểm mù" và sai lầm thực chiến trong pót-phô-li-ô của bạn.
Người Đồng Hành (Pia): Sức mạnh của áp lực đồng trang lứa. Ai sẽ là người giữ cho bạn không bỏ cuộc khi thị trường khó khăn?
Hình Mẫu: Cách "đứng trên vai những người khổng lồ" để tạo ra tầm nhìn, niềm tin và bản thiết kế cho tương lai của bạn.
Bonus dành riêng cho dân kinh doanh: Giải mã nhân tố thứ 5 — Khách Hàng "ở gần". Tại sao một người dùng thật sẵn sàng phản hồi lại có giá trị hơn 1000 khách hàng nằm trong dữ liệu?
Thiếu đi một trong những vai trò này, hành trình của bạn chắc chắn sẽ gặp trở ngại. Đừng đợi đến khi mọi thứ hoàn hảo, hãy bật ngay tập podcast này, tìm ra "Hu" mà bạn đang thiếu và bắt đầu hành trình nâng cấp bản thân ngay hôm nay!
"Nếu bạn muốn đi nhanh, hãy đi một mình. Nếu bạn muốn đi xa, hãy đi cùng nhau." Cùng lắng nghe và hành động nhé!`,
    audioFile: '5_người_bạn_cần_để_thành_công.mp3',
    duration: '00:15:00', // Thời lượng tạm tính 15p (Spotify tự đọc lại trên app)
    fileSize: fileSize,
    publishDate: new Date().toISOString(),
    episodeNumber: config.nextEpisodeNumber
};

episodes.unshift(ep);
config.nextEpisodeNumber++;

fs.writeFileSync('./episodes.json', JSON.stringify(episodes, null, 2));
fs.writeFileSync('./podcast_config.json', JSON.stringify(config, null, 2));
console.log('Đã cập nhật cơ sở dữ liệu với episode: ' + ep.title);
