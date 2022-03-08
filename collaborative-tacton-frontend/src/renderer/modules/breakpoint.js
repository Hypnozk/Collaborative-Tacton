const breakpoints = {
  mobile: 600,
  tabletPortrait: 960,
  desktop: 1280,
  bigDesktop: 1921,
};

const state = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// mutations
const UPDATE_SIZE = "UPDATE_SIZE";
const mutations = {
  UPDATE_SIZE(state, { width, height }) {
    state.width = width;
    state.height = height;
  },
};

const actions = {
  handleResize({ commit }, { width, height }) {
    commit(UPDATE_SIZE, { width, height });
  },
};

const getters = {
  forPhoneOnly: (state) => state.width <= breakpoints.mobile,
  forTabletPortraitUp: (state) => state.width >= breakpoints.mobile,
  forTabletPortraitDown: (state) => state.width < breakpoints.tabletPortrait,
  forTabletLandscapeUp: (state) => state.width >= breakpoints.tabletPortrait,
  forTabletLandscapeDown: (state) => state.width < breakpoints.desktop,
  forDesktopUp: (state) => state.width >= breakpoints.desktop,
  forDesktopDown: (state) => state.width < breakpoints.bigDesktop,
  forBigDesktopUp: (state) => state.width >= breakpoints.bigDesktop,
  forTabletOnly: (state) =>
    state.width >= breakpoints.mobile && state.width < breakpoints.desktop,
  forTabletAndDesktop: (state) =>
    state.width >= breakpoints.mobile && state.width < breakpoints.bigDesktop,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
