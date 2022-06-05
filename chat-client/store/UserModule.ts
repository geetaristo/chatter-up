import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  name: 'UserModule',
  stateFactory: true,
  namespaced: true
})
export default class UserModule extends VuexModule {
  useralias: string = ''
  loggedInChat: boolean = false

  @Mutation
  setUseralias (useralias: string) {
    this.useralias = useralias
    this.loggedInChat = true
  }

  @Mutation
  unsetUseralias () {
    this.useralias = ''
    this.loggedInChat = false
  }

  // eslint-disable-next-line require-await
  @Action
  async loginUserAlias (useralias: string) {
    this.setUseralias(useralias)
  }

  // eslint-disable-next-line require-await
  @Action
  async logoutUserAlias () {
    this.unsetUseralias()
  }
}
