<template>
  <div class="prompt" v-if="active && visible || !active">
    <span><span class="user">guest</span><span class="white">@</span><span class="location">reddit.sh</span>:<span class="directory">r/{{ directory }}/</span></span>
    <span v-if="!active">
      <span>{{ text }}</span>
    </span>
    <div v-else class="input">
      <input type="text"
        class="active-input"
        autofocus
        ref="input"
        v-model="command"
        @keyup.enter.prevent="runCommand"
        @keydown.up.prevent="cycleHistory(1)"
        @keydown.down.prevent="cycleHistory(0)"
        v-on:typeCommand="typeCommand"
      >
      <div class="input-display">
        {{ command }}<span class="blinky" v-bind:class="{ visible: blinkyVisible }">&nbsp;</span>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../bus'

export default {
  name: 'prompt',
  props: ['active', 'text', 'history', 'visible', 'directory'],
  data () {
    return {
      command: '',
      typing: true,
      blinkyVisible: true,
      historyIndex: null
    }
  },
  created () {
    if (this.active) {
      var self = this
      setInterval(function () {
        self.blinkyVisible = !self.blinkyVisible
      }, 500)

      window.addEventListener('keydown', this.focusInput)

      bus.$on('typeCommand', function (str) {
        self.typeCommand(str)
      })
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.focusInput)
  },
  methods: {
    typeCommand: function (str) {
      var self = this
      function iterator (index, cb) {
        if (index < str.length) {
          self.command += str.charAt(index)
          setTimeout(function () {
            iterator(++index, cb)
          }, 50)
        }
        if (index === str.length - 1 && cb) {
          cb()
        }
      }
      iterator(0, function () {
        self.runCommand()
        self.typing = !self.typing
      })
    },
    runCommand: function () {
      this.$emit('emitCommand', this.command)
      this.historyIndex = null
      this.command = ''
    },
    focusInput: function () {
      if (this.visible) {
        this.$refs.input.focus()
      }
    },
    cycleHistory: function (direction) {
      // No point looking if nothing exists.
      if (this.history.length) {
        if (this.historyIndex === null) {
          this.historyIndex = 0
        } else {
          if (direction) {
            this.historyIndex++
          } else {
            this.historyIndex--
          }
        }

        if (this.historyIndex >= this.history.length) {
          this.historyIndex = 0
        }

        if (this.historyIndex <= -1) {
          this.historyIndex = this.history.length - 1
        }

        this.command = this.history[(this.history.length - 1) - this.historyIndex].text
      }
    }
  }
}
</script>

<style scoped>


  .input {
    display: inline-block;
  }

  .active-input {
    position: absolute;
    left: -1000px;
  }

  .blinky {
    background: white;
    display: inline-block;
    visibility: hidden;
  }

  .blinky.visible {
    visibility: visible;
  }

  .user {
    color: #d08770;
  }

  .location {
    color: #bf616a;
  }

  .directory {
    color: #96b5b4;
  }


</style>
