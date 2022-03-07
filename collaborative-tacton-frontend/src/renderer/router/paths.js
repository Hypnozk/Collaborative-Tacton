export default [
  {
    path: "/",
    name: "devices",
    component: () => import("./views/BluetoothDevices.vue"),
    meta: {
      title: "VT-UI - Bluetooth Devices",
    },
  },
  {
    path: "/direct-input",
    name: "protobuf direct input",
    component: () => import("./views/DirectInput.vue"),
    meta: {
      title: "VT-UI - Protobuf Direct Input",
    },
  },
  {
    path: "/404",
    name: "NotFound",
    component: require("./views/_404.vue").default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
    meta: { title: "VT-UI - 404" },
  },
  // Redirect any unmatched routes to the 404 page.
  {
    path: "/:pathMatch(.*)*",
    name: "any",
    redirect: { name: "NotFound" },
  },
];
