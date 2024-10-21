// electron.js

import { app, BrowserWindow } from "electron";
import { join } from "path";

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false, // Enable Node.js integration
      contextIsolation: true, // Disable context isolation for simplicity
    },
    icon: join(__dirname, "assets", "bunagram.ico"),
  });

  // Load the React app
  win.loadFile(join(__dirname, "dist", "index.html"));
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
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
