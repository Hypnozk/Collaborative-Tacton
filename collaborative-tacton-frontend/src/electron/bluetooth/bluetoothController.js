import noble from "@abandonware/noble";
import {
    connections as savedConnections,
} from "../dataStore/bluetooth.js";
import IPCController from "../IPCManager/IPCController"
import { IPC_CHANNELS } from "../IPCManager/IPCChannels";
import helper from "../lib/helper"
import { DEVICE_INFO, DEVICE_DISPLAY } from "../lib/DEVICE_INFO"

/**
 * Section of local variables which store current state
 */
let isScanning = false;
let blueToothState = "";
let discoveredDevices = [];
let devices = [];
const pwmMapping = [];
const numberOfOutputs = [];


const hm10Service = {
    service: {
        uuid: "5eb8eec2b92d4dca901c3bc3b69936e6",
        callbacks: [
            (service) => {
                service.once("characteristicsDiscover", (characteristic) => {
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
                (characteristic) => {
                    characteristic.notify(true);
                    characteristic.on("data", (state) => {
                        // console.log(state);
                        if (state.readInt8(1) === 0) {
                            console.log(
                                "[HM10 BLE Service] Received State update from peripheral"
                            );
                            if (webSocketServer != null) {
                                webSocketServer.broadcastData(
                                    WS_SIMPLE_TACTON.tactonUpdatePlaybackState,
                                    state.readInt8(2)
                                );
                            }
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
                (characteristic) => {
                    // console.log(characteristic);
                    characteristic.read((error, data) => {
                        if (error) {
                            console.log(error);
                        }
                        /**webSocketServer.broadcastData(WS_BT.numberOfOutputsDiscovered, {
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

/**
 * Bluetooth Low Energy framework noble functions
 * 
 */
noble.on("stateChange", (state) => {
    console.log("stateChanged: " + state);
    blueToothState = state;
});

noble.on("scanStart", () => {
    console.log("[Bluetooth] Start Scan")
    isScanning = true;
});

noble.on("scanStop", () => {
    console.log("[Bluetooth] Stop Scan")
    isScanning = false;
});


noble.on("discover", function (peripheral) {
    //console.log("[Bluetooth] Found:" + peripheral);
    // add discovered device to the list
    // console.log(peripheral.advertisement.serviceUuids);

    discoveredDevices.push(peripheral);
    // notify renderer
    let device = getDiscoveredDevice(peripheral);
    //console.log(device)
    IPCController.sendIPCMessageToRenderer(IPC_CHANNELS.receive.output.devices, device)
    /**
// automatic connectm check if we saved the id
const reconnectDeviceIndex = savedConnections.findIndex(
    (x) => x.deviceId === peripheral.id
);
if (reconnectDeviceIndex !== -1) {
    // the id is known, try to connect!
    connectDevice(peripheral.id);
}
 */
});



/**
 * Section of helper function
 * -------------------------------------------------------------------------
 */
async function startScan() {
    if (blueToothState === "poweredOn") {
        // clear list
        console.log("[Bluetooth] Try to Starting Scan");
        // start scan
        noble.startScanning([], false);
        await helper.sleep(1000);
        return true;
    } else {
        return false;
    }
}

async function stopScan() {
    console.log("[Bluetooth] Try to Stop Scan");
    noble.stopScanning();
    await helper.sleep(1000);
    return true;
}

async function restart() {
    noble.reset()
    await helper.sleep(1000);
    return true;
}

function connectDevice(id) {
    // check if device is already connected :)
    const deviceIndex = devices.find((dev) => dev.id === id);
    if (deviceIndex !== undefined) return;

    // check if device is in our discovered devices list
    const peripheralIndex = discoveredDevices.findIndex((x) => x.id === id);
    if (peripheralIndex === -1) return;

    const peripheral = discoveredDevices[peripheralIndex];

    // setup events
    //setOnConnect(peripheral);
    //setDisconnect(peripheral);

    // add connected device
    devices.push(peripheral);

    // add pwm mapping
    /**
     * pwmMapping = [{
     *     [deviceId]: "",
     *     [deviceName]: "",
     *     [pwmChannels]: [
     *       {
     *         [characteristicsUuid]: "",
     *         [pwmName]: "",
     *         [pwmMin]: 0,
     *         [pwmMax]: 255
     *       }, ...
     *     ]
     * }, ...]
     */
    // TODO Modularize Setup of services based on found services
    pwmMapping.push({
        [WS_DEVICE_INFO.id]: id,
        [WS_DEVICE_INFO.deviceName]: peripheral.advertisement.localName,
        [WS_PWM.pwmChannels]: [],
    });

    // remove device from discovered list
    // console.log(pwmMapping);
    discoveredDevices.splice(1, peripheralIndex);

    console.log(`[Bluetooth][${peripheral.id}]: trying to connected`);
    // connect to device
    peripheral.connect();
}

/**
 * section of internal function
 * ---------------------------------------------------------------------------------
 */

function getDiscoveredDevice(peripheral) {
    // console.log(peripheral);
    return {
        [DEVICE_INFO.id]: peripheral.id,
        [DEVICE_INFO.rssi]: peripheral.rssi,
        [DEVICE_INFO.connectable]: peripheral.connectable,
        [DEVICE_INFO.name]: peripheral.advertisement.localName,
        [DEVICE_INFO.state]: peripheral.state,
        [DEVICE_INFO.serviceUuids]: peripheral.advertisement.serviceUuids,
        [DEVICE_INFO.knownService]:
            typeof peripheral.advertisement.serviceUuids !== "undefined" &&
            peripheral.advertisement.serviceUuids.some((x) =>
                knownServiceUuids.includes(x)
            ),
        ...(numberOfOutputs.some((e) => e[DEVICE_INFO.id] === peripheral.id)
            ? {
                [DEVICE_DISPLAY.numOfOutputs]: numberOfOutputs.find(
                    (e) => e[DEVICE_INFO.id] === peripheral.id
                )[DEVICE_DISPLAY.numOfOutputs],
            }
            : {}),
    };
}

function getScanningStatus() {
    return isScanning;
}

function getListDiscoveredDevices() {
    return discoveredDevices;
}

export default {
    startScan,
    stopScan,
    restart,
    getScanningStatus,
    getListDiscoveredDevices
};
