<template>
  <div class="prompt" v-show="active && visible || !active">
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
      <div class="input-display" v-bind:class="{selected: selected}">
        {{ command }}<span class="blinky" v-bind:class="{ visible: blinkyVisible }">&nbsp;</span>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../bus'

export default {
  name: 'prompt',
  props: ['active', 'text', 'visible', 'directory'],
  data () {
    return {
      command: '',
      history: [],
      typing: true,
      blinkyVisible: true,
      selected: false,
      historyIndex: null
    }
  },
  created () {
    if (this.active) {
      this.$nextTick(function () {
        this.toggleBlinky()

        window.addEventListener('keydown', this.focusInput)
        window.addEventListener('keydown', this.selectInput)
        let self = this
        bus.$on('typeCommand', function (str) {
          self.command = ''
          self.typeCommand(str)
        })
      })
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.focusInput)
    window.removeEventListener('keydown', this.selectInput)
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
      this.history.push(this.command)
      this.historyIndex = null
      this.command = ''
    },
    focusInput: function () {
      if (this.visible) {
        this.$refs.input.focus()
      }
    },
    selectInput: function (e) {
      if (this.selected === false) {
        if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'a')) {
          this.selected = true
          this.blinky = true
        }
      } else if (!(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
        this.selected = false
      }
    },
    toggleBlinky: function () {
      let self = this
      setInterval(function () {
        if (!self.selected) {
          self.blinkyVisible = !self.blinkyVisible
        } else {
          self.blinkyVisible = true
        }
      }, 500)
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

        this.command = this.history[(this.history.length - 1) - this.historyIndex]
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
  }

  .blinky.visible {
    display: none;
  }

  .input-display.selected {
    color: black;
    background: white;
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
