const { ipcMain } = require('electron');
import { BrowserWindow } from "electron";
import { IPC_CHANNELS } from "./IPCChannels";
let _win: BrowserWindow;
/*
to recieve messages from the renderer process
--------------------------------------------------------------
ipcMain.on("tactile-jam.send.output.scanning", (event, scanning) => {
    console.log(scanning);
    //send reply back
      event.reply('tactile-jam.receive', 'pong')
  });

-------------------------------------------------------
*/

ipcMain.on(IPC_CHANNELS.send.actuator, (event, actuator) => {
    console.log("User pressed " + actuator)
    _win.webContents.send(IPC_CHANNELS.receive.actuator, actuator)
});

/*
to send directly messages to the renderer process
--------------------------------------------------------------
electronCache.getBrowserWindow().webContents.send('tactile-jam.receive', 'pong')
---function to send informations to the renderer
*/


export function setBrowserWindow(browserWindow: BrowserWindow) {
    _win = browserWindow;
};