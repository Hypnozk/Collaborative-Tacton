import { TactileTask } from "@/types/GeneralType";
import { Peripheral } from "@abandonware/noble";
import { IPC_CHANNELS } from "../IPCMainManager/IPCChannels";
import { sendMessageToRenderer } from "../IPCMainManager/IPCController";
import { connectBlutetoothDevice, disconnectBlutetoothDevice, startBluetoothScan, stopBluetoothScan } from "./BluetoothController"
import { executeInstruction } from "./VTProtoTransformer";

let discoveredDevices = [] as Peripheral[]
let connectedDevice: Peripheral | undefined = undefined;

const startScan = () => {
    discoveredDevices = [];
    disconnectDevice()
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

const updateConnectedDevice = async (peripheral: Peripheral) => {
    if (peripheral.state == "connected") {
        connectedDevice = peripheral;
    } else {
        connectedDevice = undefined;
    }
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
    if (connectedDevice !== undefined && connectedDevice !== null)
        disconnectBlutetoothDevice(connectedDevice);
        
    connectBlutetoothDevice(device);
}

const disconnectDevice = () => {
    if (connectedDevice == null) return;
    disconnectBlutetoothDevice(connectedDevice)
}

const executeTask = (taskList: TactileTask[]) => {
    if (connectedDevice == null)
        return;

    executeInstruction(connectedDevice, taskList)
}

const initialVibration = async () => {
    executeTask([{
        channelId: 0,
        intensity: 1
    }])
    await new Promise((r) => setTimeout(r, 1000));
    executeTask([{
        channelId: 0,
        intensity: 0
    }])
}
export default {
    startScan,
    stopScan,
    addDevice,
    updateConnectedDevice,
    connectDevice,
    disconnectDevice,
    executeTask,
    initialVibration,
}