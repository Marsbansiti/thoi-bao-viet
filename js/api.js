/**
 * NewsData.io Vietnamese News API Service
 */

const DEFAULT_API_KEY = 'pub_ba74392554e0481dbd550894cde09922';
const API_BASE_URL = 'https://newsdata.io/api/1/latest';

const CATEGORY_MAP = {
  all: null,
  crime: 'crime',
  top: 'top',
  business: 'business',
  technology: 'technology',
  sports: 'sports',
  entertainment: 'entertainment',
  health: 'health',
  world: 'world',
  science: 'science',
  lifestyle: 'lifestyle',
};

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const memoryCache = new Map();

class NewsApiService {
  constructor() {
    this.apiKey = localStorage.getItem('viet_news_custom_key') || DEFAULT_API_KEY;
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(newKey) {
    this.apiKey = (newKey && newKey.trim()) ? newKey.trim() : DEFAULT_API_KEY;
    localStorage.setItem('viet_news_custom_key', this.apiKey);
  }

  async fetchNews({ category = 'all', query = '', page = '', forceRefresh = false } = {}) {
    const params = new URLSearchParams();
    params.set('apikey', this.apiKey);
    params.set('country', 'vi'); // Filter specifically for Vietnam
    params.set('language', 'vi'); // Filter exclusively for Vietnamese language

    const mappedCat = CATEGORY_MAP[category];
    if (mappedCat) {
      params.set('category', mappedCat);
    }

    if (query && query.trim()) {
      params.set('q', query.trim());
    }

    if (page && page.trim()) {
      params.set('page', page.trim());
    }

    const cacheKey = `cache_${category}_${query}_${page}_${this.apiKey}`;

    // Return cached result if available and fresh
    if (!forceRefresh) {
      const cached = memoryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return {
          articles: cached.data.results || [],
          nextPage: cached.data.nextPage,
          totalResults: cached.data.totalResults || 0,
          isFallback: false,
          fromCache: true,
        };
      }
    }

    const url = `${API_BASE_URL}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        let msg = `Lỗi HTTP ${response.status}`;
        try {
          const errData = await response.json();
          msg = errData.results?.message || errData.message || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error('API NewsData.io không trả về kết quả thành công');
      }

      // Save to memory cache
      memoryCache.set(cacheKey, { data, timestamp: Date.now() });

      return {
        articles: data.results || [],
        nextPage: data.nextPage,
        totalResults: data.totalResults || (data.results ? data.results.length : 0),
        isFallback: false,
        fromCache: false,
      };
    } catch (err) {
      console.warn('NewsData.io API Error / Limit:', err.message);

      // Return matching seed articles as graceful fallback
      let fallback = [...SEED_ARTICLES];
      if (category !== 'all') {
        const filtered = fallback.filter((a) =>
          a.category?.some((c) => c.toLowerCase() === category.toLowerCase())
        );
        if (filtered.length > 0) fallback = filtered;
      }

      if (query && query.trim()) {
        const q = query.toLowerCase();
        const filtered = fallback.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            (a.description && a.description.toLowerCase().includes(q))
        );
        if (filtered.length > 0) fallback = filtered;
      }

      return {
        articles: fallback,
        totalResults: fallback.length,
        isFallback: true,
        errorMessage: err.message,
        fromCache: false,
      };
    }
  }

  async testConnection(key) {
    const testUrl = `${API_BASE_URL}?apikey=${key.trim()}&country=vi&language=vi`;
    const res = await fetch(testUrl);
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      return { success: true, total: data.totalResults };
    }
    throw new Error(data.results?.message || data.message || `Lỗi HTTP ${res.status}`);
  }
}

window.newsApiService = new NewsApiService();
