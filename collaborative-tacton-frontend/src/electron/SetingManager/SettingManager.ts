import fs from 'fs';
const path = require('path');
const util = require('util');
import { app } from "electron";
import { initSettings, CustomSettings } from './initSettings';
import { sendMessageToRenderer } from '../IPCMainManager/IPCController';
import { IPC_CHANNELS } from '../IPCMainManager/IPCChannels';
import { KeyBoardButton } from '@/types/GeneralType';

class SettingManager {
    readonly pathSettings: string;
    customSettings: CustomSettings;
    readonly errorReading: number = 0;

    constructor() {
        const userDataPath = app.getPath('userData')
        this.pathSettings = path.join(userDataPath, 'configCollaborativeTacton.json');
        this.customSettings = initSettings;
        this.sendSettings()

    }

    sendSettings() {
        let readSuccessfully = this.readSettings();

        if (readSuccessfully == false)
            this.initConfigFile();

        sendMessageToRenderer(IPC_CHANNELS.renderer.initConfig, this.customSettings);
    }


    private initConfigFile() {
        try {
            fs.writeFileSync(this.pathSettings, JSON.stringify(initSettings));
        } catch (err) {
            console.log(err);
        }
    }

    private readSettings(): boolean {
        try {
            const data = fs.readFileSync(this.pathSettings, { encoding: "utf8" });
            this.customSettings = JSON.parse(data);
            return true;
        } catch (err: any) {
            if (err.code !== "ENOENT") {
                console.log("err");
                console.log(err);
            }
            return false;
        }
    }

    private writeFile() {
        fs.writeFile(this.pathSettings, JSON.stringify(this.customSettings), err => {
            if (err) {
                console.log(err);
            }
        })
    }

    updateUserName(userName: string) {
        this.customSettings.userName = userName;
        this.writeFile();
    }


    updateButton(button: KeyBoardButton) {
        const index = this.customSettings.buttons.findIndex(buttonSettings => buttonSettings.i == button.i);
        if (index == -1) {
            this.customSettings.buttons.push(button);
        } else {
            this.customSettings.buttons[index] = button;
        }

        this.writeFile();
    }


};

export default SettingManager