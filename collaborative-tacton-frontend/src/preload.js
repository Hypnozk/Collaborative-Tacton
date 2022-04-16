const {
    contextBridge,
    ipcRenderer
} = require("electron");

const isValidChannel = (element, channel) => {
    if (typeof channel === 'string' || channel instanceof String) {
        return channel.includes(element);
    }
    return false;
}

contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
        // whitelist channels
        //send to the main
        let validChannels = ["tactile-jam.send"];
        const isValid = validChannels.some(el => isValidChannel(el, channel));

        if (isValid == true) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        //get messages from main
        let validChannels = ['tactile-jam.receive']
        const isValid = validChannels.some(el => isValidChannel(el, channel));

        if (isValid == true) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    }
}
);