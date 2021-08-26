import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import OneDesignVue from "@dnvgl-onefoundation/onedesign-vue";

Vue.use(BootstrapVue);
Vue.use(OneDesignVue);

import "./assets/scss/main.scss";

import App from "./App.vue";
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
