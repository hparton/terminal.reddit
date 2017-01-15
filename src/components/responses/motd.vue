<template v-once>
  <div class="motd centered">
    <span class="sep">*====================================MOTD=====================================*</span>
    <p>Welcome to terminal reddit, don't let your memes be dreams.<br><a href="https://github.com/hparton/terminal.reddit" target="_blank" class="sep">Version 1.0.1</a> built with Vue.js by <a class="sep" href="https://twitter.com/h_parton" target="_blank">Harry Parton</a></p>
    <p>You can browse reddit posts and comments by using a terminal-esq interface. </p>
    <p>Type `<span class="yellow help" @click.prevent="type('help')">help</span>` to get a list of commands or type `<span class="yellow help" @click.prevent="type('list')">list</span>` to get some posts</p>
    <span class="sep">*=============================================================================*</span>
  </div>
</template>

<script>
import bus from '../../bus'

export default {
  name: 'responseMotd',
  methods: {
    type (str) {
      bus.$emit('typeCommand', str)
    }
  }
}
</script>

<style>
  .help {
    cursor: pointer;
  }

  .motd a {
    text-decoration: none;
  }

  .motd {
    line-height: 1.2;
  }

  .centered {
    text-align: center;
  }
</style>
