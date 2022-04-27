import PlayGroundView from "../views/PlayGroundView.vue";
import { RouteRecordRaw } from "vue-router";

export enum RouteNames {
    PLAY_GROUND = "playGround",
    DEVICES = "devices",
  }

const routes: Array<RouteRecordRaw> =[
    {
        path: "/devices",
        name: RouteNames.DEVICES,
        component: () =>
        import(/* webpackChunkName: "about" */ "../views/DeviceView.vue"),
    
      },
      {
        path: "/",
        name: RouteNames.PLAY_GROUND,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: PlayGroundView,
      },
    ]
   

export default routes