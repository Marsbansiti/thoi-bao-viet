# THỜI BÁO VIỆT (Vietnam Times Digital Newspaper)

> **Nhật Báo Điện Tử Tiếng Việt 24/7** tích hợp dữ liệu trực tuyến từ cổng thông tấn **NewsData.io API**.

---

## 🌟 Giới Thiệu
**Thời Báo Việt** là ứng dụng báo điện tử được thiết kế theo phong cách nhật báo truyền thống (Broadsheet Newspaper) kết hợp công nghệ web hiện đại. Ứng dụng kết nối trực tiếp với API của **NewsData.io** (`apikey=pub_ba74392554e0481dbd550894cde09922`) lọc riêng toàn bộ dòng tin tức tiếng Việt (`language=vi`).

---

## 🚀 Tính Năng Nổi Bật

### 1. 📰 Thiết Kế Báo Giấy & Bố Cục Đa Dạng
- **Phong cách Măng-sét (Masthead) truyền thống**: Tên báo in hoa trang trọng, câu khẩu hiệu, thông tin ngày tháng Dương lịch và Âm lịch (Bính Ngọ), số báo phát hành.
- **3 Chế độ bố cục linh hoạt**:
  - **Trang Báo (Broadsheet)**: Bài đinh (Lead Story) cỡ lớn với ảnh bìa, chữ rơi (Drop Cap), 3 cột tin tiêu điểm phụ và danh sách bài báo chuyên sâu.
  - **Dạng Lưới (Grid)**: Thẻ ảnh tạp chí hiện đại cho người thích lướt tin nhanh.
  - **Thu Gọn (Compact)**: Danh sách một hàng tiết kiệm diện tích.

### 2. ⚡ Kết Nối Dữ Liệu Thời Gian Thực (NewsData.io API)
- Sử dụng API Key: `pub_ba74392554e0481dbd550894cde09922`.
- Lọc theo từng chuyên mục báo chí:
  - **Thời Sự & Chính Trị** (`category=top`)
  - **Kinh Doanh & Tài Chính** (`category=business`)
  - **Công Nghệ & AI** (`category=technology`)
  - **Thể Thao & Bóng Đá** (`category=sports`)
  - **Giải Trí & Văn Hóa** (`category=entertainment`)
  - **Sức Khỏe & Y Tế** (`category=health`)
  - **Thời Sự Thế Giới** (`category=world`)
  - **Khoa Học & Đời Sống** (`category=science`)
- **Tìm kiếm từ khóa**: Nhập từ khóa hoặc nhấn phím `/` để tìm tin tức theo thời gian thực (`&q=...`).
- **Phân trang vô tận**: Tự động lấy thẻ trang kế tiếp (`nextPage`) để tải thêm tin tức không giới hạn.
- **Bộ nhớ đệm thông minh (Cache 10 phút)**: Tiết kiệm số lượt gọi API miễn phí (200 req/ngày).
- **Chế độ sao lưu dữ liệu (Graceful Fallback)**: Nếu API hết quota hoặc mạng gián đoạn, ứng dụng tự động hiển thị bản tin tổng hợp dự phòng, không bao giờ bị trang trắng.

### 3. 🎙️ Bản Tin Radio 60 Giây & Giọng Đọc AI Tiếng Việt
- **Radio 60s**: Tự động tóm tắt và đọc to 3 tin nóng nhất bằng giọng đọc tiếng Việt chuẩn qua Web Speech API.
- **Trình đọc bài báo**: Mỗi bài viết có nút **"Đọc bài báo"** riêng với giọng đọc tự nhiên.

### 4. 📖 Trải Nghiệm Đọc Báo Đỉnh Cao
- **3 Chế độ màu sắc**:
  - **Sáng**: Nền giấy trắng ngà chuẩn quốc tế.
  - **Giấy Báo Cổ Điển (Sepia)**: Tái hiện trang báo in truyền thống, dịu mắt khi đọc lâu.
  - **Tối (Dark Mode)**: Đọc tin ban đêm bảo vệ thị lực.
- **Tùy chỉnh cỡ chữ**: Nút A / A+ / A++ phóng to thu nhỏ văn bản theo nhu cầu độc giả.
- **Tủ Báo Cá Nhân (Bookmarks)**: Lưu bài viết yêu thích vào `localStorage` để đọc lại offline.
- **Phân tích sắc thái (AI Sentiment)**: Hiển thị chỉ số Tích cực / Trung lập / Cần lưu ý từ NewsData AI.

### 5. 📈 Tiện Ích Trực Tuyến
- **Dự báo thời tiết 3 miền**: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Hải Phòng, Cần Thơ.
- **Bảng tỷ giá & thị trường**: VN-Index, HNX-Index, USD/VND, EUR/VND, Vàng miếng SJC 9999, Xăng RON 95-III.
- **Đăng ký nhận điểm tin buổi sáng & tối** qua Email.

---

## 💻 Cách Chạy Ứng Dụng

Ứng dụng hoàn toàn độc lập, không yêu cầu cài đặt thêm bất kỳ thư viện npm nặng nề nào.

### Cách 1: Chạy bằng Node.js
```bash
cd C:\Users\User\.gemini\antigravity\scratch\thoi-bao-viet
node server.js
```
Mở trình duyệt truy cập: **http://localhost:5173**

### Cách 2: Mở trực tiếp
Bạn có thể mở tệp `index.html` trực tiếp bằng trình duyệt Chrome, Edge, Firefox hoặc Safari.

---

## ⌨️ Phím Tắt Tiện Dụng
- `/` : Đưa con trỏ vào ô tìm kiếm nhanh.
- `ESC` : Đóng cửa sổ bài báo hoặc tủ lưu.
