import { TactileTask } from "@/types/GeneralType";
import { Peripheral } from "@abandonware/noble";
import { IPC_CHANNELS } from "../IPCMainManager/IPCChannels";
import { sendMessageToRenderer } from "../IPCMainManager/IPCController";
import { connectBlutetoothDevice, disconnectBlutetoothDevice, startBluetoothScan, stopBluetoothScan } from "./BluetoothController"
import { executeInstruction } from "./DeviceController";

let discoveredDevices = [] as Peripheral[]
let connectedDevice: Peripheral | undefined = undefined;

const startScan = () => {
    discoveredDevices = [];
    startBluetoothScan()
}

const stopScan = () => {
    stopBluetoothScan()
}

const addDevice = (peripheral: Peripheral) => {
    discoveredDevices.push(peripheral);
    sendMessageToRenderer(IPC_CHANNELS.renderer.foundDevice, {
        id: peripheral.id,
        name: peripheral.advertisement.localName,
        rssi: peripheral.rssi,
        state: peripheral.state
    })
}

const updateConnectedDevice = (peripheral: Peripheral) => {
    connectedDevice = peripheral;
    sendMessageToRenderer(IPC_CHANNELS.renderer.deviceStatusChanged, {
        id: peripheral.id,
        name: peripheral.advertisement.localName,
        rssi: peripheral.rssi,
        state: peripheral.state,
    });
}

const connectDevice = (deviceID: string) => {
    const device = discoveredDevices.find(device => device.id === deviceID);
    //check if device is already connected
    if (device == undefined || device.state === "connected") return;
    connectBlutetoothDevice(device);
}

const disconnectDevice = () => {
    if (connectedDevice == null) return;
    disconnectBlutetoothDevice(connectedDevice)
}

const executeTask = (task: TactileTask) => {
    if (connectedDevice == null)
        return;

    executeInstruction(connectedDevice, task)
}

export default {
    startScan,
    stopScan,
    addDevice,
    updateConnectedDevice,
    connectDevice,
    disconnectDevice,
    executeTask
}