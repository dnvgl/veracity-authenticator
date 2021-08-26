const os = require("os");
const fs = require("fs");
const path = require("path");
const logger = require("electron-log");
const { contextBridge, ipcRenderer } = require("electron");
const { getLicenseFileDirectories } = require("../src/license-file");

contextBridge.exposeInMainWorld("electron", {
  getMacAddress: () => os.networkInterfaces(),
  getToken: () => window.process.argv.slice(-1)[0],
  log: (m) => ipcRenderer.send("log", m),
  error: (m) => ipcRenderer.send("error", m),
  writeLicenseFile: (filename, data) => {
    let directories = getLicenseFileDirectories(
      process.env.DNVSLM_LICENSE_FILE
    );

    directories.forEach((directory) => {
      if (!fs.existsSync(directory)) {
        try {
          fs.mkdirSync(directory, { recursive: true });
        } catch (e) {
          ipcRenderer.send("error", `unable to create directory, ${e}`);
        }
      }

      try {
        const ext = path.extname(filename);
        const basename = path.basename(filename, ext);
        let loc = path.join(directory, `${basename}${ext}`);

        let i = 0;
        while (fs.existsSync(loc)) {
          loc = path.join(directory, `${basename}.${++i}${ext}`);
        }

        fs.writeFileSync(loc, data);
      } catch (e) {
        ipcRenderer.send("error", `unable to write file, ${e}`);
      }
    });
  },
});
