# -*- coding: utf-8 -*-
"""
Thời Báo Việt - CLI News Fetcher
Fetches live Vietnamese news from NewsData.io (including Crime / Pháp Luật)
"""

import sys
import json
import requests

API_KEY = "pub_ba74392554e0481dbd550894cde09922"
BASE_URL = "https://newsdata.io/api/1/latest"

def fetch_vietnamese_news(category="crime", query=None):
    params = {
        "apikey": API_KEY,
        "country": "vi",
        "language": "vi",
    }
    if category and category != "all":
        params["category"] = category
    if query:
        params["q"] = query

    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Lỗi kết nối API NewsData.io: {e}")
        return None

def display_newspaper_cli(data):
    if not data or data.get("status") != "success":
        print("Không thể lấy dữ liệu từ NewsData.io.")
        return

    total = data.get("totalResults", 0)
    results = data.get("results", [])

    print("=" * 65)
    print("🗞️  THỜI BÁO VIỆT | BẢN TIN PHÁP LUẬT & AN NINH TRẬT TỰ")
    print(f"📡  Tổng số bài báo ghi nhận: {total} bài")
    print("=" * 65)

    for i, article in enumerate(results, 1):
        title = article.get("title", "Không có tiêu đề")
        source = article.get("source_name", "Nguồn tin")
        pub_date = article.get("pubDate", "Vừa xong")
        desc = article.get("description", "Không có tóm tắt")
        link = article.get("link", "")
        sentiment = article.get("sentiment", "N/A")

        print(f"\n[{i}] {title}")
        print(f"    🏛️  Nguồn: {source} | 🕒 {pub_date} | ⚖️ Sắc thái: {sentiment}")
        if desc:
            # Shorten description if too long
            short_desc = desc if len(desc) <= 180 else desc[:177] + "..."
            print(f"    📖 {short_desc}")
        print(f"    🔗 Đọc bài gốc: {link}")

    print("\n" + "=" * 65)
    print("🌐 Xem đầy đủ giao diện báo điện tử tại: http://localhost:5173")
    print("=" * 65)

if __name__ == "__main__":
    cat = sys.argv[1] if len(sys.argv) > 1 else "crime"
    q = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Configure UTF-8 for Windows console
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    data = fetch_vietnamese_news(category=cat, query=q)
    display_newspaper_cli(data)
