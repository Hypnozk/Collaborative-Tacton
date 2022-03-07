import bluetoothController from "../bluetooth/bluetoothController"
import helper from "../lib/helper"
import { IPC_CHANNELS } from "../IPCManager/IPCChannels";
import IPCController from "../IPCManager/IPCController";


async function startScanForDevices() {
    for (let iScan = 0; iScan < 10; iScan++) {
        let successStartScan = false
        for (let iStart = 0; iStart < 10; iStart++) {
            successStartScan = await bluetoothController.startScan();
            if (!successStartScan) {
                await bluetoothController.restart();
            } else {
                break;
            }
        }
        //console.log("successStartScan: " + successStartScan)
        if (!successStartScan) {
            console.log("[Bluetooth] Error with powerstate")
            IPCController.sendIPCMessageToRenderer(IPC_CHANNELS.receive.output.scanning, false)
            IPCController.sendIPCMessageToRenderer(IPC_CHANNELS.receive.error.scanning, "Error with powerstate")
            break;
        }
        if (bluetoothController.getScanningStatus()) {
            //console.log("isScanning: " + bluetoothController.getScanningStatus())
            await helper.sleep(10000)
            //console.log("stop sleeptimer: " + bluetoothController.getListDiscoveredDevices().length);
            await bluetoothController.stopScan();
            if (bluetoothController.getListDiscoveredDevices().length > 0) {
                console.log("[Bluetooth] Scanning finished")
                IPCController.sendIPCMessageToRenderer(IPC_CHANNELS.receive.output.scanning, false)
                break;
            }
        } else {
            await bluetoothController.stopScan();
        }
    }
}

async function stopScanForDevices() {
    let success = false;
    for (let i = 0; i < 10; i++) {
        if (!bluetoothController.getScanningStatus()) {
            success = true;
            break;
        }
        await bluetoothController.stopScan()
    }
    if (success) {
        IPCController.sendIPCMessageToRenderer(IPC_CHANNELS.receive.output.scanning, false)
    } else {
        IPCController.sendIPCMessageToRenderer(IPC_CHANNELS.receive.error.scanning, "Error with stop Scanning")
    }
}

export default { startScanForDevices, stopScanForDevices }