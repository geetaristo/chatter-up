<template>
  <b-navbar class="navbar">
    <b-navbar-brand to="/">
      <img src="../assets/megaphone-man.png" alt="Chatter!!">
      <b-nav-text class="title">
        Chatter Away!!!
      </b-nav-text>
    </b-navbar-brand>
  </b-navbar>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Header extends Vue {
}
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid;
  box-shadow: 1px 1px lightgrey;
  margin-bottom: 8px;
}
.title {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: xx-large;
  color: black;
}
</style>
