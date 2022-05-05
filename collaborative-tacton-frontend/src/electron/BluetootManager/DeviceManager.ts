import noble, { Peripheral } from "@abandonware/noble";
import { IPC_CHANNELS } from "../IPCMainManager/IPCChannels";
import { sendMessageToRenderer } from "../IPCMainManager/IPCController";
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
//dont know why needed
const numberOfOutputs = [];
//probbly could delete
const trashDevice = [] as Peripheral[]

//important
const knownServiceUuids = [
    pwmService.service.uuid,
    hm10Service.service.uuid,
    tactileDisplayService.service.uuid,
];
let blueToothState = "";
let discoveredDevices = [] as Peripheral[]

const isKnownService = (serviceIds: string[]): boolean => {
    return serviceIds.some((serviceId) =>
        knownServiceUuids.includes(serviceId)
    )
}

noble.on("stateChange", (state: any) => {
    console.log("stateChange: " + state)
    blueToothState = state;
});

noble.on("discover", function (peripheral: Peripheral) {
    console.log("[Bluetooth] Found:" + peripheral);
    // add discovered device to the list

    if (!isKnownService(peripheral.advertisement.serviceUuids)) {
        trashDevice.push(peripheral)
        return;
    }

    discoveredDevices.push(peripheral);
    sendMessageToRenderer(IPC_CHANNELS.renderer.foundDevice, {
        id: peripheral.id,
        name: peripheral.advertisement.localName,
        rssi: peripheral.rssi,
        state: peripheral.state
    })
});

const startScan = () => {
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

const stopScan = () => {
    console.log("[Bluetooth] Stop Scan");
    noble.stopScanning();
}


export default {
    startScan,
    stopScan,
};
