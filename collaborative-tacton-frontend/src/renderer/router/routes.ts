import RoomView from "../views/RoomView.vue";
import { RouteRecordRaw } from "vue-router";

export enum RouterNames {
    ROOM = "ROOM_VIEW",
    PLAY_GROUND = "PLAY_GROUND"
  }

const routes: Array<RouteRecordRaw> =[
      {
        path: "/",
        name: RouterNames.ROOM,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: RoomView,
      },
    ]
   

export default routes