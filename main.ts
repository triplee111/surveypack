import { store, router, Vue } from '@src/core/index'
import PortalVue from 'portal-vue'

import storeActivate from './store/index'
import App from '@src/App.vue'

Vue.use(PortalVue)

storeActivate(store)

if (process.env.NODE_ENV === 'production') {
  Vue.config.silent = true
  Vue.config.productionTip = true
}

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
