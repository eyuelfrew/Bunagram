import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let splashWindow;

function createSplashScreen() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  });

  splashWindow.loadFile(join(__dirname, "dist/splash.html"));

  splashWindow.on("closed", () => {
    splashWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "dist/index.html"));

    // Prevent DevTools from opening in production
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.openDevTools();
    });
  }

  mainWindow.once("ready-to-show", () => {
    // Set a minimum delay of 5 seconds before showing the main window
    setTimeout(() => {
      if (splashWindow) splashWindow.close();
      mainWindow.show();
    }, 5000); // 5000 ms = 5 seconds
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createSplashScreen();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
