"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const Constants_1 = require("./Constants.cjs");
class Utilities {
  static GetEdge() {
  switch (process.platform) {
    case 'win32':
    return this.GetAnyEdgeWindows();
    case 'darwin':
    return this.GetEdgeAnyDarwin();
    case 'linux':
    return this.GetEdgeAnyLinux();
    default:
    return null;
  }
  }
  static GetLinuxBin(command) {
    // Only run these checks on Linux
    if (process.platform !== 'linux') {
      return null;
    }
    // Need to check if check for other paths is required
    const paths = [
      '/usr/local/sbin',
      '/usr/local/bin',
      '/usr/sbin',
      '/usr/bin',
      '/sbin',
      '/bin',
    ];
    let edgeBIN = '/usr/bin/' + command;
    try {
      fs_1.default.accessSync(edgeBIN, fs_1.default.constants.X_OK);
      return command;
    }
    catch (e) { }
    return null;
  }
  static GetEdgeDarwin(defaultPath) {
    if (process.platform !== 'darwin') {
      return null;
    }
    let darwinPaths = [
      path_1.default.join(process.env.HOME || '', defaultPath),
      defaultPath,
    ];
    for (let i = 0; i < darwinPaths.length; i++) {
      try {
        fs_1.default.accessSync(darwinPaths[i]);
        return darwinPaths[i];
      }
      catch { }
    }
    return null;
  }
  // Return location of Edge.exe file for a given directory.
  static GetEdgeExe(edgeDirName) {
    // Only run these checks on win32
    if (process.platform !== 'win32') {
      return null;
    }
    let suffix = '\\Microsoft\\' + edgeDirName + '\\Application\\msedge.exe';
    let prefixes = [
      process.env["PROGRAMFILES(X86)"],
      process.env.PROGRAMFILES,
      process.env.LOCALAPPDATA,
      process.env.ProgramW6432,
    ];
    let edgePath = null;
    for (let i = 0; i < prefixes.length; i++) {
      try {
        let windowsEdgeDirectory = path_1.default.join(prefixes[i] || '', suffix);
        fs_1.default.accessSync(windowsEdgeDirectory);
        edgePath = windowsEdgeDirectory;
        break;
      }
      catch (e) { }
    }
    return edgePath;
  }
  static isJSFlags(flag) {
    return flag.indexOf('--js-flags=') === 0;
  }
  static sanitizeJSFlags(flag) {
    let test = /--js-flags=(['"])/.exec(flag);
    if (!test) {
      return flag;
    }
    let escapeChar = test[1];
    let endExp = new RegExp(escapeChar + '$');
    let startExp = new RegExp('--js-flags=' + escapeChar);
    return flag.replace(startExp, '--js-flags=').replace(endExp, '');
  }
  static GetEdgeAnyLinux() {
    return (this.GetLinuxBin(Constants_1.LinuxConstants.EdgeCanary) ||
      this.GetLinuxBin(Constants_1.LinuxConstants.EdgeDev) ||
      this.GetLinuxBin(Constants_1.LinuxConstants.EdgeBeta) ||
      this.GetLinuxBin(Constants_1.LinuxConstants.Edge));
  }
  static GetEdgeAnyDarwin() {
    return (this.GetEdgeDarwin(`/Applications/${Constants_1.DarwinConstants.EdgeCanary}.app/Contents/MacOS/${Constants_1.DarwinConstants.EdgeCanary}`) ||
      this.GetEdgeDarwin(`/Applications/${Constants_1.DarwinConstants.EdgeDev}.app/Contents/MacOS/${Constants_1.DarwinConstants.EdgeDev}`) ||
      this.GetEdgeDarwin(`/Applications/${Constants_1.DarwinConstants.EdgeBeta}.app/Contents/MacOS/${Constants_1.DarwinConstants.EdgeBeta}`) ||
      this.GetEdgeDarwin(`/Applications/${Constants_1.DarwinConstants.Edge}.app/Contents/MacOS/${Constants_1.DarwinConstants.Edge}`));
  }
  static GetAnyEdgeWindows() {
    return (this.GetEdgeExe(Constants_1.WindowsConstants.EdgeCanary) ||
      this.GetEdgeExe(Constants_1.WindowsConstants.EdgeDev) ||
      this.GetEdgeExe(Constants_1.WindowsConstants.EdgeBeta) ||
      this.GetEdgeExe(Constants_1.WindowsConstants.Edge));
  }
}
exports.default = Utilities;
