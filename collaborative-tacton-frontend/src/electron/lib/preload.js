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

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
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
        let validChannels = ['tactile-jam.receive']
        //if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args))
       // }
    }
}
);

