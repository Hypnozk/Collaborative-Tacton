const { ipcMain } = require('electron');
import { BrowserWindow } from "electron";
import { IPC_CHANNELS } from "./IPCChannels";
import DeviceManager from "../DeviceManager/DeviceManager"
import { TactileTask } from "@/types/GeneralType";
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

/*
to send directly messages to the renderer process
--------------------------------------------------------------
electronCache.getBrowserWindow().webContents.send('tactile-jam.receive', 'pong')
---function to send informations to the renderer
*/

ipcMain.on(IPC_CHANNELS.main.actuator, (event, actuator) => {
    console.log("User pressed " + actuator)
    _win.webContents.send(IPC_CHANNELS.renderer.actuator, actuator)
});

ipcMain.on(IPC_CHANNELS.main.changeScan, (event, scanStatus: boolean) => {
    console.log("recieved meesage to make Scan: " + scanStatus)
    if (scanStatus) {
        DeviceManager.startScan()
    } else {
        DeviceManager.stopScan()
    }
});

ipcMain.on(IPC_CHANNELS.main.connectDevice, (event, deviceID: string) => {
    console.log("Starting Connection");
    DeviceManager.connectDevice(deviceID);
});

ipcMain.on(IPC_CHANNELS.main.disconnectDevice, () => {
    console.log("Starting Discconnect");
    DeviceManager.disconnectDevice();
});

ipcMain.on(IPC_CHANNELS.main.executeTask, (event, task: TactileTask) => {
    console.log("Starting Discconnect");
    DeviceManager.executeTask(task)
});


export function sendMessageToRenderer(channel: string, payload: any): void {
    _win.webContents.send(channel, payload)
}

export function setBrowserWindow(browserWindow: BrowserWindow) {
    _win = browserWindow;
}