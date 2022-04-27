const WS_BT = {
    getBluetoothState: "getBluetoothState",
    newBluetoothState: "newBluetoothState",
  
    setScanState: "setScanState",
    getScanState: "getScanState",
    scanStateChanged: "newScanningState",
  
    newDeviceDiscovered: "newDeviceDiscovered",
    deviceDisconnected: "deviceDisconnected",
    deviceConnected: "deviceConnected",
    connectDevice: "connectDevice",
    unpairDevice: "unpairDevice",
  
    numberOfOutputsDiscovered: "numberOfOutputsDiscovered",
    getAlreadyConnectedDevices: "getAlreadyConnectedDevices",
  };
  
  const WS_DEVICE_INFO = {
    id: "deviceId",
    rssi: "deviceRssi",
    connectable: "deviceConnectable",
    name: "deviceName",
    state: "deviceState",
    serviceUuids: "deviceServiceUuids",
    knownService: "deviceKnownService",
  };
  
  const WS_DEVICE_DISPLAY = {
    numOfOutputs: "numOfOutputs",
  };
  
  const serviceUuid = "serviceUuid";
  const characteristicsUuid = "characteristicsUuid";
  
  // pwm channels
  const WS_PWM = {
    pwmChannels: "pwmChannels",
    pwmChannel: "pwmChannel",
    pwmMin: "pwmMin",
    pwmMax: "pwmMax",
    pwmName: "pwmName",
    pwmMap: "pwmMap",
    getPwmMap: "getPwmMap",
    setPwm: "setPwm",
    pwmStrength: "pwmStrength",
    pwmValue: "pwmValue",
  };
  
  const WS_MQTT = {
    mqttConnectClient: "mqttConnectClient",
    mqttDisconnectClient: "mqttDisconnectClient",
    mqttGetConnection: "mqttGetConnection",
    mqttConnection: "mqttConnection",
  
    mqttSubscribeToTopic: "mqttSubscribeToTopic",
    mqttUnsubscribeFromTopic: "mqttUnsubscribeFromTopic",
    mqttGetSubscriptions: "mqttGetSubscriptions",
    mqttSubscriptions: "mqttSubscriptions",
  };
  
  const WS_SIMPLE_TACTON = {
    triggerTacton: "tactonTriggerTacton",
    updatePlaybackState: "tactonUpdatePlaybackState",
    stopPlayback: "tactonStopPlayback",
    broadcastHoloOutputState: "broadcastHoloOutputState",
    setHoloOutputState: "setHoloOutputState",
  };
  const WS_PB = {
    directExecution: "directExecution",
  };
  
  const WS_PB_SPEC = {
    target: {
      channel: "channel",
      group: "group",
    },
    instructions: {
      addToGroup: "addToGroup",
      wait: "wait",
      setWaveformType: "setWaveformType",
      instantlySetParameter: "instantlySetParameter",
      interpolateParameter: "interpolateParameter",
    },
  };
  
  export {
    WS_BT,
    WS_DEVICE_INFO,
    WS_DEVICE_DISPLAY,
    WS_PWM,
    WS_MQTT,
    WS_SIMPLE_TACTON,
    WS_PB,
    WS_PB_SPEC,
    serviceUuid,
    characteristicsUuid,
  };
  