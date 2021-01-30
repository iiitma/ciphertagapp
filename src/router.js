import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Components from "./views/Components.vue";
import Landing from "./views/Landing.vue";
import Create from "./views/Create.vue";
import Join from "./views/Join.vue";
import Lobby from "./views/Lobby.vue";
import Room from "./views/Room.vue";
import Error404 from "./views/Error.vue";

Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  mode: "history",
  routes: [
    {
      path: "/components",
      name: "components",
      components: {
        header: AppHeader,
        default: Components,
        footer: AppFooter
      }
    },
    {
      path: "/",
      name: "landing",
      components: {
        header: AppHeader,
        default: Landing,
        footer: AppFooter
      }
    },
 
    {
      path: "/create",
      name: "create",
      components: {
        header: AppHeader,
        default: Create,
        footer: AppFooter
      }
    },
    {
      path: "/join",
      name: "join",
      components: {
        header: AppHeader,
        default: Join,
        footer: AppFooter
      }
    },
    {
      path: "/join/:id",
      name: "join",
      components: {
        header: AppHeader,
        default: Join,
        footer: AppFooter
      }
    },
    {
      path: "/lobby/:id",
      name: "lobby",
      components: {

        default: Lobby,

      }
    },
    {
      path: "/room/:id",
      name: "room",
      components: {

        default: Room,
  
      }
    },

    {
      path: "/404",
      name: "404",
      components: {
        header: AppHeader,
        default: Error404,
        footer: AppFooter
      }
    },
    { path: '*', redirect: '/404' }, 
   
   
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
