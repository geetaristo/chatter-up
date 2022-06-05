import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import userModule from '~/store/UserModule'

// eslint-disable-next-line import/no-mutable-exports
let userStore: userModule

function initialiseStores (store: Store<any>): void {
  userStore = getModule(userModule, store)
}

export { initialiseStores, userStore }
