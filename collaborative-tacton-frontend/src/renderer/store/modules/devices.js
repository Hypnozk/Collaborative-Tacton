// mutations


const state = {
  deviceList: [],
};

const mutations = {
};

const actions = {

};

const getters = {
  deviceList: (state) => state.deviceList,
  /**
   * original
   * @returns  
   * numberOfOutputs: (state) => {
    if (state.connectedDevices.length > 0)
      return state.connectedDevices[0][WS_DEVICE_DISPLAY.numOfOutputs];
  },
   */
  numberOfOutputs: () => {
    return 10;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
