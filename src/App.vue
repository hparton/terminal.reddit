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
import bus from './bus'

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
    bus.$on('showPreview', (payload) => {
      this.showPreview(payload)
    })

    bus.$on('closePreview', () => {
      this.preview = false
    })
  },
  methods: {
    showPreview (payload) {
      this.preview = payload
      this.previewVisible = true
    },
    showTerminal () {
      this.terminalVisible = true
    }
  }
}
</script>

<style>

@font-face {
  font-family: 'Source Code Pro';
  src: url('./resources/fonts/sourcecodepro-regular-webfont.woff2') format('woff2'),
       url('./resources/fonts/sourcecodepro-regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

html {
  font-family: 'Source Code Pro';
  color: #c0c5ce;
  font-size: 14px;
  line-height: 1.42857143em;
}

html,
body {
  height: 100%;
}

.app {
  display: flex;
  height: 100%;
  position: relative;
  background: #2b303b;
  justify-content: center;
  align-items: center;
}

</style>
