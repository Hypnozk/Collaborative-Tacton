import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import PlayGroundView from "../views/PlayGroundView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/devices",
    name: "",
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),

  },
  {
    path: "/",
    name: "playGround",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PlayGroundView,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
