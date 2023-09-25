
// firefox is the best UA to use for compatibility across most sites
// I found that if I use Chrome or Safari UAs, websites will behave differently

export const deskUA_Mac_Edge = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.40"
export const deskUA_Mac_Chrome = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
export const deskUA_Mac_FF = "Mozilla/5.0 (Macintosh; Intel Mac OS X 12.6; rv:105.0) Gecko/20100101 Firefox/105.0";

export const mobUA_iOSEdge = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 EdgiOS/117.2045.33 Mobile/15E148 Safari/605.1.15"
export const mobUA_iOSFF = "Mozilla/5.0 (iPhone; CPU iPhone OS 12_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/105.0 Mobile/15E148 Safari/605.1.15";
export const mobUA_AndroidFF = "Mozilla/5.0 (Android 13; Mobile; rv:68.0) Gecko/68.0 Firefox/105.0";
export const mobUA_iOSSafari = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";

export const chromeUAData = {
  "brands": [
    {
      "brand": "Chromium",
      "version": "116"
    },
    {
      "brand": "Not)A;Brand",
      "version": "24"
    },
    {
      "brand": "Google Chrome",
      "version": "116"
    }
  ],
  "mobile": false,
  "platform": "macOS"
};

export const edgeUAData = {
  "brands": [
    {
      "brand": "Microsoft Edge",
      "version": "117"
    },
    {
      "brand": "Not;A=Brand",
      "version": "8"
    },
    {
      "brand": "Chromium",
      "version": "117"
    }
  ],
  "mobile": false,
  "platform": "macOS"
} 

export const LANG = "en-US";

export const deskPLAT_Windows = "Win64";
export const deskPLAT_Mac = "MacIntel";
export const mobPLAT_Android = "Android";
export const mobPLAT_iOS = "iPhone";

export const VEND_Safari = "Apple Computer, Inc.";
export const VEND_Chrome = "Google Inc.";
export const VEND_FF = "";

// probably should make this a navigator export
export const ua = {
  desktop: {
    mac: {
      ff: deskUA_Mac_FF,
      edge: deskUA_Mac_Edge,
      chrome: deskUA_Mac_Chrome,
      platform: deskPLAT_Mac
    },
    windows: {
      platform: deskPLAT_Windows
    }
  },
  mobile: {
    iphone: {
      edge: mobUA_iOSEdge,
      ff: mobUA_iOSFF,
      safari: mobUA_iOSSafari,
      platform: mobPLAT_iOS
    },
    android: {
      ff: mobUA_AndroidFF,
      platform: mobPLAT_Android
    }
  }
};
