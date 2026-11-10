# 📰 Thời Báo Việt (Vietnam Times Digital) — Architecture & Technical Specification

> 💡 **Overview**: **Thời Báo Việt** is a digital Vietnamese newspaper web application built with a classic **Broadsheet Newspaper** editorial aesthetic. It directly ingests live Vietnamese news from the **NewsData.io API** (`country=vi`, `language=vi`, `category=crime`), featuring AI-powered Vietnamese text-to-speech audio narration, a 60-second news radio briefing, and multi-mode reading layouts.

---

## 📌 1. Project Overview & Quick Links

| Property | Details |
| :--- | :--- |
| **Product Name** | Thời Báo Việt (Vietnam Times Digital Edition) |
| **GitHub Repository** | [https://github.com/Marsbansiti/thoi-bao-viet](https://github.com/Marsbansiti/thoi-bao-viet) |
| **Live Web App (GitHub Pages)** | [https://marsbansiti.github.io/thoi-bao-viet/](https://marsbansiti.github.io/thoi-bao-viet/) |
| **Local Development Server** | `http://localhost:5173` |
| **Technology Stack** | HTML5, Tailwind CSS, Lucide Icons, Vanilla ES6+ JS, Node.js Native HTTP Server, Python CLI |
| **Primary Data Source** | NewsData.io Latest News API (`v1/latest`) |
| **License & Edition** | Digital Broadsheet — Issue #14,286 |

---

## ⚡ 2. NewsData.io API Integration

### Endpoint Specification
- **Base URL**: `https://newsdata.io/api/1/latest`
- **API Key**: `pub_ba74392554e0481dbd550894cde09922`
- **Country Filter**: `country=vi` (Exclusively targets Vietnam)
- **Language Filter**: `language=vi` (Vietnamese language articles)
- **Primary Criminal & Legal Category**: `category=crime` (*Pháp Luật & An Ninh*)
- **Supported Category Taxonomy**:
  - `top` — General Politics & Current Affairs (*Thời Sự*)
  - `crime` — Law Enforcement, Crime & Public Security (*Pháp Luật*)
  - `business` — Economics, Markets & Finance (*Kinh Doanh*)
  - `technology` — Technology & Artificial Intelligence (*Công Nghệ AI*)
  - `sports` — Sports & Football (*Thể Thao*)
  - `entertainment` — Culture & Entertainment (*Giải Trí & Văn Hóa*)
  - `health` — Healthcare & Medicine (*Sức Khỏe & Y Tế*)
  - `world` — International News (*Thế Giới*)
  - `science` — Science & Discovery (*Khoa Học*)
  - `lifestyle` — Living & Travel (*Đời Sống & Du Lịch*)

### Quota Management & Caching Architecture
> ⚠️ **Rate Limit Constraints**: NewsData.io free accounts provide **200 requests/day**.

- **Session & In-Memory Cache**: Implements a **10-minute Time-To-Live (TTL)** cache keyed by category, keyword, and page index. Navigating back and forth between sections reuses cached data and consumes 0 additional API credits.
- **Graceful Fallback Resilience**: If API rate limits (HTTP 429) or connection issues occur, the application automatically switches to curated Vietnamese seed data with realistic metadata and imagery. The user interface remains fully populated with no blank states.
- **Pagination**: Supports endless browsing via NewsData.io `nextPage` tokens.

---

## 🎨 3. Editorial Newspaper UI & Features

### Authentic Broadsheet Masthead
- **Title Banner**: Traditional serif typography reading **THỜI BÁO VIỆT**.
- **Dual Calendar**: Displays both **Solar date** and **Vietnamese Lunar date** (e.g., *Năm Bính Ngọ*).
- **Financial & Commodity Ticker**: Real-time ticker tracking:
  - `VN-Index` (Vietnam Stock Index)
  - `HNX-Index`
  - `USD / VND` exchange rate
  - `EUR / VND` exchange rate
  - `SJC 9999 Gold bullion`
  - `RON 95-III Gasoline`
- **Weather Widget**: Temperature and conditions for major regions: Hanoi, Da Nang, and Ho Chi Minh City.

### 3 Reading Layout Modes
1. **Trang Báo (Broadsheet)**: Classic multi-column layout with a prominent Lead Hero story, drop caps, a 3-article secondary feature bar, and editorial columns.
2. **Dạng Lưới (Grid)**: Modern magazine card layout with photography previews for fast scanning.
3. **Thu Gọn (Compact)**: Dense single-line list mode for efficient news browsing.

### 3 Reading Color Themes
- **Sáng (Light Mode)**: Clean international newsprint ivory background.
- **Giấy Báo Cổ Điển (Vintage Sepia)**: Authentic aged paper aesthetic with warm earth tones to minimize eye fatigue during long reading sessions.
- **Tối (Dark Mode)**: Contrast-balanced nighttime reading theme.

---

## 🎙️ 4. Audio Narration & AI Insights

- **60-Second Radio Podcast**: Clicking **"Radio 60s"** automatically aggregates the top 3 trending headlines and broadcasts a synthesized voice briefing using the browser's native **Web Speech API** (`vi-VN` voice profile).
- **Article Reader Voiceover**: Every article modal includes an individual **"Đọc bài báo"** button to read the full excerpt aloud.
- **AI Sentiment Meter**: Visual indicator showcasing NewsData.io sentiment metrics:
  - 🟢 **Positive** (*Tích cực*)
  - ⚪ **Neutral** (*Trung lập*)
  - 🔴 **Requires Note / Negative** (*Cần lưu ý*)
- **Personal Bookmarks Archive (*Tủ Báo*)**: Readers can save articles locally (`localStorage`) for offline reading later.

---

## 📂 5. Directory Structure & File Manifest

```
thoi-bao-viet/
├── .gitignore          # Excludes OS artifacts and temporary files
├── .nojekyll           # Ensures seamless GitHub Pages static hosting
├── index.html          # Main digital newspaper single-page app
├── server.js           # Zero-dependency native Node.js static server
├── start.bat           # 1-click Windows startup batch script
├── fetch_news.py       # Standalone Python CLI news fetcher
├── README.md           # Documentation and keyboard shortcut guide
├── NOTION_DOCS.md      # Notion-ready importable documentation
├── css/
│   └── style.css       # Playfair Display, Be Vietnam Pro, Sepia themes, drop caps
└── js/
    ├── api.js          # NewsData.io API Client with 10-minute caching layer
    ├── app.js          # Core app controller, search, tabs, bookmarks drawer
    ├── audio.js        # Vietnamese Web Speech TTS & 60-second radio engine
    └── data.js         # Fallback dataset, weather data, market rates
```

---

## 💻 6. Quickstart & Runbook

### Starting the Web Server
```bash
# Navigate to project folder
cd C:\Users\User\.gemini\antigravity\scratch\thoi-bao-viet

# Start local server
node server.js
# Access in browser: http://localhost:5173
```

### Running the Python CLI Tool
```bash
# Fetch and print Crime / Law & Order news
python fetch_news.py crime

# Fetch other sections (e.g., technology, business, sports)
python fetch_news.py technology
```

---

## ⌨️ 7. Keyboard Shortcuts
- `/` : Instantly jumps focus to the search bar.
- `ESC` : Closes any open modal (Article Reader, Bookmarks Drawer, API Configuration).
