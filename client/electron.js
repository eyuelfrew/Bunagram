// electron.js
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Load the preload script
      nodeIntegration: false, // Disable Node integration for security
      contextIsolation: true, // Keep context isolation for security
    },
    icon: path.join(__dirname, "assets", "bunagram.ico"), // Adjust the path to your icon
  });

  // Load the React app (Ensure Vite is running in dev mode)
  const appURL = new URL(
    path.join(__dirname, "dist", "index.html"),
    "file:"
  ).toString();
  win.loadURL(appURL);

  win.webContents.openDevTools(); // Open Developer Tools
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  // eslint-disable-next-line no-undef
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Re-create a window in the app when the dock icon is clicked (macOS)
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
