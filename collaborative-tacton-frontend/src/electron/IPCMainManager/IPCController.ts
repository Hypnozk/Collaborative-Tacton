const { ipcMain, clipboard } = require('electron');

import { app, BrowserWindow } from "electron";
import { IPC_CHANNELS } from "./IPCChannels";
import DeviceManager from "../DeviceManager/DeviceManager"
import { KeyBoardButton, TactileTask } from "@/types/GeneralType";
import SettingManager from "../SetingManager/SettingManager";
let _win: BrowserWindow;
let _settingManager: SettingManager;
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
    //console.log("recieved meesage to make Scan: " + scanStatus)
    if (scanStatus) {
        DeviceManager.startScan()
    } else {
        DeviceManager.stopScan()
    }
});

ipcMain.on(IPC_CHANNELS.main.connectDevice, (event, deviceID: string) => {
    //console.log("Starting Connection");
    DeviceManager.connectDevice(deviceID);
});

ipcMain.on(IPC_CHANNELS.main.disconnectDevice, () => {
    //console.log("Starting Discconnect");
    DeviceManager.disconnectDevice();
});

ipcMain.on(IPC_CHANNELS.main.executeTask, (event, taskList: TactileTask[]) => {
    //console.log("executeTask");
    DeviceManager.executeTask(taskList)
});

ipcMain.on(IPC_CHANNELS.main.copyToClipBoard, (event, adress: string) => {
    //console.log("copyToClipBoard");
    clipboard.writeText(adress);
});

ipcMain.on(IPC_CHANNELS.main.modifyUserConfig, (event, setting: { key: string, value: any }) => {
    //console.log("modifyUserConfig");
    _settingManager.sendSettings();
});

ipcMain.on(IPC_CHANNELS.main.saveUserName, (event, userName: string) => {
    //console.log("saveUserName");
    _settingManager.updateUserName(userName);
});

ipcMain.on(IPC_CHANNELS.main.saveKeyBoardButton, (event, button: KeyBoardButton) => {
    //console.log("saveKeyBoardButton");
    _settingManager.updateButton(button);
});

export function sendMessageToRenderer(channel: string, payload: any): void {
    _win.webContents.send(channel, payload)
}

export function setBrowserWindow(browserWindow: BrowserWindow) {
    _win = browserWindow;

}

export function initSettingManager(){
    _settingManager = new SettingManager();
}