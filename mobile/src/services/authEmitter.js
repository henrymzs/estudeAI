const handlers = new Set();

export const authEmitter = {
  on(fn) {
    handlers.add(fn);
  },
  off(fn) {
    handlers.delete(fn);
  },
  emit(...args) {
    for (const fn of Array.from(handlers)) {
      try { fn(...args); } catch (e) { console.error('authEmitter handler error', e); }
    }
  }
};