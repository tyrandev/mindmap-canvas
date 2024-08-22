export default class OSUtil {
  static getOS() {
    const userAgent =
      navigator.userAgent || navigator.userAgentData?.platform || "Unknown OS";
    const osPatterns = {
      Windows: /Windows NT/i,
      MacOS: /Macintosh|MacIntel|MacPPC|Mac68K/i,
      iOS: /iPhone|iPad|iPod/i,
      Android: /Android/i,
      Linux: /Linux/i,
    };

    for (let [os, pattern] of Object.entries(osPatterns)) {
      if (pattern.test(userAgent)) {
        return os;
      }
    }

    return "Unknown OS";
  }

  static isWindows() {
    return OSUtil.getOS() === "Windows";
  }

  static isMacOS() {
    return OSUtil.getOS() === "MacOS";
  }

  static isLinux() {
    return OSUtil.getOS() === "Linux";
  }

  static isAndroid() {
    return OSUtil.getOS() === "Android";
  }

  static isIOS() {
    return OSUtil.getOS() === "iOS";
  }

  static isMobile() {
    return OSUtil.isAndroid() || OSUtil.isIOS();
  }
}
