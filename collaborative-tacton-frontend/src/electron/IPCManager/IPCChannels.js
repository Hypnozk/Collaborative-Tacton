const IPC_CHANNELS = {
    send: {
        output: {
            scanning: "tactile-jam.send.output.scanning"
        }
    },
    receive: {
        output: {
            devices: "tactile-jam.receive.output.devices",
            scanning: "tactile-jam.receive.output.scanning",
        },
        error: {
            scanning: "tactile-jam.receive.error.scanning",
        }
    }
};

export {
    IPC_CHANNELS,
};