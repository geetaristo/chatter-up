<template>
  <div>
    <Header />
    <LoginForm v-if="!loggedInChat" />
    <ChatWindow v-if="loggedInChat" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'

const UserModule = namespace('UserModule')

@Component
export default class Index extends Vue {
  @UserModule.State
  loggedInChat?: boolean
}
</script>
