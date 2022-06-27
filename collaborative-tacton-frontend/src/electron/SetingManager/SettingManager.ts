import fs from 'fs';
const path = require('path');
import { app } from "electron";
import { initSettings } from './initSettings';
import { sendMessageToRenderer } from '../IPCMainManager/IPCController';
import { IPC_CHANNELS } from '../IPCMainManager/IPCChannels';

class SettingManager {
    readonly pathSettings: string;
    couldAccessFile: boolean;

    constructor() {
        const userDataPath = app.getPath('userData')
        this.pathSettings = path.join(userDataPath, 'configCollaborativeTacton.json');
        this.couldAccessFile = true;

        const fileExist = this.checkIfFileExist();
        if (fileExist == undefined)
            this.couldAccessFile = false;

        if (fileExist == false)
            this.initConfigFile();

        let data = undefined;
        if (this.couldAccessFile) {
            data = this.readSettings();
        }

        if (data == undefined)
            data = initSettings;

        sendMessageToRenderer(IPC_CHANNELS.renderer.initConfig, data);
    }

    checkIfFileExist() {
        let fileExist: Boolean | undefined = false;
        fs.stat(this.pathSettings, (err: NodeJS.ErrnoException | null, stats: fs.Stats) => {
            if (err) {
                if (err.code !== "ENOENT")
                    fileExist = undefined;

                return;
            }
            if (stats.isDirectory())
                return;

            fileExist = true;
        });
        return fileExist
    }

    initConfigFile() {
        try {
            fs.writeFileSync(this.pathSettings, JSON.stringify(initSettings));
        } catch (err) {
            console.log(err)
            this.couldAccessFile = false;
            return;
        }
    }

    readSettings() {
        try {
            const data = fs.readFileSync(this.pathSettings, { encoding: "utf8" });
            return JSON.parse(data);
        } catch (err) {
            this.couldAccessFile = false;
            console.log(err);
        }
    }

    sendSettings() {
        const data = this.readSettings();
        console.log(data);
    }
};

export default SettingManager