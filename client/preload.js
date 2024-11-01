const { contextBridge, ipcRenderer } = require("electron");

// Exposing a limited set of APIs to the renderer
contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (channel, data) => {
    ipcRenderer.send(channel, data); // Send messages to the main process
  },
  receiveMessage: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args)); // Receive messages from the main process
  },
});
