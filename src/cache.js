/* ============================================
   Clash of Armored - Cache System
   ============================================ */
class CoaCache {
  constructor(prefix = 'coa_') {
    this.prefix = prefix;
    this.memory = {}; // نسخة في الذاكرة للسرعة
  }

  // حفظ قيمة
  set(key, value) {
    const k = this.prefix + key;
    this.memory[k] = value;
    try {
      localStorage.setItem(k, JSON.stringify({
        v: value,
        t: Date.now()
      }));
      return true;
    } catch (e) {
      console.warn('Cache set failed:', e);
      return false;
    }
  }

  // قراءة قيمة
  get(key, defaultValue = null) {
    const k = this.prefix + key;
    if (this.memory[k] !== undefined) return this.memory[k];

    try {
      const raw = localStorage.getItem(k);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      this.memory[k] = parsed.v;
      return parsed.v;
    } catch (e) {
      return defaultValue;
    }
  }

  // حذف مفتاح
  remove(key) {
    const k = this.prefix + key;
    delete this.memory[k];
    localStorage.removeItem(k);
  }

  // مسح كل شيء
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => localStorage.removeItem(k));
    this.memory = {};
  }

  // قائمة المفاتيح
  keys() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .map(k => k.replace(this.prefix, ''));
  }

  // حجم التخزين المستخدم (بالبايت)
  size() {
    let total = 0;
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => total += (localStorage[k] || '').length);
    return total;
  }
}

window.CoaCache = CoaCache;
