export default class BrowserUtil {
  static getBrowser() {
    const userAgent =
      navigator.userAgent || navigator.userAgentData?.ua || "Unknown Browser";
    let browser = "Unknown Browser";

    if (userAgent.includes("Firefox")) {
      browser = "Firefox";
    } else if (userAgent.includes("Edg")) {
      browser = "Microsoft Edge";
    } else if (
      userAgent.includes("Chrome") &&
      !userAgent.includes("Edg") &&
      !userAgent.includes("OPR") &&
      !userAgent.includes("Chromium")
    ) {
      browser = "Chrome";
    } else if (userAgent.includes("Chromium")) {
      browser = "Chromium";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = "Safari";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      browser = "Opera";
    } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
      browser = "Internet Explorer";
    }

    return browser;
  }

  static isChrome() {
    return BrowserUtil.getBrowser() === "Chrome";
  }

  static isChromium() {
    return BrowserUtil.getBrowser() === "Chromium";
  }

  static isFirefox() {
    return BrowserUtil.getBrowser() === "Firefox";
  }

  static isSafari() {
    return BrowserUtil.getBrowser() === "Safari";
  }

  static isEdge() {
    return BrowserUtil.getBrowser() === "Microsoft Edge";
  }

  static isOpera() {
    return BrowserUtil.getBrowser() === "Opera";
  }

  static isIE() {
    return BrowserUtil.getBrowser() === "Internet Explorer";
  }
}
