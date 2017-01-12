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
        @keydown.left="increaseCursorOffset"
        @keydown.right="decreaseCursorOffset"
        @keydown.del="decreaseCursorOffset"
        @keydown.up.prevent="cycleHistory(1)"
        @keydown.down.prevent="cycleHistory(0)"
        @keydown="selectInput"
        v-on:typeCommand="typeCommand"
      >
      <div class="input-display" v-bind:class="{selected: selected}">
        <template v-for="letter in commandDisplay">
          <span v-if="letter.selected" class="blinky visible">
            <template v-if="letter.l === ' '">&nbsp;</template>
            <template v-else>{{ letter.l }}</template>
          </span>
          <template v-else>
            <template v-if="letter.l === ' '">&nbsp;</template>
            <template v-else>{{ letter.l }}</template>
          </template>
        </template><!--
        --><span class="blinky" v-bind:class="{ visible: blinkyVisible }">&nbsp;</span>
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
      selectorVisible: false,
      blinkyVisible: true,
      selected: false,
      historyIndex: null,
      cursorOffset: 0
    }
  },
  computed: {
    commandDisplay: function () {
      let command = this.command
      let index = command.length - this.cursorOffset
      let arr = []

      for (var i = 0; i < command.length; i++) {
        if (i === index) {
          arr.push({l: command[i], selected: true})
        } else {
          arr.push({l: command[i]})
        }
      }

      return arr
    }
  },
  created () {
    if (this.active) {
      this.$nextTick(function () {
        this.toggleBlinky()

        window.addEventListener('keydown', this.focusInput)
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
  },
  methods: {
    increaseCursorOffset: function () {
      if (this.blinkyVisible) {
        this.blinkyVisible = false
      }

      if (this.cursorOffset <= (this.command.length - 1)) {
        this.cursorOffset = this.cursorOffset + 1
      }
    },
    decreaseCursorOffset: function () {
      if (this.cursorOffset >= 1) {
        this.cursorOffset = this.cursorOffset - 1
      }
    },
    resetCursorOffset: function () {
      this.cursorOffset = 0
    },
    typeCommand: function (str) {
      var self = this
      function iterator (index, cb) {
        if (index < str.length) {
          self.command += str.charAt(index)
          setTimeout(function () {
            iterator(++index, cb)
          }, 100)
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
      this.resetCursorOffset()
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
          this.blinkyVisible = false
        }
      } else if (!(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
        this.selected = false

        if ((e.which === 37) || (e.which === 38 && !this.history.length)) {
          this.cursorOffset = this.command.length
        } else {
          this.resetCursorOffset()
        }
      }
    },
    toggleBlinky: function () {
      let self = this
      setInterval(function () {
        if (!self.selected && self.cursorOffset === 0) {
          self.blinkyVisible = !self.blinkyVisible
        } else {
          self.blinkyVisible = false
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
        this.resetCursorOffset()
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
    background: #2b303b;
    color: inherit;
    display: inline-block;
  }

  .blinky.visible {
    background: white;
    color: #2b303b;
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
