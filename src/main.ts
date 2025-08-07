import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';
import 'core-js/actual/array/iterator';
import 'core-js/actual/promise';
import 'core-js/actual/object/assign';
import 'core-js/actual/promise/finally';

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());

  return {
    app,
    Pinia,
  };
}
