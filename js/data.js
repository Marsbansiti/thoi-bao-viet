/**
 * Seed Articles & Market Data for Thời Báo Việt
 */

const SEED_ARTICLES = [
  {
    article_id: "viet-lead-001",
    title: "Việt Nam đẩy mạnh chuyển đổi số quốc gia và ứng dụng trí tuệ nhân tạo thế hệ mới",
    link: "https://vnexpress.net/thoi-su/chuyen-doi-so-quoc-gia-2026",
    description: "Chính phủ vừa ban hành chiến lược phát triển công nghệ bán dẫn và hạ tầng dữ liệu lớn, mục tiêu đưa Việt Nam vào top 3 khu vực Đông Nam Á về kinh tế số trước năm 2030.",
    content: "Hà Nội - Tại hội nghị cấp cao về phát triển kinh tế số diễn ra sáng nay, các chuyên gia và lãnh đạo bộ ngành nhấn mạnh tầm quan trọng của việc xây dựng hành lang pháp lý mở cho các mô hình AI và chip bán dẫn. Việt Nam đang thu hút làn sóng đầu tư mạnh mẽ từ các tập đoàn công nghệ toàn cầu vào các trung tâm nghiên cứu và phát triển (R&D).",
    pubDate: "2026-11-10 08:30:00",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    source_id: "vnexpress",
    source_name: "VnExpress",
    source_url: "https://vnexpress.net",
    source_icon: "https://vne-static.zadn.vn/images/vne/vne_icon.ico",
    language: "vietnamese",
    country: ["vietnam"],
    category: ["technology", "top"],
    sentiment: "positive",
    sentiment_stats: { negative: 2.1, neutral: 14.5, positive: 83.4 },
    creator: ["Minh Hoàng", "Thu Hà"]
  },
  {
    article_id: "viet-biz-002",
    title: "VN-Index bứt phá mạnh mẽ, nhóm cổ phiếu công nghệ và tài chính dẫn dắt thị trường",
    link: "https://cafef.vn/thi-truong-chung-khoan-khoi-sac-2026",
    description: "Thanh khoản toàn thị trường vượt mốc 25.000 tỷ đồng, dòng tiền khối ngoại quay trở lại mua ròng mạnh mẽ ở nhóm doanh nghiệp sản xuất và năng lượng xanh.",
    content: "Kết thúc phiên giao dịch sáng, chỉ số VN-Index tăng hơn 12 điểm với sắc xanh lan tỏa trên 320 mã cổ phiếu. Động lực chính đến từ các thông tin tích cực về tăng trưởng GDP quý III và chính sách thúc đẩy tín dụng xanh của Ngân hàng Nhà nước.",
    pubDate: "2026-11-10 09:15:00",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    source_id: "cafef",
    source_name: "CafeF",
    source_url: "https://cafef.vn",
    source_icon: "https://cafef.mediacdn.vn/web_images/cafef.ico",
    language: "vietnamese",
    country: ["vietnam"],
    category: ["business"],
    sentiment: "positive",
    sentiment_stats: { negative: 5.2, neutral: 12.8, positive: 82.0 },
    creator: ["Quốc Bảo"]
  },
  {
    article_id: "viet-sport-003",
    title: "Đội tuyển bóng đá Việt Nam công bố đội hình chuẩn bị cho giải vô địch châu Á",
    link: "https://tuoitre.vn/the-thao/doi-tuyen-viet-nam-tap-trung-2026",
    description: "Huấn luyện viên trưởng triệu tập nhiều gương mặt trẻ tài năng xuất sắc từ giải U23 quốc gia, sẵn sàng cho chiến dịch tranh vé vào vòng loại cuối cùng.",
    content: "Đợt tập trung kéo dài 3 tuần tại Trung tâm Đào tạo Bóng đá trẻ Việt Nam quy tụ 28 tuyển thủ. Tinh thần toàn đội đang rất hưng phấn sau chuỗi trận giao hữu quốc tế ấn tượng trước các đối thủ hàng đầu châu lục.",
    pubDate: "2026-11-10 07:45:00",
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    source_id: "tuoitre",
    source_name: "Tuổi Trẻ Online",
    source_url: "https://tuoitre.vn",
    source_icon: "https://static.tuoitre.vn/tto/favicon.ico",
    language: "vietnamese",
    country: ["vietnam"],
    category: ["sports"],
    sentiment: "positive",
    sentiment_stats: { negative: 1.5, neutral: 15.0, positive: 83.5 },
    creator: ["Đăng Khoa"]
  },
  {
    article_id: "viet-env-004",
    title: "Đồng bằng sông Cửu Long chuyển mình với mô hình kinh tế nông nghiệp tuần hoàn",
    link: "https://dantri.com.vn/kinh-doanh/nong-nghiep-tuan-hoan-dbscl-2026",
    description: "Mô hình nuôi tôm - lúa thích ứng biến đổi khí hậu giúp hàng ngàn hộ dân nâng cao thu nhập gấp đôi, giảm thiểu phát thải carbon hướng tới tiêu chuẩn quốc tế.",
    content: "Tại các tỉnh Bến Tre, Bạc Liêu và Cà Mau, việc kết hợp quy trình sản xuất sạch với truy xuất nguồn gốc số bằng mã QR đã mở ra cơ hội xuất khẩu trực tiếp sang các thị trường khó tính như Liên minh Châu Âu (EU) và Hoa Kỳ.",
    pubDate: "2026-11-10 06:50:00",
    image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    source_id: "dantri",
    source_name: "Báo Dân Trí",
    source_url: "https://dantri.com.vn",
    source_icon: "https://cdnphoto.dantri.com.vn/favicon.ico",
    language: "vietnamese",
    country: ["vietnam"],
    category: ["environment", "lifestyle"],
    sentiment: "positive",
    sentiment_stats: { negative: 3.1, neutral: 18.2, positive: 78.7 },
    creator: ["Hồng Thắm"]
  },
  {
    article_id: "viet-world-005",
    title: "Hội nghị thượng đỉnh G20 đạt đồng thuận lịch sử về khuôn khổ quản trị năng lượng sạch",
    link: "https://thanhnien.vn/the-gioi/thuong-dinh-g20-2026",
    description: "Các nhà lãnh đạo cam kết tăng gấp ba sản lượng năng lượng tái tạo và tài trợ quỹ hỗ trợ chuyển đổi năng lượng công bằng cho các quốc gia đang phát triển.",
    content: "Tuyên bố chung sau hai ngày làm việc căng thẳng tại hội nghị khẳng định nỗ lực toàn cầu nhằm duy trì mục tiêu kiềm chế mức tăng nhiệt độ Trái Đất dưới 1,5 độ C, mở ra các gói tín dụng khí hậu ưu đãi quy mô hàng trăm tỷ USD.",
    pubDate: "2026-11-09 22:30:00",
    image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    source_id: "thanhnien",
    source_name: "Báo Thanh Niên",
    source_url: "https://thanhnien.vn",
    source_icon: "https://thanhnien.vn/favicon.ico",
    language: "vietnamese",
    country: ["vietnam"],
    category: ["world"],
    sentiment: "neutral",
    sentiment_stats: { negative: 12.0, neutral: 65.0, positive: 23.0 },
    creator: ["Văn Duẩn"]
  },
  {
    article_id: "viet-culture-006",
    title: "Khám phá không gian di sản phố cổ Hà Nội qua công nghệ thực tế ảo tương tác",
    link: "https://vietnamnet.vn/van-hoa/di-san-pho-co-ha-noi-vr-2026",
    description: "Du khách trong nước và quốc tế có thể trải nghiệm 36 phố phường Hà Nội của thế kỷ trước với âm thanh, hình ảnh 3D chân thực đến từng chi tiết.",
    content: "Dự án số hóa di sản do Trung tâm Bảo tồn Di sản Thăng Long phối hợp cùng các viện nghiên cứu văn hóa triển khai đã nhận được sự hưởng ứng nồng nhiệt của giới trẻ, kết nối quá khứ với đời sống đương đại một cách sinh động.",
    pubDate: "2026-11-09 19:10:00",
    image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    source_id: "vietnamnet",
    source_name: "VietNamNet",
    source_url: "https://vietnamnet.vn",
    source_icon: "https://vnn-res.vgcloud.vn/ResV9/images/favicon.ico",
    language: "vietnamese",
    country: ["vietnam"],
    category: ["entertainment", "lifestyle"],
    sentiment: "positive",
    sentiment_stats: { negative: 0.8, neutral: 21.0, positive: 78.2 },
    creator: ["Lan Anh"]
  },
  {
    article_id: "viet-health-007",
    title: "Bệnh viện Bạch Mai ứng dụng robot hỗ trợ phẫu thuật nội soi lồng ngực độ chính xác cao",
    link: "https://suckhoedoisong.vn/y-te/robot-phau-thuat-bach-mai-2026",
    description: "Kỹ thuật tiên tiến giúp giảm thời gian phẫu thuật xuống còn một nửa, bệnh nhân phục hồi nhanh chóng và giảm thiểu tối đa các biến chứng sau mổ.",
    content: "Đây là bước tiến quan trọng của y học Việt Nam trong việc làm chủ các trang thiết bị y tế kỹ thuật cao, mang lại cơ hội điều trị hiệu quả và chi phí hợp lý cho người dân.",
    pubDate: "2026-11-09 16:40:00",
    image_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    source_id: "suckhoedoisong",
    source_name: "Sức Khỏe & Đời Sống",
    source_url: "https://suckhoedoisong.vn",
    source_icon: "https://suckhoedoisong.vn/favicon.ico",
    language: "vietnamese",
    country: ["vietnam"],
    category: ["health", "science"],
    sentiment: "positive",
    sentiment_stats: { negative: 1.0, neutral: 10.0, positive: 89.0 },
    creator: ["Bác sĩ Mai Linh"]
  },
  {
    article_id: "viet-tech-008",
    title: "Startup Việt phát triển hệ sinh thái IoT thông minh cho nhà máy sản xuất tự động",
    link: "https://vnexpress.net/so-hoa/startup-iot-viet-nam-2026",
    description: "Giải pháp quản lý dây chuyền bằng cảm biến không dây nội địa hóa 100% giúp các doanh nghiệp dệt may và chế biến gỗ tiết kiệm 20% chi phí điện năng.",
    content: "Được phát triển bởi đội ngũ kỹ sư trẻ từng tu nghiệp tại Nhật Bản và Đức, hệ thống có khả năng dự đoán hư hỏng của máy móc trước 72 giờ nhờ thuật toán học máy phân tích dao động âm thanh và nhiệt độ.",
    pubDate: "2026-11-09 14:20:00",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    source_id: "vnexpress",
    source_name: "VnExpress Số Hóa",
    source_url: "https://vnexpress.net",
    source_icon: "https://vne-static.zadn.vn/images/vne/vne_icon.ico",
    language: "vietnamese",
    country: ["vietnam"],
    category: ["technology", "business"],
    sentiment: "positive",
    sentiment_stats: { negative: 2.0, neutral: 15.0, positive: 83.0 },
    creator: ["Thành Chung"]
  }
];

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
];

const VIETNAM_WEATHER = [
  { city: 'Hà Nội', temp: 24, condition: 'Nắng nhẹ', icon: '☀️', high: 27, low: 20 },
  { city: 'TP. Hồ Chí Minh', temp: 31, condition: 'Có mây', icon: '⛅', high: 33, low: 25 },
  { city: 'Đà Nẵng', temp: 26, condition: 'Dịu mát', icon: '🌤️', high: 28, low: 22 },
  { city: 'Hải Phòng', temp: 23, condition: 'Trời quang', icon: '☀️', high: 26, low: 19 },
  { city: 'Cần Thơ', temp: 30, condition: 'Nắng ấm', icon: '🌤️', high: 32, low: 24 }
];

const MARKET_INDICATORS = [
  { symbol: 'VN-INDEX', name: 'VN-Index', value: '1,280.45', change: '+8.32 (+0.65%)', isUp: true },
  { symbol: 'HNX-INDEX', name: 'HNX-Index', value: '241.12', change: '+1.45 (+0.60%)', isUp: true },
  { symbol: 'USD/VND', name: 'Tỷ giá USD', value: '25,420', change: '-15đ (-0.06%)', isUp: false },
  { symbol: 'EUR/VND', name: 'Tỷ giá EUR', value: '27,150', change: '+45đ (+0.17%)', isUp: true },
  { symbol: 'VÀNG SJC', name: 'Vàng SJC 9999', value: '88.500.000đ', change: '+250.000đ', isUp: true },
  { symbol: 'XĂNG RON 95', name: 'Xăng RON 95', value: '21.820đ/lít', change: '-180đ', isUp: false }
];

function getFallbackImage(id) {
  let hash = 0;
  const str = String(id || 'default');
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}
