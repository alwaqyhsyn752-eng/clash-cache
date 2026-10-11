/* ============================================
   Clash of Armored - Resource Loader with Cache
   ============================================ */
class ResourceLoader {
  constructor(cache) {
    this.cache = cache;
    this.loaded = {};
  }

  // تحميل صورة مع التخزين
  loadImage(name, url) {
    return new Promise((resolve, reject) => {
      // هل موجودة في الذاكرة؟
      if (this.loaded[name]) {
        return resolve(this.loaded[name]);
      }

      const img = new Image();
      img.onload = () => {
        this.loaded[name] = img;
        resolve(img);
      };
      img.onerror = () => reject(new Error('Failed to load: ' + url));
      img.src = url;
    });
  }

  // تحميل ملف JSON مع cache
  async loadJSON(name, url) {
    const cacheKey = 'json_' + name;

    // من الكاش أولاً
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(url);
      const data = await res.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (e) {
      console.warn('JSON load failed:', url, e);
      return null;
    }
  }

  // حفظ بيانات خريطة
  saveMapData(mapId, data) {
    this.cache.set('map_' + mapId, data);
  }

  loadMapData(mapId) {
    return this.cache.get('map_' + mapId);
  }
}

window.ResourceLoader = ResourceLoader;
