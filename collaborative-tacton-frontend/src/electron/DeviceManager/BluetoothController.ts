import noble, { Peripheral } from "@abandonware/noble";
import { isKnownService, knownServiceUuids } from "./Services"
import DeviceManager from "./DeviceManager";

let blueToothState = "";

noble.on("stateChange", (state: any) => {
    blueToothState = state;
});

noble.on("discover", function (peripheral: Peripheral) {
    console.log("[Bluetooth] Found:" + !isKnownService(peripheral.advertisement.serviceUuids));
    // service not supporter, dont list as device
    if (!isKnownService(peripheral.advertisement.serviceUuids))
        return;

        DeviceManager.addDevice(peripheral)
});

export const startBluetoothScan = () => {
    if (blueToothState === "poweredOn") {
        // clear list
        console.log("[Bluetooth] Starting Scan");
        // start scan
        noble.startScanning([], false, (error?: Error) => {
            if (!error) return;
            throw error;
        });
    } else {
        throw (new Error("Bluetooth state is not ready"));
    }
}

export const stopBluetoothScan = () => {
    console.log("[Bluetooth] Stop Scan");
    noble.stopScanning();
}

const discoverServices = (device:Peripheral) => {
    device!.discoverServices(knownServiceUuids, (err, services) => {
        console.log(`[Bluetooth][${device!.id}]: ${services.length} service(s) found.`)
        if (err !== null || services.length == 0) {
            throw Error()
        }
        services.forEach((service) => {
            // Let each service add its specific event callbacks, callbacks are stored in service object, in callback array
            service.discoverCharacteristics();
        });
    });
}

export const connectBlutetoothDevice = (device: Peripheral) => {
    // setup events
    device.once("connect", async () => {
        console.log(`[Bluetooth][${device.id}]: ${device.advertisement.localName} connected`);
        discoverServices(device);
        DeviceManager.updateConnectedDevice(device)
    });
    device.once("disconnect", () => {
        console.log(`[Bluetooth][${device.id}]: ${device.advertisement.localName} disconnected`);
        DeviceManager.updateConnectedDevice(device);
    })

    console.log(`[Bluetooth][${device.id}]: trying to connect`);
    // connect to device
    device.connect();
}

export const disconnectBlutetoothDevice = (device: Peripheral) => {
    device.disconnect()
}
