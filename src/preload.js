const os = require("os");
const fs = require("fs");
const path = require("path");
const logger = require("electron-log");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getToken: () => window.process.argv.slice(-1)[0],
  log: (m) => ipcRenderer.send("log", m),
  error: (m) => ipcRenderer.send("error", m),
});
