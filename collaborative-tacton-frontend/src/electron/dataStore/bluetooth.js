import fs from "fs/promises";
import path from "path";

import config from "../config/electronConfig";
const dataPath = path.join(config.dataDir, config.bluetoothDataFilename);

export let connections = [];

// initialize sequence
export default async () => {
  // try if there is a file and we can read/write it
  try {
    const rawData = await fs.readFile(dataPath);

    // parse data
    const data = JSON.parse(rawData);

    // assign it to out variable
    if (data.connections != null && Array.isArray(data.connections)) {
      connections = data.connections;
    }
  } catch (e) {
    // check if file is there
    if (e.code === "ENOENT") {
      console.log("[Bluetooth] New settings file created");
      // create file
      saveConnections();
    } else {
      console.log("[Bluetooth] Error while reading the settings file");
      console.log(e);
    }
  }
};

async function saveConnections() {
  try {
    // we stringify our object to save it in the file
    const data = JSON.stringify(
      {
        connections,
      },
      null,
      2
    );

    // write the file
    await fs.writeFile(dataPath, data);
  } catch (e) {
    console.log(e);
  }
}

export async function updateConnections(pwmMap) {
  connections = pwmMap;

  // save it to the file
  await saveConnections();
}

export async function unpairDevice(id) {
  const index = connections.findIndex((x) => x.deviceId === id);
  if (index === -1) {
    return;
  }
  // remove from our list
  connections.splice(index, 1);

  // save it to the file
  await saveConnections();
}
