const IPC_CHANNELS = {
    main: {
        actuator: "tactile-jam.main.actuator",
        changeScan: "tactile-jam.main.changeScan"
    },
    renderer: {
        actuator: "tactile-jam.renderer.devices",
        foundDevice: "tactile-jam.renderer.foundDevice"
    }
};

export {
    IPC_CHANNELS,
};