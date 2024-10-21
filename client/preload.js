// preload.js
import { contextBridge, ipcRenderer } from "electron";

// Expose process and platform safely to the renderer process
contextBridge.exposeInMainWorld("electron", {
  process: {
    // eslint-disable-next-line no-undef
    platform: process.platform,
    // eslint-disable-next-line no-undef
    versions: process.versions, // Expose version info like Node.js, Chrome, etc.
  },
  // Example: Expose functions for sending messages to and from the main process
  send: (channel, data) => {
    const validChannels = ["toMain"]; // Define valid channels for security
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ["fromMain"]; // Define valid channels for security
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
