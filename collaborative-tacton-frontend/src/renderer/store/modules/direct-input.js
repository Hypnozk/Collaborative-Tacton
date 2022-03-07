// mutations
const ADD_ACTIVE_CHANNEL = "ADD_ACTIVE_CHANNEL";
const ADD_ACTIVE_KEY = "ADD_ACTIVE_KEY";
const ADD_BUTTON_TO_GRID = "ADD_BUTTON_TO_GRID";
const DELETE_BUTTON_FROM_GRID = "DELETE_BUTTON_FROM_GRID";
const EDIT_BUTTON_FROM_GRID = "EDIT_BUTTON_FROM_GRID";
const REMOVE_ACTIVE_CHANNEL = "REMOVE_ACTIVE_CHANNEL";
const REMOVE_ACTIVE_KEY = "REMOVE_ACTIVE_KEY";
const RESET_GRID = "RESET_GRID";
const SET_EDIT_MODE_ACTIVE = "SET_EDIT_MODE_ACTIVE";
const SET_GLOBAL_INTENSITY = "SET_GLOBAL_INTENSITY";

const state = {
  activeChannels: [],
  activeKeys: [],
  editModeActive: false,
  globalIntensity: 1,
  gridColNum: 10,
  gridLayout: [],
};

const mutations = {
  [ADD_ACTIVE_CHANNEL](state, { id, intensity }) {
    const index = state.activeChannels.findIndex(
      (channel) => channel.id === id
    );
    if (index < 0) state.activeChannels.push({ id, intensities: [intensity] });
    else state.activeChannels[index].intensities.push(intensity);
  },
  [ADD_ACTIVE_KEY](state, key) {
    if (!state.activeKeys.includes(key)) state.activeKeys.push(key);
  },
  [ADD_BUTTON_TO_GRID](
    state,
    { channels, color, h, i, intensity, name, key, w, x, y }
  ) {
    state.gridLayout.push(
      JSON.parse(
        JSON.stringify({
          channels,
          color,
          h: h ?? 3,
          i:
            i ??
            Math.max(...state.gridLayout.map((o) => parseFloat(o.i)), 0) + 1,
          intensity,
          name,
          key,
          w: w ?? 1,
          x: x ?? state.gridLayout.length % state.gridColNum,
          y: y ?? Math.floor(state.gridLayout.length / state.gridColNum) * 3,
        })
      )
    );
  },
  [DELETE_BUTTON_FROM_GRID](state, key) {
    const button = state.gridLayout.find((b) => b.key === key);
    const index = state.gridLayout.indexOf(button);
    if (index > -1) state.gridLayout.splice(index, 1);
  },
  [EDIT_BUTTON_FROM_GRID](state, { key, config }) {
    const button = state.gridLayout.find((b) => b.key === key);
    const index = state.gridLayout.indexOf(button);
    if (index > -1) {
      state.gridLayout[index].color = config.color;
      state.gridLayout[index].name = config.name;
      state.gridLayout[index].intensity = config.intensity;
      state.gridLayout[index].key = config.key;
      state.gridLayout[index].channels = config.selectedActuators;
    }
  },
  [REMOVE_ACTIVE_CHANNEL](state, { id, intensity }) {
    const index = state.activeChannels.findIndex(
      (channel) => channel.id === id
    );
    if (index > -1) {
      if (state.activeChannels[index].intensities.length <= 1)
        state.activeChannels.splice(index, 1);
      else {
        const intensityIndex =
          state.activeChannels[index].intensities.indexOf(intensity);
        state.activeChannels[index].intensities.splice(intensityIndex, 1);
      }
    }
  },
  [REMOVE_ACTIVE_KEY](state, key) {
    const index = state.activeKeys.indexOf(key);
    if (index > -1) state.activeKeys.splice(index, 1);
  },
  [RESET_GRID](state) {
    state.gridLayout = [];
  },
  [SET_EDIT_MODE_ACTIVE](state, active) {
    state.editModeActive = active;
  },
  [SET_GLOBAL_INTENSITY](state, intensity) {
    state.globalIntensity = intensity;
  },
};

const actions = {
  addActiveChannel({ commit }, { id, intensity }) {
    commit(ADD_ACTIVE_CHANNEL, { id, intensity });
  },
  addActiveKey({ commit }, key) {
    commit(ADD_ACTIVE_KEY, key);
  },
  addButtonToGrid({ commit, rootGetters }, button) {
    const filteredButton = {
      ...button,
      channels: button.channels.filter(
        (ch) => ch <= rootGetters["devices/numberOfOutputs"]
      ),
    };
    if (filteredButton.channels.length <= 0) return;
    commit(ADD_BUTTON_TO_GRID, filteredButton);
  },
  deleteButtonFromGrid({ commit }, key) {
    commit(DELETE_BUTTON_FROM_GRID, key);
  },
  editButtonFromGrid({ commit }, { key, config }) {
    commit(EDIT_BUTTON_FROM_GRID, { key, config });
  },
  loadGridFromFile({ commit, dispatch }, newGrid) {
    if (newGrid.length <= 0) return;
    commit(RESET_GRID);
    newGrid.forEach((item) => {
      dispatch("addButtonToGrid", item);
    });
  },
  removeActiveChannel({ commit }, { id, intensity }) {
    commit(REMOVE_ACTIVE_CHANNEL, { id, intensity });
  },
  removeActiveKey({ commit }, key) {
    commit(REMOVE_ACTIVE_KEY, key);
  },
  setEditModeActive({ commit }, active) {
    commit(SET_EDIT_MODE_ACTIVE, active);
  },
  setGlobalIntensity({ commit }, intensity) {
    commit(SET_GLOBAL_INTENSITY, intensity);
  },
};

const getters = {
  activeChannels: (state) => state.activeChannels,
  channelsActive: (state) => (channels) =>
    channels.every((ch) => state.activeChannels.some((aCh) => aCh.id === ch)),
  editModeActive: (state) => state.editModeActive,
  globalIntensity: (state) => state.globalIntensity,
  gridColNum: (state) => state.gridColNum,
  gridLayout: (state) => state.gridLayout,
  keyAlreadyActive: (state) => (key) =>
    state.activeKeys.some((ak) => ak === key),
  keyAlreadyTaken: (state) => (key) =>
    state.gridLayout.some((button) => button.key === key),
};

export default {
  state,
  mutations,
  actions,
  getters,
};
