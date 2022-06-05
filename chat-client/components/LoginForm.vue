<template>
  <div>
    <b-container>
      <b-form-group id="useralias" label="User Alias:" label-for="useralias">
        <b-form-input
          id="useralias"
          v-model="useralias"
          placeholder="Enter your user alias here"
          required
        />
      </b-form-group>

      <b-button variant="dark" :disabled="!useraliasIsValid" @click="joinChat">
        Join Chat
      </b-button>
      <p v-if="useraliasAlreadyExist" class="errorText">
        This user alias already exist.
      </p>
      <p v-if="useralias.length > 0 && useralias.length < 4" class="errorText">
        Your user alias must be more than four characters
      </p>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, namespace } from 'nuxt-property-decorator'
import { validateUserAlias } from '../api/chatApi'

const alreadyExistingAliases = [
  'elkabong'
]

const UserModule = namespace('UserModule')

@Component
export default class LoginComponent extends Vue {
  @UserModule.Action
  loginUserAlias: any

  useraliasAlreadyExist: boolean = false
  useralias: string = ''

  joinChat () {
    if (alreadyExistingAliases.includes(this.useralias)) {
      this.useraliasAlreadyExist = true
    } else {
      this.loginUserAlias(this.useralias)
    }
  }

  @Watch('useralias')
  async onPropertyChanged (value: string, _oldValue: string) {
    if (this.useralias != null && this.useralias.length > 3) {
      this.useraliasAlreadyExist = !await validateUserAlias(value)
    }
  }

  get useraliasIsValid () : boolean {
    return this.useralias != null && this.useralias.length > 3 && this.useraliasAlreadyExist === false
  }
}
</script>

<style scoped>
input {
  max-width: 300px;
}
p {
  margin: 10px 0px;
}
.errorText {
  font-weight: bold;
  color: red;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
