const { ipcMain } = require('electron');
import electronCache from "../centralComponents/electronCache"
import { IPC_CHANNELS } from "./IPCChannels";
import bluetoothManager from "../bluetooth/bluetoothManager"
/*
to recieve messages from the renderer process
--------------------------------------------------------------
ipcMain.on("tactile-jam.send.output.scanning", (event, scanning) => {
    console.log(scanning);
    //send reply back
      event.reply('tactile-jam.receive', 'pong')
  });

-------------------------------------------------------
Listener to all Channels

function handleElectronCall(event, scanning) {
  console.log("get information");
}

function traverse_it(obj) {
  var channels = new Array();
  for (var prop in obj) {
    if (typeof obj[prop] == 'object') {
      // object
      const temp = traverse_it(obj[prop]);
      if (temp.length > 0) {
        channels = channels.concat(temp);
      }
    } else {
      // something else
      channels.push(obj[prop])
      //console.log('The value of '+prop+' is '+obj[prop]+'.');
    }
  }

  return channels;
}

const channels = traverse_it(IPC_CHANNELS);

for (let i = 0; i < channels.length; i++) {
  ipcMain.on(channels[i], handleElectronCall)
}
*/

ipcMain.on(IPC_CHANNELS.send.output.scanning, (event, scanning) => {
 //tactjam.sendMessage("tactile-jam.receive.output.devices", "testing plugin")
  if (scanning) {
    bluetoothManager.startScanForDevices()
    console.log("Start Scan")
  } else {
    bluetoothManager.stopScanForDevices();
    console.log("Stop Scan")
  }
});

/*
to send directly messages to the renderer process
--------------------------------------------------------------
electronCache.getBrowserWindow().webContents.send('tactile-jam.receive', 'pong')
---function to send informations to the renderer
*/

function sendIPCMessageToRenderer(channel, msg) {
  electronCache.getBrowserWindow().webContents.send(channel, msg)
}

export default {
  sendIPCMessageToRenderer,
};