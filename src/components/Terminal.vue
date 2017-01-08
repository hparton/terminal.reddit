<template>
<div class="terminal" ref="terminal">
  <div v-for="item in responses" class="terminal-line">
    <div v-if="item.type === 'command'">
      <prompt :active="false" :text="item.text" :directory="item.directory"></prompt>
    </div>
    <div v-else>
      <response :content="item.content" :type="item.type"></response>
    </div>
  </div >
  <prompt :active="true" :visible="promptActive" v-on:emitCommand="saveCommand" :history="commands" :directory="currentSub"></prompt>
</div>
</template>

<script>
  import prompt from './prompt'
  import response from './response'
  import axios from 'axios'
  import {bus} from '../bus'

  export default {
    name: 'terminal',
    components: {
      prompt,
      response
    },
    data () {
      return {
        promptActive: true,
        currentSub: 'all',
        responses: [],
        commands: [],
        listings: []
      }
    },
    created () {
      setTimeout(function () {
        bus.$emit('typeCommand', 'motd')
      }, 200)
      var self = this

      bus.$on('closePreview', function () {
        self.promptActive = true
      })
    },
    watch: {
      responses: function () {
        this.$nextTick(function () {
          const terminal = this.$refs.terminal
          terminal.scrollTop = terminal.scrollHeight
        })
      }
    },
    methods: {
      runCommand: function (text) {
        var argv = text.split(' ')

        if (arrayContains('help', argv)) {
          this.createResponse('Help is on the way!', 'message')
        } else if (arrayContains('hi', argv)) {
          this.createResponse('Howdy', 'message')
        } else if (arrayContains('clear', argv)) {
          this.responses = []
          this.promptActive = true
        } else if (arrayContains('list', argv)) {
          let self = this
          axios.get('https://www.reddit.com/r/' + self.currentSub + '.json')
          .then(function (response) {
            var output = []
            for (var i = 0; i < response.data.data.children.length; i++) {
              var child = response.data.data.children[i].data
              // ID, Score, Type, Date ?, Name,
              console.log(child)
              var line = {
                id: child.id,
                name: child.name,
                score: child.score,
                media_type: child.post_hint,
                created: child.created,
                title: child.title,
                permalink: child.permalink,
                url: child.url
              }
              output.push(line)
            }
            self.listings = output
            self.createResponse(self.listings, 'list')
          })
          .catch(function (error) {
            console.log(error)
          })
        } else if (arrayContains('move', argv)) {
          if (argv[1]) {
            this.currentSub = argv[1]
            this.promptActive = true
          } else {
            this.createResponse('Please specify a valid subreddit to move to', 'message')
          }
        } else if (arrayContains('view', argv)) {
          if (argv[1]) {
            for (var i = 0; i < this.listings.length; i++) {
              if (this.listings[i].id === argv[1]) {
                var listing = this.listings[i]
                axios.get('https://www.reddit.com/by_id/' + listing.name + '.json')
                .then(function (response) {
                  bus.$emit('showPreview', {data: response.data, type: 'thread'})
                })
                break
              }
            }
          } else {
            this.createResponse('Please specify a valid post id to view', 'message')
          }
        } else if (arrayContains('motd', argv)) {
          this.createResponse('', 'message')
          this.createResponse('<span class="sep">*==========================MOTD===========================*</span><p>Welcome to terminal reddit, don\'t let your memes be dreams.</p><p>Type `<span class="yellow">help</span>` to get a list of commands</p><span class="sep">*=========================================================*</span>', 'message')
          this.createResponse('', 'message')
        } else {
          this.createResponse('That command is not recognized', 'message')
        }
      },
      saveCommand: function (text) {
        this.promptActive = false

        let command = {
          type: 'command',
          directory: this.currentSub,
          text: text
        }

        this.responses.push(command)
        this.commands.push(command)

        let self = this
        setTimeout(function () {
          self.runCommand(text)
        }, 20)
      },
      createResponse: function (content, type) {
        let response = {
          type: type,
          content: content
        }

        this.responses.push(response)
        this.promptActive = true
      }
    }
  }

  function arrayContains (needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1)
  }
</script>

<style>

input {
  font-size: 100%;
  background: inherit;
  border: none;
}

.terminal-line {
  min-height: 22px;
  max-width: 70%;
}

.terminal {
  height: 100vh;
  overflow-y: scroll;
  width: 100vw;
  padding: 15px;
  margin-right: auto;
}

.sep {
  color: #b48ead;
}

.yellow {
  color: #ebcb8b;
}

</style>
