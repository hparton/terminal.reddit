<template>
  <div class="app">
    <loading v-on:loaded="showTerminal"></loading>
    <terminal v-if="loaded"></terminal>
  </div>
</template>

<script>
import Loading from './components/Loading'
import Terminal from './components/Terminal'

export default {
  name: 'hello',
  components: {
    Loading,
    Terminal
  },
  data () {
    return {
      title: '',
      comments: [],
      loaded: false
    }
  },
  created () {

  },
  methods: {
    showTerminal: function () {
      this.loaded = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

@font-face {
  font-family: 'SourceCodePro';
  src: url('./resources/fonts/SourceCodePro-Regular.ttf') format('truetype');
}

html {
  font-family: 'SourceCodePro';
}

.app {
  display: flex;
  height: 100vh;
  background: #2e2f2f;
  justify-content: center;
  align-items: center;
}

</style>
