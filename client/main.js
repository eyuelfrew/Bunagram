import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      // Enable context isolation for security
      contextIsolation: true,
      enableRemoteModule: false, // For security, avoid using this unless needed
      nodeIntegration: false, // Only use preload.js for exposing APIs
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173"); // Vite dev server URL
    mainWindow.webContents.openDevTools();
  } else {
    console.log("Production Environemnt!!");
    mainWindow.loadFile(join(__dirname, "dist/index.html")); // Path to your Vite build files
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
