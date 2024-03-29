import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Asconfig from '../views/Asconfig.vue';
import Asfirmware from '../views/Asfirmware.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Asconfig',
    component: Asconfig,
  },
  {
    path: '/asfw',
    name: 'Asfirmware',
    component: Asfirmware,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/certificate',
    name: 'Certificate',
    component: () => import('../views/Certificate.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
