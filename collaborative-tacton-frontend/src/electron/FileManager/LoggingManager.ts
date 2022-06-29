import { mdiContentSaveSettingsOutline } from "@mdi/js";
import { app } from "electron";
import fs from 'fs';
import path from 'path';
import { LoggingLevel } from "./LoggingLevel";
const os = require("os");

class LoggingManager {
    readonly pathSettings: string;
    readonly errorReading: number = 0;

    constructor() {
        const userDataPath = app.getPath('userData')
        const date = new Date();

        this.pathSettings = path.join(userDataPath, "logging", `log_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}.txt`);
        const readSuccessfully = this.checkIfFileExist();

        if (readSuccessfully == false)
            this.initLoggingFile();

    }

    private initLoggingFile() {
        try {
            const userDataPath = app.getPath('userData')
            const directoryPath = path.join(userDataPath, "logging");
            if (!fs.existsSync(directoryPath))
                fs.mkdirSync(directoryPath);

            fs.writeFileSync(this.pathSettings, "");
        } catch (err) {
            console.log(err);
        }
    }

    private checkIfFileExist(): boolean {
        try {
            fs.readFileSync(this.pathSettings, { encoding: "utf8" });
            return true;
        } catch (err: any) {
            if (err.code !== "ENOENT") {
                console.log("err");
                console.log(err);
            }
            return false;
        }
    }


    writeLog(level: LoggingLevel, type: string, latency: number) {
        fs.appendFile(this.pathSettings, JSON.stringify({ type: type, latency: latency+"ms", level: level }) + "\r\n", err => {
            if (err) {
                console.log(err);
            }
        })
    }


}



export default LoggingManager