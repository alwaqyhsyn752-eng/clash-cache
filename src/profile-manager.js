/* ============================================
   Clash of Armored - Profile Manager
   إدارة حساب اللاعب والبروفايل محلياً
   ============================================ */
class ProfileManager {
  constructor(cache) {
    this.cache = cache;
    this.KEY = 'player_profile';
    this.SESSION_KEY = 'player_session';
  }

  /* ===== إنشاء بروفايل جديد ===== */
  create({ username, email, method = 'email', avatar = 'C' }) {
    if (!username || username.trim().length < 2) {
      return { ok: false, error: 'الاسم قصير جداً' };
    }

    const profile = {
      id: 'p_' + Date.now(),
      username: username.trim(),
      email: email || 'guest@coa.local',
      method: method,           // 'email' | 'google' | 'guest'
      avatar: avatar,
      level: 1,
      xp: 0,
      xpMax: 1000,
      gold: 1500,
      gems: 25,
      wins: 0,
      kills: 0,
      matches: 0,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      settings: {
        volume: 70,
        music: 50,
        sensitivity: 5,
        sound: true,
        vibration: true
      }
    };

    this.cache.set(this.KEY, profile);
    this.cache.set(this.SESSION_KEY, profile.id);

    return { ok: true, profile };
  }

  /* ===== تحميل البروفايل الحالي ===== */
  get() {
    return this.cache.get(this.KEY, null);
  }

  /* ===== هل يوجد بروفايل محفوظ؟ ===== */
  exists() {
    const p = this.get();
    return p && p.id;
  }

  /* ===== تسجيل الدخول (تحميل موجود) ===== */
  login() {
    const p = this.get();
    if (!p) return { ok: false, error: 'لا يوجد حساب' };
    p.lastLogin = Date.now();
    this.cache.set(this.KEY, p);
    this.cache.set(this.SESSION_KEY, p.id);
    return { ok: true, profile: p };
  }

  /* ===== تسجيل الخروج ===== */
  logout() {
    this.cache.remove(this.SESSION_KEY);
  }

  /* ===== تحديث حقول ===== */
  update(fields) {
    const p = this.get();
    if (!p) return { ok: false };
    Object.assign(p, fields);
    this.cache.set(this.KEY, p);
    return { ok: true, profile: p };
  }

  /* ===== إضافة ذهب/جواهر ===== */
  addGold(amount) {
    const p = this.get();
    if (!p) return;
    p.gold = Math.max(0, p.gold + amount);
    this.cache.set(this.KEY, p);
  }

  addGems(amount) {
    const p = this.get();
    if (!p) return;
    p.gems = Math.max(0, p.gems + amount);
    this.cache.set(this.KEY, p);
  }

  /* ===== إضافة XP مع رفع المستوى ===== */
  addXp(amount) {
    const p = this.get();
    if (!p) return;
    p.xp += amount;
    while (p.xp >= p.xpMax) {
      p.xp -= p.xpMax;
      p.level++;
      p.xpMax = Math.floor(p.xpMax * 1.25);
      p.gold += 100;
      p.gems += 5;
    }
    this.cache.set(this.KEY, p);
    return p;
  }

  /* ===== تسجيل نتيجة مباراة ===== */
  recordMatch({ won, kills, placement }) {
    const p = this.get();
    if (!p) return;
    p.matches++;
    p.kills += kills;
    if (won) p.wins++;
    // مكافآت
    const goldReward = won ? 300 : 50 + kills * 20;
    const xpReward = won ? 200 : 30 + kills * 15;
    this.addGold(goldReward);
    this.addXp(xpReward);
    return { goldReward, xpReward };
  }

  /* ===== حذف الحساب ===== */
  delete() {
    this.cache.remove(this.KEY);
    this.cache.remove(this.SESSION_KEY);
  }
}

window.ProfileManager = ProfileManager;
