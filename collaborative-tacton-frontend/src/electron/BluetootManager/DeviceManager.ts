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
let connectedDevice: Peripheral | null = null;

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
    console.log("[Bluetooth] Found:" + !isKnownService(peripheral.advertisement.serviceUuids));
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

const connectDevice = (deviceID: string) => {
    const device = discoveredDevices.find(device => device.id === deviceID);
    //check if device is already connected
    if (device == undefined || device.state === "connected") return;

    // setup events
    device.once("connect", async () => {
        console.log(`[Bluetooth][${device.id}]: ${device.advertisement.localName} connected`);
        connectedDevice = device;
        sendMessageToRenderer(IPC_CHANNELS.renderer.deviceStatusChanged, {
            id: device.id,
            name: device.advertisement.localName,
            rssi: device.rssi,
            state: device.state,
        })
        // TODO unsafe for multi device operatio
    });
    device.once("disconnect", () => {
        console.log(`[Bluetooth][${device.id}]: ${device.advertisement.localName} disconnected`);
        connectedDevice = null;
        sendMessageToRenderer(IPC_CHANNELS.renderer.deviceStatusChanged, {
            id: device.id,
            name: device.advertisement.localName,
            rssi: device.rssi,
            state: device.state,
        })
    })

    console.log(`[Bluetooth][${device.id}]: trying to connected`);
    // connect to device
    device.connect();
}

const disconnectDevice = () => {
    if (connectedDevice == null)
        return;

    connectedDevice.disconnect()
    //connectedDevice?.disconnect()
}

const executeInstruction = () => {
    if (connectedDevice == null)
        return;


}

export default {
    startScan,
    stopScan,
    connectDevice,
    disconnectDevice,
    executeInstruction
};
