class ScriptLoader {
  constructor() {
    if (ScriptLoader.instance) {
      return ScriptLoader.instance;
    }
    ScriptLoader.instance = this;
    this.loadedScripts = new Set();
    return this;
  }

  loadScript(src) {
    if (this.loadedScripts.has(src)) {
      return Promise.resolve(src);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        this.loadedScripts.add(src);
        resolve(src);
      };
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(script);
    });
  }

  loadScripts(scripts) {
    return Promise.all(scripts.map((src) => this.loadScript(src)));
  }
}

const instance = new ScriptLoader();
Object.freeze(instance);

export default instance;
