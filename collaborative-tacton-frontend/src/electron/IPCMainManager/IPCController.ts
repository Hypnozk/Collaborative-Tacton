const { ipcMain, clipboard } = require('electron');
import fs from 'fs';
import { app, BrowserWindow, dialog } from "electron";
import { IPC_CHANNELS } from "./IPCChannels";
import DeviceManager from "../DeviceManager/DeviceManager"
import { KeyBoardButton, TactileTask } from "@/types/GeneralType";
import SettingManager from "../FileManager/SettingManager";
import { LoggingLevel } from "../FileManager/LoggingLevel";
import LoggingManager from "../FileManager/LoggingManager";

let _win: BrowserWindow;
let _settingManager: SettingManager;
let _loggingManager: LoggingManager;
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

/**
 * initiate listener for the renderer process
 */

ipcMain.on(IPC_CHANNELS.main.actuator, (event, actuator) => {
    _win.webContents.send(IPC_CHANNELS.renderer.actuator, actuator)
});

//change scan for the ble devices
ipcMain.on(IPC_CHANNELS.main.changeScan, (event, scanStatus: boolean) => {
    //console.log("recieved meesage to make Scan: " + scanStatus)
    if (scanStatus) {
        DeviceManager.startScan()
    } else {
        DeviceManager.stopScan()
    }
});

//connect with specific device
ipcMain.on(IPC_CHANNELS.main.connectDevice, (event, deviceID: string) => {
    //console.log("Starting Connection");
    DeviceManager.connectDevice(deviceID);
});

//disconnect with specific device
ipcMain.on(IPC_CHANNELS.main.disconnectDevice, () => {
    //console.log("Starting Discconnect");
    DeviceManager.disconnectDevice();
});

//controll the vibrotactile device
ipcMain.on(IPC_CHANNELS.main.executeTask, (event, taskList: TactileTask[]) => {
    //console.log("executeTask");
    DeviceManager.executeTask(taskList)
});

//copy roomName and adress 
ipcMain.on(IPC_CHANNELS.main.copyToClipBoard, (event, adress: string) => {
    //console.log("copyToClipBoard");
    clipboard.writeText(adress);
});

//read the current user configs and send it to renderer
ipcMain.on(IPC_CHANNELS.main.modifyUserConfig, (event, setting: { key: string, value: any }) => {
    //console.log("modifyUserConfig");
    _settingManager.sendSettings();
});

//save the user name in the config
ipcMain.on(IPC_CHANNELS.main.saveUserName, (event, userName: string) => {
    //console.log("saveUserName");
    _settingManager.updateUserName(userName);
});

//save one updated keyboard buttton
ipcMain.on(IPC_CHANNELS.main.saveKeyBoardButton, (event, button: KeyBoardButton) => {
    //console.log("saveKeyBoardButton");
    _settingManager.updateButton(button);
});

//log informations
ipcMain.on(IPC_CHANNELS.main.logMessageInfos, (event, payload: {
    level: LoggingLevel,
    type: string;
    startTimeStamp: number;
    endTimeStamp: number
}
) => {
    _loggingManager.writeLog(payload.level, payload.type, payload.endTimeStamp - payload.startTimeStamp);
});

//save one tacton as json in vtproto format
ipcMain.on(IPC_CHANNELS.main.saveTacton, async (event, payload: any) => {
    //console.log("saveKeyBoardButton");
    let file = await dialog.showSaveDialog(_win, {
        title: 'Download to File…',
        filters: [
            { name: 'Json', extensions: ['.json'] }
        ]
    });
    if (!file.canceled && file.filePath !== undefined) {
        fs.writeFile(file.filePath, JSON.stringify(payload), err => {
            if (err) {
                console.log(err);
            }
        })
    }
});

//generell function, which get called if on module want to communicate with the renderer
export function sendMessageToRenderer(channel: string, payload: any): void {
    _win.webContents.send(channel, payload)
}

//for internal use, get initiated at starting the application
export function setBrowserWindow(browserWindow: BrowserWindow) {
    _win = browserWindow;
    _loggingManager = new LoggingManager();

}

//for internal use, get initiated at starting the application
export function initSettingManager() {
    _settingManager = new SettingManager();

}