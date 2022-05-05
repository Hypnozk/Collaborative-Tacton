import RoomView from "../views/RoomView.vue";
import DeviceView from "../views/DeviceView.vue"
import { RouteRecordRaw } from "vue-router";
import { RouterNames } from "@/types/Routernames";

const routes: Array<RouteRecordRaw> =[
      {
        path: "/",
        name: RouterNames.ROOM,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: RoomView,
      },
      {
        path: "/device",
        name: RouterNames.DEVICE,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: DeviceView,
      },
    ]
   

export default routes