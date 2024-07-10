export default class MillisecondTimer {
  constructor() {
    this.startTime = 0;
    this.lastTime = 0;
    this.currentTime = 0;
    this.elapsedTime = 0;
  }

  start() {
    this.startTime = performance.now();
    this.lastTime = this.startTime;
  }

  measure() {
    this.currentTime = performance.now();
    this.elapsedTime = this.currentTime - this.startTime;
    return this.elapsedTime;
  }

  reset() {
    this.startTime = 0;
    this.lastTime = 0;
    this.currentTime = 0;
    this.elapsedTime = 0;
  }

  resetIfOneSecondPassed() {
    this.currentTime = performance.now();
    if (this.currentTime - this.lastTime >= 1000) {
      this.lastTime = this.currentTime;
      this.startTime = this.currentTime;
    }
  }
}
