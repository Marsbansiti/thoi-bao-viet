# 📰 THỜI BÁO VIỆT (Vietnam Times Digital Edition)

> **Modern Vietnamese Digital Broadsheet Newspaper** powered by real-time feeds from the **NewsData.io API**.

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://marsbansiti.github.io/thoi-bao-viet/)
[![API](https://img.shields.io/badge/Data_Source-NewsData.io-0284c7?style=for-the-badge)](https://newsdata.io/)
[![Platform](https://img.shields.io/badge/Platform-Web_SPA-f59e0b?style=for-the-badge)]()

---

## 🌟 Overview

**Thời Báo Việt** is a digital newspaper application blending traditional Vietnamese broadsheet editorial design with modern interactive web features. It directly consumes live Vietnamese news from the **NewsData.io API** (`country=vi`, `language=vi`, and category filters such as `crime`, `business`, `technology`, `top`, etc.), featuring AI text-to-speech audio narration, a 60-second news radio briefing, and multi-mode reading layouts.

- **GitHub Repository**: [https://github.com/Marsbansiti/thoi-bao-viet](https://github.com/Marsbansiti/thoi-bao-viet)
- **Live Deployment (GitHub Pages)**: [https://marsbansiti.github.io/thoi-bao-viet/](https://marsbansiti.github.io/thoi-bao-viet/)
- **Local Dev Server**: `http://localhost:5173`

---

## 🚀 Key Features

### 1. 📰 Authentic Broadsheet Masthead & Multi-Layout Presentation
- **Traditional Masthead Design**: Prominent serif header, Latin & Vietnamese lunar date (Năm Bính Ngọ), edition issue counter (#14,286), and editorial slogan.
- **3 Dynamic Layouts**:
  - **Trang Báo (Broadsheet)**: Classic multi-column layout with a large Hero lead story, editorial drop-caps, 3 secondary highlighted features, and opinion columns.
  - **Dạng Lưới (Grid View)**: Modern photography-centric magazine grid for fast scanning.
  - **Thu Gọn (Compact View)**: Space-saving single-line list mode for dense reading.

### 2. ⚡ Real-Time NewsData.io API Integration
- **API Key**: `pub_ba74392554e0481dbd550894cde09922`
- **Region & Language**: Dedicated filtering for Vietnam (`country=vi`, `language=vi`).
- **Comprehensive Taxonomy**:
  - ⚖️ **Law Enforcement & Crime** (`category=crime` — *Pháp Luật & An Ninh*)
  - 🏛️ **Politics & Current Affairs** (`category=top` — *Thời Sự*)
  - 💼 **Business & Markets** (`category=business` — *Kinh Doanh*)
  - 💻 **Tech & Artificial Intelligence** (`category=technology` — *Công Nghệ AI*)
  - ⚽ **Sports & Football** (`category=sports` — *Thể Thao*)
  - 🎭 **Culture & Entertainment** (`category=entertainment` — *Giải Trí*)
  - 🩺 **Health & Medical** (`category=health` — *Sức Khỏe*)
  - 🌐 **World Affairs** (`category=world` — *Thế Giới*)
  - 🔬 **Science & Discoveries** (`category=science` — *Khoa Học*)
- **Keyword Search**: Instant search (`&q=...`) across live articles by pressing `/`.
- **Endless Pagination**: Seamlessly fetches subsequent pages via `nextPage` pagination tokens.
- **Smart 10-Minute Caching Layer**: In-memory and session caching minimizes unnecessary API queries and preserves daily request quotas (200 req/day on free tier).
- **Graceful Fallback Mode**: If API rate limits (HTTP 429) or offline states occur, the system automatically displays curated fallback Vietnamese seed data.

### 3. 🎙️ 60-Second Radio Podcast & Vietnamese Text-to-Speech
- **60s Radio Briefing**: Synthesizes and narrates the top 3 trending headlines automatically using browser-native **Web Speech API** with `vi-VN` voice detection.
- **Article Reader Voiceover**: Individual articles feature an interactive narration player with pause, play, and resume controls.

### 4. 📖 Reading Experience & Accessibility
- **3 Color Themes**:
  - **Sáng (Light Mode)**: Clean international newsprint ivory background.
  - **Giấy Báo (Vintage Sepia)**: Authentic aged paper tones that minimize eye fatigue.
  - **Tối (Dark Mode)**: Contrast-balanced night reading palette.
- **Adjustable Font Sizes**: Instant font scaling (`A`, `A+`, `A++`).
- **Personal Bookmarks Archive (*Tủ Báo*)**: Saved locally via `localStorage` for offline reading.
- **AI Sentiment Indicators**: Visual sentiment tagging from NewsData.io (Positive, Neutral, Requires Attention).

### 5. 📈 Live Financial & Weather Utilities
- **Market Ticker**: Real-time ticker tracking VN-Index, HNX-Index, USD/VND, EUR/VND, SJC 9999 Gold, and RON 95 Petrol prices.
- **Weather Widget**: Real-time temperature and conditions for Hanoi, Da Nang, and Ho Chi Minh City.

---

## 📂 Project Architecture

```
thoi-bao-viet/
├── .gitignore          # Git exclusion rules
├── .nojekyll           # Bypasses Jekyll processing on GitHub Pages
├── index.html          # Main application entry point (Broadsheet SPA)
├── server.js           # Zero-dependency native Node.js HTTP server
├── start.bat           # 1-click Windows quick launch script
├── fetch_news.py       # Standalone Python CLI news fetcher
├── README.md           # English documentation & guide
├── NOTION_DOCS.md      # Notion-ready importable technical specification
├── css/
│   └── style.css       # Editorial styling (Playfair Display, Be Vietnam Pro, drop caps)
└── js/
    ├── api.js          # NewsData.io API Client with 10-minute caching layer
    ├── app.js          # State management, modal reader, bookmarks, theme switcher
    ├── audio.js        # Vietnamese Web Speech TTS & 60s radio engine
    └── data.js         # Curated Vietnamese seed fallback data & market indicators
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+) **or** Python (3.9+) **or** any standard web browser.

### Option A: Launching via Node.js
```bash
# Navigate to directory
cd C:\Users\User\.gemini\antigravity\scratch\thoi-bao-viet

# Run the zero-dependency server
node server.js
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option B: Windows 1-Click Launch
Double-click `start.bat` in the project root folder. It will launch the local server and automatically open your default browser.

### Option C: Python CLI News Fetcher
To inspect or fetch news directly in your terminal:
```bash
# Fetch Law / Crime news
python fetch_news.py crime

# Fetch Tech news
python fetch_news.py technology

# Fetch Business news
python fetch_news.py business
```

---

## ⌨️ Keyboard Shortcuts
| Key | Action |
| :--- | :--- |
| `/` | Focus search bar immediately |
| `ESC` | Dismiss any open modal (Reader, Bookmarks, Config) |

---

## 📄 License
Released under the MIT License. Built for Vietnamese readers worldwide.
