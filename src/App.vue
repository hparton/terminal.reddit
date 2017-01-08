<template>
  <div class="app" id="app">
    <loading v-on:loaded="showTerminal"></loading>
    <terminal v-if="terminalVisible"></terminal>
    <preview v-if="preview" :type="preview.type" :content="preview.data"></preview>
  </div>
</template>

<script>
import Loading from './components/Loading'
import Terminal from './components/Terminal'
import Preview from './components/Preview'
import {bus} from './bus'

export default {
  name: 'app',
  components: {
    Loading,
    Terminal,
    Preview
  },
  data () {
    return {
      terminalVisible: false,
      preview: false
    }
  },
  created () {
    var self = this
    bus.$on('showPreview', function (payload) {
      self.showPreview(payload)
    })

    bus.$on('closePreview', function () {
      self.preview = false
    })
  },
  methods: {
    showPreview: function (payload) {
      this.preview = payload
      this.previewVisible = true
    },
    showTerminal: function () {
      this.terminalVisible = true
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
  color: #c0c5ce;
  font-size: 14px;
  line-height: 1.42857143em;
}

.app {
  display: flex;
  height: 100vh;
  background: #2b303b;
  justify-content: center;
  align-items: center;
}

</style>
