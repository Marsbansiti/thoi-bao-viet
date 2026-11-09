/**
 * Main Application Logic for Thời Báo Việt
 */

// Application State
const state = {
  category: 'all',
  searchQuery: '',
  submittedQuery: '',
  articles: [],
  nextPage: null,
  totalResults: 0,
  isLoading: false,
  isLoadingMore: false,
  isFallback: false,
  viewMode: localStorage.getItem('viet_view_mode') || 'broadsheet',
  theme: localStorage.getItem('viet_theme') || 'light',
  fontSize: localStorage.getItem('viet_font_size') || 'normal',
  bookmarks: JSON.parse(localStorage.getItem('viet_bookmarks') || '[]'),
  selectedArticle: null,
  breakingIndex: 0,
  breakingTimer: null,
  isRadioPlaying: false,
};

// Utilities
const VIETNAMESE_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function getVietnameseDate() {
  const d = new Date();
  const dayName = VIETNAMESE_DAYS[d.getDay()];
  return `${dayName}, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
}

function getVietnameseLunarDate() {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const lunarDay = ((day + 20) % 30) + 1;
  const lunarMonth = month === 1 ? 12 : month - 1;
  return `Âm lịch: Ngày ${lunarDay} tháng ${lunarMonth} năm Bính Ngọ`;
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return 'Vừa cập nhật';
  try {
    const d = new Date(dateStr.replace(' ', 'T') + (dateStr.includes('Z') ? '' : 'Z'));
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay === 1) return 'Hôm qua';
    if (diffDay < 7) return `${diffDay} ngày trước`;

    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function estimateReadingTime(text) {
  if (!text) return '2 phút đọc';
  const words = text.trim().split(/\s+/).length;
  const min = Math.max(1, Math.ceil(words / 180));
  return `${min} phút đọc`;
}

function isArticleBookmarked(id) {
  return state.bookmarks.some((b) => b.article_id === id);
}

function toggleBookmark(article) {
  const exists = isArticleBookmarked(article.article_id);
  if (exists) {
    state.bookmarks = state.bookmarks.filter((b) => b.article_id !== article.article_id);
    showToast('Đã xóa bài báo khỏi tủ lưu');
  } else {
    state.bookmarks.unshift(article);
    showToast('Đã lưu bài báo vào tủ cá nhân');
  }
  localStorage.setItem('viet_bookmarks', JSON.stringify(state.bookmarks));
  updateBookmarkBadges();
  renderArticles();
  if (state.selectedArticle) {
    renderArticleModal();
  }
}

function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl transition-all opacity-0 pointer-events-none flex items-center gap-2 border border-stone-700';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>${message}</span>`;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2400);
}

// Theme & Appearance Setup
function applyTheme(themeName) {
  state.theme = themeName;
  localStorage.setItem('viet_theme', themeName);
  document.body.classList.remove('theme-sepia', 'theme-dark');
  if (themeName === 'sepia') document.body.classList.add('theme-sepia');
  if (themeName === 'dark') document.body.classList.add('theme-dark');

  // Update theme buttons
  document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
    if (btn.getAttribute('data-theme-btn') === themeName) {
      btn.classList.add('bg-white', 'text-stone-900', 'font-bold', 'shadow-xs');
      btn.classList.remove('text-stone-600');
    } else {
      btn.classList.remove('bg-white', 'text-stone-900', 'font-bold', 'shadow-xs');
      btn.classList.add('text-stone-600');
    }
  });
}

function applyFontSize(sizeName) {
  state.fontSize = sizeName;
  localStorage.setItem('viet_font_size', sizeName);
  document.body.classList.remove('font-size-large', 'font-size-huge');
  if (sizeName === 'large') document.body.classList.add('font-size-large');
  if (sizeName === 'huge') document.body.classList.add('font-size-huge');

  document.querySelectorAll('[data-font-btn]').forEach((btn) => {
    if (btn.getAttribute('data-font-btn') === sizeName) {
      btn.classList.add('bg-white', 'text-stone-900', 'font-bold');
      btn.classList.remove('text-stone-600');
    } else {
      btn.classList.remove('bg-white', 'text-stone-900', 'font-bold');
      btn.classList.add('text-stone-600');
    }
  });
}

function applyViewMode(modeName) {
  state.viewMode = modeName;
  localStorage.setItem('viet_view_mode', modeName);

  document.querySelectorAll('[data-view-btn]').forEach((btn) => {
    if (btn.getAttribute('data-view-btn') === modeName) {
      btn.classList.add('bg-stone-900', 'text-white');
      btn.classList.remove('text-stone-700', 'hover:bg-stone-200');
    } else {
      btn.classList.remove('bg-stone-900', 'text-white');
      btn.classList.add('text-stone-700', 'hover:bg-stone-200');
    }
  });

  renderArticles();
}

// Category Navigation
function selectCategory(catId) {
  state.category = catId;
  state.searchQuery = '';
  state.submittedQuery = '';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('[data-cat-btn]').forEach((btn) => {
    const isCurrent = btn.getAttribute('data-cat-btn') === catId;
    if (isCurrent) {
      btn.className = 'whitespace-nowrap px-3 py-2 text-xs sm:text-sm font-bold text-red-900 bg-stone-100/90 rounded-sm relative shadow-xs';
      if (!btn.querySelector('.cat-active-pill')) {
        const pill = document.createElement('span');
        pill.className = 'cat-active-pill absolute bottom-0 left-2 right-2 h-0.5 bg-red-700 rounded-full';
        btn.appendChild(pill);
      }
    } else {
      btn.className = 'whitespace-nowrap px-3 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-sm transition-colors relative';
      const pill = btn.querySelector('.cat-active-pill');
      if (pill) pill.remove();
    }
  });

  loadArticles(true);
}

// Data Fetching
async function loadArticles(forceRefresh = false) {
  state.isLoading = true;
  renderLoadingState();

  const res = await window.newsApiService.fetchNews({
    category: state.category,
    query: state.submittedQuery,
    forceRefresh,
  });

  state.articles = res.articles || [];
  state.nextPage = res.nextPage || null;
  state.totalResults = res.totalResults || 0;
  state.isFallback = res.isFallback || false;
  state.isLoading = false;

  renderFallbackBanner();
  renderArticles();
  renderTrendingSidebar();
  setupBreakingNewsBar();
}

async function loadMoreArticles() {
  if (!state.nextPage || state.isLoadingMore) return;
  state.isLoadingMore = true;
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.innerHTML = `
      <i data-lucide="loader" class="animate-spin w-4 h-4 inline-block mr-1"></i>
      Đang tải thêm tin tức...
    `;
    lucide.createIcons();
  }

  const res = await window.newsApiService.fetchNews({
    category: state.category,
    query: state.submittedQuery,
    page: state.nextPage,
  });

  if (res.articles && res.articles.length > 0) {
    state.articles = [...state.articles, ...res.articles];
    state.nextPage = res.nextPage || null;
  }

  state.isLoadingMore = false;
  renderArticles();
  renderTrendingSidebar();
}

// UI Renderers
function renderLoadingState() {
  const container = document.getElementById('main-articles-stream');
  if (!container) return;

  container.innerHTML = `
    <div class="py-24 text-center space-y-4">
      <div class="inline-block p-4 rounded-full bg-red-50 text-red-800 animate-spin">
        <i data-lucide="rotate-cw" class="w-8 h-8"></i>
      </div>
      <h3 class="font-headline text-xl font-bold text-stone-900">
        Đang tải trang báo điện tử...
      </h3>
      <p class="text-xs text-stone-500 font-editorial">
        Đang đồng bộ dữ liệu với cổng thông tấn NewsData.io (Tiếng Việt)
      </p>
    </div>
  `;
  lucide.createIcons();
}

function renderFallbackBanner() {
  const banner = document.getElementById('fallback-notice-banner');
  if (!banner) return;
  if (state.isFallback) {
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

function updateBookmarkBadges() {
  const count = state.bookmarks.length;
  const badges = document.querySelectorAll('.bookmark-count-badge');
  badges.forEach((b) => {
    b.textContent = count;
    if (count > 0) {
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  });
}

// Breaking News Ticker
function setupBreakingNewsBar() {
  const barContainer = document.getElementById('breaking-headline-container');
  const indexIndicator = document.getElementById('breaking-index-indicator');
  if (!barContainer) return;

  const breakingList = state.articles.slice(0, 8);
  if (breakingList.length === 0) return;

  function showIndex(idx) {
    state.breakingIndex = (idx + breakingList.length) % breakingList.length;
    const item = breakingList[state.breakingIndex];
    barContainer.innerHTML = `
      <button onclick="openArticleModalById('${item.article_id}')" class="text-left truncate font-medium text-red-50 hover:text-yellow-300 transition-colors w-full flex items-center gap-2">
        <span class="font-bold text-stone-300 text-[11px] uppercase shrink-0">[${item.source_name || 'Bản tin'}]</span>
        <span class="truncate">${item.title}</span>
      </button>
    `;
    if (indexIndicator) {
      indexIndicator.textContent = `${state.breakingIndex + 1}/${breakingList.length}`;
    }
  }

  showIndex(0);

  if (state.breakingTimer) clearInterval(state.breakingTimer);
  state.breakingTimer = setInterval(() => {
    showIndex(state.breakingIndex + 1);
  }, 4500);

  window.prevBreaking = () => showIndex(state.breakingIndex - 1);
  window.nextBreaking = () => showIndex(state.breakingIndex + 1);
}

// Render Articles & Broadsheet
function renderArticles() {
  const streamContainer = document.getElementById('main-articles-stream');
  const heroContainer = document.getElementById('lead-hero-container');
  const secondaryContainer = document.getElementById('secondary-triple-container');
  const streamTitle = document.getElementById('stream-section-title');

  if (!streamContainer) return;

  // Update section title
  if (streamTitle) {
    if (state.submittedQuery) {
      streamTitle.textContent = `KẾT QUẢ TÌM KIẾM: "${state.submittedQuery}" (${state.articles.length} bài)`;
    } else if (state.category === 'all') {
      streamTitle.textContent = 'DÒNG SỰ KIỆN NỔI BẬT & THỜI SỰ 24H';
    } else {
      const catMap = {
        crime: 'PHÁP LUẬT & AN NINH TRẬT TỰ',
        top: 'THỜI SỰ & CHÍNH TRỊ',
        business: 'KINH DOANH & TÀI CHÍNH',
        technology: 'CÔNG NGHỆ & TRÍ TUỆ NHÂN TẠO',
        sports: 'THỂ THAO & BÓNG ĐÁ',
        entertainment: 'GIẢI TRÍ & VĂN HÓA',
        health: 'SỨC KHỎE & Y TẾ',
        world: 'THỜI SỰ THẾ GIỚI',
        science: 'KHOA HỌC & ĐỜI SỐNG',
        lifestyle: 'ĐỜI SỐNG & DU LỊCH',
      };
      streamTitle.textContent = catMap[state.category] || state.category.toUpperCase();
    }
  }

  if (state.articles.length === 0) {
    if (heroContainer) heroContainer.innerHTML = '';
    if (secondaryContainer) secondaryContainer.innerHTML = '';
    streamContainer.innerHTML = `
      <div class="py-20 text-center space-y-3 bg-white/50 border border-stone-200 rounded p-8 max-w-lg mx-auto">
        <i data-lucide="layers" class="w-10 h-10 mx-auto text-stone-400"></i>
        <h3 class="font-headline text-lg font-bold text-stone-900">Không tìm thấy bài viết nào</h3>
        <p class="text-xs text-stone-500">Hãy thử chọn chuyên mục khác hoặc làm mới bộ lọc tìm kiếm.</p>
        <button onclick="selectCategory('all')" class="px-4 py-1.5 bg-stone-900 text-white rounded text-xs font-bold hover:bg-stone-800">
          Về Trang Chủ
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const isBroadsheetFront = state.viewMode === 'broadsheet' && !state.submittedQuery;
  const lead = state.articles[0];
  const secondary = state.articles.slice(1, 4);
  const rest = isBroadsheetFront ? state.articles.slice(4) : state.articles;

  // 1. Render Hero Lead (if broadsheet front page)
  if (heroContainer) {
    if (isBroadsheetFront && lead) {
      heroContainer.classList.remove('hidden');
      const bookmarked = isArticleBookmarked(lead.article_id);
      heroContainer.innerHTML = `
        <article class="border border-stone-300 bg-white/70 p-4 sm:p-6 rounded-xs shadow-xs hover:border-stone-400 transition-colors group">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-7 relative overflow-hidden rounded-xs bg-stone-100 cursor-pointer" onclick="openArticleModalById('${lead.article_id}')">
              <div class="aspect-[16/10] w-full overflow-hidden">
                <img 
                  src="${lead.image_url || getFallbackImage(lead.article_id)}" 
                  alt="${lead.title}"
                  onerror="this.src=getFallbackImage('${lead.article_id}')"
                  class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span class="bg-red-700 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-md">
                  TIÊU ĐIỂM
                </span>
                ${lead.sentiment === 'positive' ? `
                  <span class="bg-emerald-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-xs shadow-sm flex items-center gap-1">
                    <i data-lucide="sparkles" class="w-3 h-3"></i> Tích cực
                  </span>
                ` : ''}
              </div>
            </div>

            <div class="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-stone-900 uppercase text-[11px] tracking-wide">${lead.source_name}</span>
                    <span>•</span>
                    <span class="flex items-center gap-1">
                      <i data-lucide="clock" class="w-3 h-3"></i>
                      ${formatRelativeTime(lead.pubDate)}
                    </span>
                  </div>
                  <button onclick="toggleBookmarkById('${lead.article_id}')" class="p-1.5 rounded-full hover:bg-stone-100 transition-colors ${bookmarked ? 'text-amber-600' : 'text-stone-400'}">
                    <i data-lucide="bookmark" class="w-4 h-4 ${bookmarked ? 'fill-amber-600' : ''}"></i>
                  </button>
                </div>

                <h2 onclick="openArticleModalById('${lead.article_id}')" class="font-headline text-2xl sm:text-3xl font-extrabold text-stone-950 leading-tight hover:text-red-900 transition-colors cursor-pointer mb-3">
                  ${lead.title}
                </h2>

                ${lead.description ? `
                  <p class="font-editorial text-sm sm:text-base text-stone-700 leading-relaxed dropcap mb-4 line-clamp-4">
                    ${lead.description}
                  </p>
                ` : ''}
              </div>

              <div class="pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
                <span class="text-stone-500 italic">${estimateReadingTime(lead.description)}</span>
                <button onclick="openArticleModalById('${lead.article_id}')" class="inline-flex items-center gap-1 text-red-800 font-bold hover:text-red-950 transition-colors uppercase tracking-wider text-[11px]">
                  <span>Đọc toàn văn</span>
                  <span class="text-base leading-none">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    } else {
      heroContainer.classList.add('hidden');
      heroContainer.innerHTML = '';
    }
  }

  // 2. Render Secondary Triple Bar (if broadsheet front page)
  if (secondaryContainer) {
    if (isBroadsheetFront && secondary.length > 0) {
      secondaryContainer.classList.remove('hidden');
      secondaryContainer.innerHTML = secondary.map((art, idx) => `
        <div onclick="openArticleModalById('${art.article_id}')" class="group cursor-pointer flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-300 md:pr-4 last:border-r-0 pb-4 md:pb-0">
          <div>
            <div class="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">${art.source_name}</div>
            <h3 class="font-headline text-base sm:text-lg font-bold text-stone-900 group-hover:text-red-800 transition-colors line-clamp-2 mb-2 leading-snug">
              ${art.title}
            </h3>
            ${art.description ? `
              <p class="font-editorial text-xs text-stone-600 line-clamp-2 leading-relaxed">
                ${art.description}
              </p>
            ` : ''}
          </div>
          <div class="text-[10px] text-stone-400 mt-2 italic">${formatRelativeTime(art.pubDate)}</div>
        </div>
      `).join('');
    } else {
      secondaryContainer.classList.add('hidden');
      secondaryContainer.innerHTML = '';
    }
  }

  // 3. Render Stream Articles by View Mode
  if (state.viewMode === 'grid') {
    streamContainer.className = 'grid grid-cols-1 sm:grid-cols-2 gap-5';
    streamContainer.innerHTML = rest.map((art) => renderCardGrid(art)).join('');
  } else if (state.viewMode === 'compact') {
    streamContainer.className = 'border border-stone-300 rounded-xs bg-white/70 divide-y divide-stone-200';
    streamContainer.innerHTML = rest.map((art) => renderCardCompact(art)).join('');
  } else {
    // Broadsheet column list
    streamContainer.className = 'space-y-4';
    streamContainer.innerHTML = rest.map((art) => renderCardBroadsheet(art)).join('');
  }

  // 4. Render Pagination / Load More button
  const paginationContainer = document.getElementById('pagination-container');
  if (paginationContainer) {
    if (state.nextPage) {
      paginationContainer.classList.remove('hidden');
      paginationContainer.innerHTML = `
        <button id="load-more-btn" onclick="loadMoreArticles()" class="px-6 py-2.5 bg-stone-900 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-sm flex items-center gap-2 mx-auto">
          <i data-lucide="arrow-down-circle" class="w-4 h-4"></i>
          <span>Tải thêm tin tức tiếp theo</span>
        </button>
      `;
    } else {
      paginationContainer.classList.add('hidden');
    }
  }

  lucide.createIcons();
}

function renderCardBroadsheet(art) {
  const bookmarked = isArticleBookmarked(art.article_id);
  return `
    <article class="border-b border-stone-300 pb-5 mb-5 last:border-b-0 group">
      <div class="flex flex-col sm:flex-row gap-4">
        <div onclick="openArticleModalById('${art.article_id}')" class="sm:w-1/3 aspect-[4/3] rounded-xs overflow-hidden bg-stone-100 shrink-0 cursor-pointer">
          <img 
            src="${art.image_url || getFallbackImage(art.article_id)}" 
            alt="${art.title}"
            onerror="this.src=getFallbackImage('${art.article_id}')"
            class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
              <div class="flex items-center gap-2">
                <span class="font-bold text-stone-900 uppercase tracking-wide">${art.source_name}</span>
                <span>•</span>
                <span>${formatRelativeTime(art.pubDate)}</span>
              </div>
              <button onclick="toggleBookmarkById('${art.article_id}')" class="p-1 rounded transition-colors ${bookmarked ? 'text-amber-600' : 'text-stone-400 hover:text-stone-700'}">
                <i data-lucide="bookmark" class="w-3.5 h-3.5 ${bookmarked ? 'fill-amber-600' : ''}"></i>
              </button>
            </div>
            <h3 onclick="openArticleModalById('${art.article_id}')" class="font-headline text-lg sm:text-xl font-bold text-stone-950 group-hover:text-red-900 transition-colors cursor-pointer leading-snug mb-2">
              ${art.title}
            </h3>
            ${art.description ? `
              <p class="font-editorial text-xs sm:text-sm text-stone-700 line-clamp-3 leading-relaxed mb-2">
                ${art.description}
              </p>
            ` : ''}
          </div>
          <div class="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span class="italic">${estimateReadingTime(art.description)}</span>
            <button onclick="openArticleModalById('${art.article_id}')" class="font-bold text-red-800 hover:text-red-950 transition-colors uppercase tracking-wider text-[10px]">
              Chi tiết &rarr;
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderCardGrid(art) {
  const bookmarked = isArticleBookmarked(art.article_id);
  return `
    <article class="border border-stone-300 bg-white/70 rounded-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-stone-400 transition-all group">
      <div>
        <div onclick="openArticleModalById('${art.article_id}')" class="aspect-[16/10] overflow-hidden bg-stone-100 cursor-pointer relative">
          <img 
            src="${art.image_url || getFallbackImage(art.article_id)}" 
            alt="${art.title}"
            onerror="this.src=getFallbackImage('${art.article_id}')"
            class="w-full h-full object-cover group-hover:scale-104 transition-transform duration-400"
          />
          ${art.sentiment === 'positive' ? `
            <div class="absolute top-2 right-2 bg-emerald-800/90 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
              Tích cực
            </div>
          ` : ''}
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between text-[11px] text-stone-500 mb-2">
            <span class="font-bold text-stone-800 uppercase tracking-wide">${art.source_name}</span>
            <span>${formatRelativeTime(art.pubDate)}</span>
          </div>
          <h3 onclick="openArticleModalById('${art.article_id}')" class="font-headline text-base sm:text-lg font-bold text-stone-950 group-hover:text-red-800 transition-colors line-clamp-2 cursor-pointer mb-2">
            ${art.title}
          </h3>
          ${art.description ? `
            <p class="font-editorial text-xs text-stone-600 line-clamp-3 leading-relaxed">
              ${art.description}
            </p>
          ` : ''}
        </div>
      </div>
      <div class="px-4 py-3 border-t border-stone-200 flex items-center justify-between text-xs bg-stone-50/50">
        <span class="text-[11px] text-stone-500 italic">${estimateReadingTime(art.description)}</span>
        <button onclick="toggleBookmarkById('${art.article_id}')" class="p-1 rounded ${bookmarked ? 'text-amber-600' : 'text-stone-400 hover:text-stone-700'}">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 ${bookmarked ? 'fill-amber-600' : ''}"></i>
        </button>
      </div>
    </article>
  `;
}

function renderCardCompact(art) {
  const bookmarked = isArticleBookmarked(art.article_id);
  return `
    <article onclick="openArticleModalById('${art.article_id}')" class="group flex items-center justify-between gap-4 p-3 hover:bg-stone-50 transition-colors cursor-pointer">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
          <span class="font-bold text-stone-800 uppercase">${art.source_name}</span>
          <span>•</span>
          <span>${formatRelativeTime(art.pubDate)}</span>
        </div>
        <h3 class="font-headline text-sm sm:text-base font-bold text-stone-900 group-hover:text-red-800 transition-colors line-clamp-2">
          ${art.title}
        </h3>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <div class="w-16 h-14 sm:w-20 sm:h-16 rounded overflow-hidden bg-stone-100">
          <img 
            src="${art.image_url || getFallbackImage(art.article_id)}" 
            alt="${art.title}"
            onerror="this.src=getFallbackImage('${art.article_id}')"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <button onclick="event.stopPropagation(); toggleBookmarkById('${art.article_id}')" class="p-1.5 rounded-full ${bookmarked ? 'text-amber-600' : 'text-stone-300 hover:text-stone-600'}">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 ${bookmarked ? 'fill-amber-600' : ''}"></i>
        </button>
      </div>
    </article>
  `;
}

// Render Trending Sidebar
function renderTrendingSidebar() {
  const container = document.getElementById('trending-articles-list');
  if (!container) return;

  const topList = state.articles.slice(0, 5);
  container.innerHTML = topList.map((art, idx) => {
    const rank = idx + 1;
    const badgeColor =
      rank === 1 ? 'bg-amber-500 text-white shadow-xs' :
      rank === 2 ? 'bg-stone-400 text-white' :
      rank === 3 ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-700';

    return `
      <div onclick="openArticleModalById('${art.article_id}')" class="py-3 flex items-start gap-3 group cursor-pointer border-b border-stone-200 last:border-b-0">
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${badgeColor}">
          ${rank}
        </span>
        <div class="flex-1 min-w-0">
          <h4 class="font-headline text-xs sm:text-sm font-bold text-stone-900 group-hover:text-red-800 transition-colors line-clamp-2 leading-snug">
            ${art.title}
          </h4>
          <div class="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
            <span class="uppercase font-semibold">${art.source_name}</span>
            <span>•</span>
            <span>${formatRelativeTime(art.pubDate)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// Article Reader Modal
function openArticleModalById(id) {
  const article = state.articles.find((a) => a.article_id === id) ||
    state.bookmarks.find((b) => b.article_id === id) ||
    SEED_ARTICLES.find((s) => s.article_id === id);

  if (!article) return;
  state.selectedArticle = article;
  renderArticleModal();
}

function closeArticleModal() {
  state.selectedArticle = null;
  window.audioRadioService.stop();
  const modal = document.getElementById('article-reader-modal');
  if (modal) modal.classList.add('hidden');
}

function renderArticleModal() {
  const modal = document.getElementById('article-reader-modal');
  const content = document.getElementById('article-modal-content');
  if (!modal || !content || !state.selectedArticle) return;

  const a = state.selectedArticle;
  const bookmarked = isArticleBookmarked(a.article_id);
  const timeAgo = formatRelativeTime(a.pubDate);
  const readingTime = estimateReadingTime(a.description || a.content);

  const related = state.articles
    .filter((x) => x.article_id !== a.article_id)
    .slice(0, 4);

  content.innerHTML = `
    <!-- Top Action Bar -->
    <div class="border-b border-stone-200 px-4 py-3 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
      <div class="flex items-center gap-2">
        <span class="font-headline font-bold text-xs uppercase tracking-wider text-red-800">${a.source_name}</span>
        <span class="text-stone-300">|</span>
        <span class="text-xs text-stone-500 font-numbers">${timeAgo}</span>
      </div>

      <div class="flex items-center gap-2">
        <button id="tts-article-btn" onclick="window.audioRadioService.playArticle(state.selectedArticle)" class="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-800 transition-all">
          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">Đọc bài báo</span>
        </button>

        <button onclick="toggleBookmarkById('${a.article_id}')" class="p-1.5 rounded ${bookmarked ? 'bg-amber-100 text-amber-700' : 'bg-stone-200 text-stone-700'}">
          <i data-lucide="bookmark" class="w-4 h-4 ${bookmarked ? 'fill-amber-600' : ''}"></i>
        </button>

        <button onclick="copyArticleLink('${a.link || window.location.href}')" class="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded" title="Sao chép liên kết">
          <i data-lucide="share-2" class="w-4 h-4"></i>
        </button>

        <button onclick="window.print()" class="hidden sm:block p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded" title="In trang báo">
          <i data-lucide="printer" class="w-4 h-4"></i>
        </button>

        <button onclick="closeArticleModal()" class="p-1.5 bg-stone-200 hover:bg-red-700 hover:text-white text-stone-800 rounded transition-colors ml-1">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Article Content -->
    <div class="overflow-y-auto p-4 sm:p-8 space-y-6 flex-1">
      <div class="space-y-3 border-b border-stone-200 pb-5">
        <div class="flex flex-wrap items-center gap-2">
          ${a.category && a.category.length > 0 ? `
            <span class="bg-red-800 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-xs">
              ${a.category[0]}
            </span>
          ` : ''}
          ${a.sentiment ? `
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase tracking-wide flex items-center gap-1 ${
              a.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-800' :
              a.sentiment === 'negative' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'
            }">
              <i data-lucide="sparkles" class="w-3 h-3"></i>
              Sắc thái: ${a.sentiment === 'positive' ? 'Tích cực' : a.sentiment === 'negative' ? 'Cần lưu ý' : 'Trung lập'}
            </span>
          ` : ''}
        </div>

        <h1 class="font-headline text-2xl sm:text-4xl font-extrabold text-stone-950 leading-tight">
          ${a.title}
        </h1>

        <div class="flex flex-wrap items-center justify-between text-xs text-stone-600 pt-1 gap-2">
          <div class="flex items-center gap-2">
            ${a.source_icon ? `<img src="${a.source_icon}" class="w-4 h-4 rounded-full" onerror="this.style.display='none'" />` : ''}
            <span class="font-semibold text-stone-900">${a.source_name}</span>
            <span>•</span>
            <span>Xuất bản: ${a.pubDate}</span>
          </div>
          <div class="italic text-stone-500">${readingTime}</div>
        </div>
      </div>

      <figure class="space-y-2">
        <div class="aspect-[16/9] w-full rounded-xs overflow-hidden bg-stone-100 border border-stone-200">
          <img 
            src="${a.image_url || getFallbackImage(a.article_id)}" 
            alt="${a.title}"
            onerror="this.src=getFallbackImage('${a.article_id}')"
            class="w-full h-full object-cover"
          />
        </div>
        <figcaption class="text-xs text-stone-500 italic text-center">
          Ảnh minh họa cho sự kiện • Bản tin từ ${a.source_name}
        </figcaption>
      </figure>

      ${a.description ? `
        <div class="font-editorial text-base sm:text-lg text-stone-800 leading-relaxed dropcap bg-stone-50/70 p-4 rounded border-l-4 border-red-800">
          ${a.description}
        </div>
      ` : ''}

      <div class="space-y-4 font-editorial text-sm sm:text-base text-stone-800 leading-relaxed">
        <p>
          Theo thông tin cập nhật từ <strong>${a.source_name}</strong>, diễn biến này đang thu hút sự chú ý sâu sắc của độc giả và giới chuyên môn trên toàn quốc. Các chuyên gia đánh giá đây là bước phát triển nổi bật, phản ánh nhịp sống năng động và xu thế hội nhập của Việt Nam.
        </p>
        <blockquote class="my-4 pl-4 border-l-2 border-stone-400 italic text-stone-700 bg-stone-100/50 py-2 pr-3">
          "Thông tin nhanh chóng, chính xác và minh bạch là nền tảng vững chắc cho sự phát triển của xã hội số."
        </blockquote>
        <p>
          Thời Báo Việt sẽ tiếp tục theo dõi sát sao và gửi tới quý bạn đọc những thông tin phân tích chuyên sâu nhất trong các bản tin tiếp theo.
        </p>
      </div>

      ${a.sentiment_stats ? `
        <div class="border border-stone-200 rounded p-4 bg-stone-50 text-xs">
          <div class="font-bold text-stone-800 mb-2 uppercase tracking-wide flex items-center gap-1.5">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-600"></i>
            Phân tích cảm xúc bài viết (NewsData AI Sentiment):
          </div>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-emerald-50 rounded border border-emerald-200">
              <div class="font-bold text-emerald-800 font-numbers">${a.sentiment_stats.positive.toFixed(1)}%</div>
              <div class="text-[10px] text-emerald-700">Tích cực</div>
            </div>
            <div class="p-2 bg-stone-100 rounded border border-stone-200">
              <div class="font-bold text-stone-800 font-numbers">${a.sentiment_stats.neutral.toFixed(1)}%</div>
              <div class="text-[10px] text-stone-600">Trung lập</div>
            </div>
            <div class="p-2 bg-rose-50 rounded border border-rose-200">
              <div class="font-bold text-rose-800 font-numbers">${a.sentiment_stats.negative.toFixed(1)}%</div>
              <div class="text-[10px] text-rose-700">Cần lưu ý</div>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="border-t border-stone-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-100/60 p-4 rounded">
        <div>
          <div class="text-xs text-stone-500">Đọc bài báo gốc đầy đủ tại nhà xuất bản:</div>
          <div class="font-bold text-sm text-stone-900">${a.source_name}</div>
        </div>
        <a href="${a.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded text-xs font-bold transition-all shadow-xs shrink-0">
          <span>Xem bài gốc trên ${a.source_name}</span>
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
        </a>
      </div>

      ${related.length > 0 ? `
        <div class="border-t border-stone-300 pt-5">
          <h4 class="font-headline text-lg font-bold text-stone-900 mb-3 flex items-center gap-1.5">
            <span>Tin Cùng Chuyên Mục</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-red-700"></i>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${related.map((r) => `
              <div onclick="openArticleModalById('${r.article_id}')" class="p-3 border border-stone-200 hover:border-stone-400 bg-white rounded cursor-pointer group transition-all">
                <div class="text-[10px] text-stone-500 uppercase font-semibold mb-1">${r.source_name} • ${formatRelativeTime(r.pubDate)}</div>
                <div class="font-headline text-xs font-bold text-stone-900 group-hover:text-red-800 transition-colors line-clamp-2">${r.title}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function copyArticleLink(link) {
  navigator.clipboard.writeText(link);
  showToast('Đã sao chép liên kết bài viết vào bộ nhớ tạm');
}

// Bookmarks Drawer Modal
function openBookmarksModal() {
  const modal = document.getElementById('bookmarks-drawer-modal');
  const container = document.getElementById('bookmarks-list-container');
  if (!modal || !container) return;

  if (state.bookmarks.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-stone-500 space-y-2">
        <i data-lucide="book-open" class="w-10 h-10 mx-auto text-stone-300"></i>
        <p class="font-editorial text-sm">Tủ báo của bạn đang trống.</p>
        <p class="text-xs text-stone-400">Nhấn vào biểu tượng dấu trang ở bất kỳ bài báo nào để lưu lại đọc sau.</p>
      </div>
    `;
  } else {
    container.innerHTML = state.bookmarks.map((art) => `
      <div class="py-3 flex items-start justify-between gap-3 group border-b border-stone-200 last:border-b-0">
        <div onclick="openArticleModalById('${art.article_id}'); closeBookmarksModal();" class="flex-1 cursor-pointer">
          <div class="text-[10px] text-stone-500 uppercase font-semibold mb-1">
            ${art.source_name} • ${formatRelativeTime(art.pubDate)}
          </div>
          <h4 class="font-headline text-sm font-bold text-stone-900 group-hover:text-red-800 transition-colors line-clamp-2">
            ${art.title}
          </h4>
          ${art.description ? `
            <p class="text-xs text-stone-600 line-clamp-2 mt-1 font-editorial">${art.description}</p>
          ` : ''}
        </div>
        <button onclick="toggleBookmarkById('${art.article_id}'); openBookmarksModal();" class="p-1.5 text-stone-400 hover:text-rose-700 rounded transition-colors" title="Bỏ lưu bài này">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeBookmarksModal() {
  const modal = document.getElementById('bookmarks-drawer-modal');
  if (modal) modal.classList.add('hidden');
}

function clearAllBookmarks() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ bài báo đã lưu trong tủ cá nhân?')) {
    state.bookmarks = [];
    localStorage.removeItem('viet_bookmarks');
    updateBookmarkBadges();
    openBookmarksModal();
    renderArticles();
  }
}

// API Key Modal
function openApiKeyModal() {
  const modal = document.getElementById('api-key-modal');
  const input = document.getElementById('api-key-input');
  const testRes = document.getElementById('api-test-result');
  if (!modal) return;
  if (input) input.value = window.newsApiService.getApiKey();
  if (testRes) testRes.classList.add('hidden');
  modal.classList.remove('hidden');
}

function closeApiKeyModal() {
  const modal = document.getElementById('api-key-modal');
  if (modal) modal.classList.add('hidden');
}

async function testApiKey() {
  const input = document.getElementById('api-key-input');
  const testRes = document.getElementById('api-test-result');
  const testBtn = document.getElementById('test-key-btn');
  if (!input || !testRes || !testBtn) return;

  const key = input.value.trim();
  if (!key) return;

  testBtn.disabled = true;
  testBtn.textContent = 'Đang kiểm tra...';
  testRes.classList.remove('hidden');
  testRes.className = 'p-3 rounded text-xs flex items-start gap-2 border bg-stone-50 border-stone-200 text-stone-700';
  testRes.innerHTML = '<span>Đang gửi yêu cầu xác thực tới máy chủ NewsData.io...</span>';

  try {
    const res = await window.newsApiService.testConnection(key);
    testRes.className = 'p-3 rounded text-xs flex items-start gap-2 border bg-emerald-50 border-emerald-300 text-emerald-800';
    testRes.innerHTML = `<span>✓ Kết nối thành công! Tìm thấy <strong>${res.total}</strong> bài báo tiếng Việt sẵn có.</span>`;
  } catch (err) {
    testRes.className = 'p-3 rounded text-xs flex items-start gap-2 border bg-rose-50 border-rose-300 text-rose-800';
    testRes.innerHTML = `<span>✗ Lỗi: ${err.message}</span>`;
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = 'Kiểm tra kết nối';
  }
}

function saveApiKey() {
  const input = document.getElementById('api-key-input');
  if (!input) return;
  const newKey = input.value.trim();
  window.newsApiService.setApiKey(newKey);
  closeApiKeyModal();
  showToast('Đã lưu API Key mới');
  loadArticles(true);
}

function resetDefaultApiKey() {
  const input = document.getElementById('api-key-input');
  if (input) input.value = DEFAULT_API_KEY;
}

// Global hook helpers
window.toggleBookmarkById = (id) => {
  const article = state.articles.find((a) => a.article_id === id) ||
    state.bookmarks.find((b) => b.article_id === id) ||
    SEED_ARTICLES.find((s) => s.article_id === id);
  if (article) toggleBookmark(article);
};

window.openArticleModalById = openArticleModalById;
window.closeArticleModal = closeArticleModal;
window.openBookmarksModal = openBookmarksModal;
window.closeBookmarksModal = closeBookmarksModal;
window.clearAllBookmarks = clearAllBookmarks;
window.openApiKeyModal = openApiKeyModal;
window.closeApiKeyModal = closeApiKeyModal;
window.testApiKey = testApiKey;
window.saveApiKey = saveApiKey;
window.resetDefaultApiKey = resetDefaultApiKey;
window.selectCategory = selectCategory;
window.applyTheme = applyTheme;
window.applyFontSize = applyFontSize;
window.applyViewMode = applyViewMode;
window.loadMoreArticles = loadMoreArticles;

// Radio Floating Player
function toggleRadioPodcast() {
  window.audioRadioService.playRadio(state.articles);
}
window.toggleRadioPodcast = toggleRadioPodcast;

// Audio Service State listener
window.audioRadioService.onStateChange(({ isPlaying, mode }) => {
  const radioBtn = document.getElementById('header-radio-btn');
  const floatingPlayer = document.getElementById('floating-radio-player');
  const ttsBtn = document.getElementById('tts-article-btn');

  if (radioBtn) {
    if (isPlaying && mode === 'radio') {
      radioBtn.classList.add('bg-red-700', 'text-white', 'animate-pulse');
      radioBtn.classList.remove('bg-stone-200', 'text-stone-800');
      radioBtn.querySelector('span').textContent = 'Đang phát Radio';
    } else {
      radioBtn.classList.remove('bg-red-700', 'text-white', 'animate-pulse');
      radioBtn.classList.add('bg-stone-200', 'text-stone-800');
      radioBtn.querySelector('span').textContent = 'Radio 60s';
    }
  }

  if (floatingPlayer) {
    if (isPlaying) {
      floatingPlayer.classList.remove('hidden');
    } else {
      floatingPlayer.classList.add('hidden');
    }
  }

  if (ttsBtn) {
    if (isPlaying && mode === 'article') {
      ttsBtn.classList.add('bg-amber-500', 'text-stone-950', 'animate-pulse');
      ttsBtn.querySelector('span').textContent = 'Dừng đọc';
    } else {
      ttsBtn.classList.remove('bg-amber-500', 'text-stone-950', 'animate-pulse');
      ttsBtn.querySelector('span').textContent = 'Đọc bài báo';
    }
  }
});

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // 1. Populate Date and Weather
  const dateEl = document.getElementById('current-date-display');
  const lunarEl = document.getElementById('lunar-date-display');
  if (dateEl) dateEl.textContent = getVietnameseDate();
  if (lunarEl) lunarEl.textContent = getVietnameseLunarDate();

  // Populate Weather
  const weatherRow = document.getElementById('weather-preview-row');
  if (weatherRow) {
    weatherRow.innerHTML = VIETNAM_WEATHER.slice(0, 3).map((w) => `
      <span class="flex items-center gap-1 text-stone-600">
        <span>${w.icon}</span>
        <span class="font-medium">${w.city}:</span>
        <span class="font-semibold text-stone-800">${w.temp}°C</span>
      </span>
    `).join('');
  }

  // Populate Market Ticker in TopBar
  const marketPreview = document.getElementById('market-preview-row');
  if (marketPreview) {
    marketPreview.innerHTML = MARKET_INDICATORS.slice(0, 2).map((m) => `
      <span class="flex items-center gap-1 font-numbers text-[11px]">
        <span class="font-semibold text-stone-800">${m.symbol}:</span>
        <span class="font-bold text-stone-900">${m.value}</span>
        <span class="text-[10px] ${m.isUp ? 'text-emerald-700' : 'text-rose-700'}">${m.change}</span>
      </span>
    `).join('');
  }

  // Populate Market Table in Sidebar
  const marketTable = document.getElementById('sidebar-market-table');
  if (marketTable) {
    marketTable.innerHTML = MARKET_INDICATORS.map((m) => `
      <div class="flex items-center justify-between py-1 border-b border-stone-100 last:border-b-0 text-xs">
        <span class="font-semibold text-stone-800">${m.name}</span>
        <div class="text-right">
          <span class="font-bold text-stone-950 font-numbers">${m.value}</span>
          <span class="${m.isUp ? 'text-emerald-700' : 'text-rose-700'} text-[11px] ml-2 font-bold font-numbers">${m.change}</span>
        </div>
      </div>
    `).join('');
  }

  // 2. Setup Search Form
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.submittedQuery = searchInput.value.trim();
      loadArticles(false);
    });
  }

  // 3. Setup Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast('Cảm ơn bạn đã đăng ký nhận bản tin Thời Báo Việt!');
        emailInput.value = '';
      }
    });
  }

  // 4. Keyboard Shortcuts: ESC closes modals, '/' focuses search
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArticleModal();
      closeBookmarksModal();
      closeApiKeyModal();
    } else if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // 5. Restore Preferences
  applyTheme(state.theme);
  applyFontSize(state.fontSize);
  applyViewMode(state.viewMode);
  updateBookmarkBadges();

  // 6. Fetch Articles
  loadArticles();
});
