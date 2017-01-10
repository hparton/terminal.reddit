<template v-once>
  <div>
    <span class="sep">*==========================MOTD===========================*</span>
    <p>Welcome to terminal reddit, don't let your memes be dreams.</p>
    <p>Type `<span class="yellow help" @click.prevent="type('help')">help</span>` to get a list of commands</p>
    <span class="sep">*=========================================================*</span>
  </div>
</template>

<script>
import {bus} from '../../bus'

export default {
  name: 'responseMotd',
  methods: {
    type: function (str) {
      bus.$emit('typeCommand', str)
    }
  }
}
</script>

<style>
  .help {
    cursor: pointer;
  }
</style>
