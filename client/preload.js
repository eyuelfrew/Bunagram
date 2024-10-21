// preload.js

const { contextBridge, ipcRenderer } = require("electron");

// Expose the API to the renderer process
contextBridge.exposeInMainWorld("myApi", {
  sendMessage: (message) => ipcRenderer.send("message", message),
  onMessage: (callback) =>
    ipcRenderer.on("message", (event, message) => callback(message)),
});
