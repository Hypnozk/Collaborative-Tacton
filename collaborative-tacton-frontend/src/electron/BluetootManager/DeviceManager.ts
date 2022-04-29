import noble from "@abandonware/noble";
import { WS_DEVICE_DISPLAY, WS_DEVICE_INFO } from "../websocket/calls";

const hm10Service = {
    service: {
        uuid: "5eb8eec2b92d4dca901c3bc3b69936e6",
        callbacks: [
            (service: any) => {
                service.once("characteristicsDiscover", (characteristic: any) => {
                    console.log(
                        "[HM10 Service] Test Callback, characteristic Discovered!"
                    );
                });
            },
        ],
    },
    characteristics: {
        writeBuffer: {
            uuid: "0000ffe100001000800000805f9b34fb",
        },
        readBuffer: {
            uuid: "00ee4dd0b68d459fb67dbd6ea3297dd0",
            callbacks: [
                (characteristic: any) => {
                    characteristic.notify(true);
                    characteristic.on("data", (state: any) => {
                        // console.log(state);
                        if (state.readInt8(1) === 0) {
                            console.log(
                                "[HM10 BLE Service] Received State update from peripheral"
                            );
                            /**
                            if (webSocketServer != null) {
                                webSocketServer.broadcastData(
                                    WS_SIMPLE_TACTON.tactonUpdatePlaybackState,
                                    state.readInt8(2)
                                );
                            }
                             */
                        }
                    });
                },
            ],
        },
    },
};
const pwmService = {
    service: { uuid: "f20913f7faa84f7b8d21f932d63af743" },
};
const tactileDisplayService = {
    service: { uuid: "f33c00018ebf4c9c83ecbfff479a930b" },
    characteristics: {
        vtprotoBuffer: {
            uuid: "f33c00328ebf4c9c83ecbfff479a930b",
        },
        numberOfOutputs: {
            uuid: "f33c00028ebf4c9c83ecbfff479a930b",
            callbacks: [
                (characteristic: any) => {
                    // console.log(characteristic);
                    characteristic.read((error: any, data: any) => {
                        if (error) {
                            console.log(error);
                        }
                        /**
                        webSocketServer.broadcastData(WS_BT.numberOfOutputsDiscovered, {
                            [WS_DEVICE_INFO.id]: characteristic._peripheralId,
                            [WS_DEVICE_DISPLAY.numOfOutputs]: data.readUInt8(),
                        });
 */
                        numberOfOutputs.push({
                            [WS_DEVICE_INFO.id]: characteristic._peripheralId,
                            [WS_DEVICE_DISPLAY.numOfOutputs]: data.readUInt8(),
                        });
                    });
                },
            ],
        },
    },
};

const knownServices = [pwmService, hm10Service, tactileDisplayService];
const knownServiceUuids = [
    pwmService.service.uuid,
    hm10Service.service.uuid,
    tactileDisplayService.service.uuid,
];
const knownCharacteristicUuids = [];

const descriptorUserDescription = "2901";
// const descriptorRange = "2906";
// const descriptorRegExp = new RegExp(
//   descriptorUserDescription + "|" + descriptorRange
// );
const descriptorRegExp = new RegExp(descriptorUserDescription);
// const pwmRegExp = new RegExp(/^PWM_/i);

let blueToothState = "";
let scanning = false;
let discoveredDevices = [];
const devices = [];
const pwmMapping = [];
const numberOfOutputs = [];

noble.on("stateChange", (state:any) => {
    console.log("stateChange: " + state)
    blueToothState = state;
    //webSocketServer.broadcastData(WS_BT.newBluetoothState, state);
});

noble.on("scanStart", () => {
    scanning = true;
    console.log("scanStart: ")
    //webSocketServer.broadcastData(WS_BT.scanStateChanged, true);
});

noble.on("scanStop", () => {
    console.log("scanStop: ")
    scanning = false;
    //webSocketServer.broadcastData(WS_BT.scanStateChanged, false);
});

noble.on("discover", function (peripheral: any) {
    console.log("[Bluetooth] Found:" + peripheral);
    // add discovered device to the list
    // console.log(peripheral.advertisement.serviceUuids);
    discoveredDevices.push(peripheral);

    // automatic connectm check if we saved the id
    /**
    const reconnectDeviceIndex = savedConnections.findIndex(
      (x) => x.deviceId === peripheral.id
    );
    if (reconnectDeviceIndex !== -1) {
      // the id is known, try to connect!
      connectDevice(peripheral.id);
    }
     */
});

function startScan() {
    return new Promise<void>((resolve, reject) => {
        if (blueToothState === "poweredOn") {
            // clear list
            discoveredDevices = [];
            console.log("[Bluetooth] Starting Scan");
            // start scan
            noble.startScanning([], false, (error?: Error) => {
                if (!error) resolve();
                else reject(error);
            });
        } else {
            reject(new Error("Bluetooth state is not ready"));
        }
    });
}

function stopScan() {
    console.log("[Bluetooth] Stop Scan");
    noble.stopScanning();
}


export default {
    startScan,
    stopScan,
};
