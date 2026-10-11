/* ============================================
   Clash of Armored - Save System
   ============================================ */
class SaveSystem {
  constructor(cache) {
    this.cache = cache;
    this.SLOT_KEY = 'save_slot';
    this.AUTO_KEY = 'save_auto';
  }

  // حفظ في خانة محددة (1-3)
  save(slot, data) {
    const saveData = {
      ...data,
      savedAt: Date.now(),
      version: '0.1.0'
    };
    this.cache.set(this.SLOT_KEY + '_' + slot, saveData);
    return true;
  }

  // تحميل من خانة
  load(slot) {
    return this.cache.get(this.SLOT_KEY + '_' + slot, null);
  }

  // حفظ تلقائي
  autoSave(data) {
    this.cache.set(this.AUTO_KEY, {
      ...data,
      savedAt: Date.now()
    });
  }

  loadAutoSave() {
    return this.cache.get(this.AUTO_KEY, null);
  }

  // حذف خانة
  delete(slot) {
    this.cache.remove(this.SLOT_KEY + '_' + slot);
  }

  // معلومات كل الخانات
  listSlots() {
    return [1, 2, 3].map(slot => {
      const data = this.load(slot);
      return {
        slot,
        empty: !data,
        savedAt: data ? data.savedAt : null,
        info: data || null
      };
    });
  }
}

window.SaveSystem = SaveSystem;
