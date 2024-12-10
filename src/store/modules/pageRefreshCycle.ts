import { ref } from 'vue';

class PageRefreshCycle {
  min = 1;
  max = 16;
  cycle = ref(3);
  pages = {};
  private listeners: { [key: string]: ((...args: any[]) => void)[] } = {};

  getCycle(pageName: string): number {
    if (!this.pages[pageName]) return Number(localStorage.getItem(pageName)) || 3;
    return this.pages[pageName];
  }

  setCycle(pageName: string, val: number) {
    localStorage.setItem(pageName, String(val));
    this.cycle.value = val;
    this.pages[pageName] = val;
  }

  on(event: string, callback: (...args: any) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event: string, ...args: any[]) {
    if (this.listeners[event])
      this.listeners[event].forEach((callback) => {
        callback(...args);
      });
  }
  off() {
    for (const eventKey in this.listeners) {
      this.listeners[eventKey] = [];
    }
    return this;
  }
}

const cycle = new PageRefreshCycle();

export default cycle;
