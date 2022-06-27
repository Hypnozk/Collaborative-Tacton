const IPC_CHANNELS = {
    main: {
        actuator: "tactile-jam.main.actuator",
        changeScan: "tactile-jam.main.changeScan",
        connectDevice: "tactile-jam.main.connectDevice",
        disconnectDevice: "tactile-jam.main.disconnectDevice",
        executeTask: "tactile-jam.main.executeTask",
        copyToClipBoard: "tactile-jam.main.copyToClipBoard",
        modifyUserConfig: "tactile-jam.main.modifyUserConfig"
    },
    renderer: {
        actuator: "tactile-jam.renderer.devices",
        foundDevice: "tactile-jam.renderer.foundDevice",
        deviceStatusChanged: "tactile-jam.renderer.deviceStatusChanged",
        numberOfOutputsDiscovered: "tactile-jam.renderer.numberOfOutputsDiscovered",
        initConfig: "tactile-jam.renderer.initConfig",
    }
};

export {
    IPC_CHANNELS,
};