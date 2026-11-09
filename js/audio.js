/**
 * Vietnamese Text-To-Speech (TTS) & Radio Service
 */

class AudioRadioService {
  constructor() {
    this.isPlaying = false;
    this.currentMode = null; // 'radio' | 'article'
    this.onStateChangeCallbacks = [];
  }

  onStateChange(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  notifyState(isPlaying, mode) {
    this.isPlaying = isPlaying;
    this.currentMode = mode;
    this.onStateChangeCallbacks.forEach((cb) => cb({ isPlaying, mode }));
  }

  getVietnameseVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN')) || null;
  }

  stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.notifyState(false, null);
  }

  playArticle(article) {
    if (!window.speechSynthesis) {
      alert('Trình duyệt của bạn chưa hỗ trợ chức năng đọc văn bản âm thanh.');
      return;
    }

    if (this.isPlaying && this.currentMode === 'article') {
      this.stop();
      return;
    }

    this.stop();

    const title = article.title || '';
    const desc = article.description || '';
    const text = `Bài báo: ${title}. ${desc}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;

    const voice = this.getVietnameseVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => this.notifyState(false, null);
    utterance.onerror = () => this.notifyState(false, null);

    window.speechSynthesis.speak(utterance);
    this.notifyState(true, 'article');
  }

  playRadio(articles) {
    if (!window.speechSynthesis) {
      alert('Trình duyệt của bạn chưa hỗ trợ chức năng phát Radio.');
      return;
    }

    if (this.isPlaying && this.currentMode === 'radio') {
      this.stop();
      return;
    }

    this.stop();

    const topItems = articles.slice(0, 3);
    if (topItems.length === 0) return;

    let radioScript = `Chào mừng quý thính giả đến với Bản Tin Radio Thời Báo Việt. Sau đây là các tin tức nổi bật. `;
    topItems.forEach((item, index) => {
      radioScript += `Tin số ${index + 1}: ${item.title}. ${item.description || ''} `;
    });
    radioScript += `Bản tin Radio điểm nhanh 60 giây đến đây là kết thúc. Kính chúc quý thính giả một ngày tốt lành!`;

    const utterance = new SpeechSynthesisUtterance(radioScript);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;

    const voice = this.getVietnameseVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => this.notifyState(false, null);
    utterance.onerror = () => this.notifyState(false, null);

    window.speechSynthesis.speak(utterance);
    this.notifyState(true, 'radio');
  }
}

window.audioRadioService = new AudioRadioService();
