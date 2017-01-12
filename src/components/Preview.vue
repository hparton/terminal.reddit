<template>
  <div class="preview">
    <header><a href="#" @click.prevent="closePreview">← Quit [ESC]</a></header>
      <thread v-if="type === 'thread'" :content="content"></thread>
      <div v-else>
        <div v-if="content.data.children[0].data.post_hint === 'image'">
          <img ref="imageSource" v-bind:src="content.data.children[0].data.url">
        </div>
      </div>
  </div>
</template>

<script>
import bus from '../bus'
import Thread from './Thread'

export default {
  props: ['type', 'content'],
  components: {
    Thread
  },
  created () {
    // console.log(this.content)
    window.addEventListener('keydown', this.keyListener, false)
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyListener, false)
  },
  methods: {
    keyListener (e) {
      // CTRL + C or ESC
      if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'c') || e.which === 27) {
        this.closePreview()
      }
    },
    closePreview () {
      bus.$emit('closePreview')
    }
  }
}
</script>

<style>
  .preview {
    position: absolute;
    overflow-y: scroll;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background: #2b303b;
    padding: 5px;
  }

  .preview header {
    background: white;
    padding: 2px 5px;
    margin-bottom: 10px;
  }

  .preview header a {
    color: #1e0320;
    text-decoration: none;
    line-height: 1.42857143em;
  }

  .preview img {
    max-width: 100%;
    height: auto;
    display: block;
  }
</style>
