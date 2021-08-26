const { BrowserWindow, Menu, dialog, app } = require("electron");
const authService = require("./auth-service");
const { createAppWindow } = require("./app-process");

let win = null;

function createAuthWindow() {
  destroyAuthWin();

  win = new BrowserWindow({
    title: "Log in",
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          click() {
            win.close();
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click() {
            dialog.showMessageBox({
              title: "About",
              message: `You are running version : ${app.getVersion()}`,
            });
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  win.loadURL(authService.getAuthenticationURL());

  const contents = win.webContents;

  contents.on("did-fail-load", (e) => {
    //win.webContents.openDevTools();
    createAppWindow();
    destroyAuthWin();
  });

  const session = win.webContents.session;
  const webRequest = session.webRequest;

  const filter = {
    urls: ["http://localhost/callback*"],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    await authService.loadTokens(url);
    if (authService.getAccessToken() === "Unauthorized") {
      createAppWindow();
    }
    return destroyAuthWin();
  });

  win.on("authenticated", () => {
    destroyAuthWin();
  });

  win.on("closed", () => {
    win = null;
  });
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

function createLogoutWindow() {
  const logoutWindow = new BrowserWindow({
    show: false,
  });

  logoutWindow.loadURL(authService.getLogOutUrl());

  logoutWindow.on("ready-to-show", async () => {
    logoutWindow.close();
    await authService.logout();
  });
}

module.exports = {
  createAuthWindow,
  createLogoutWindow,
};
