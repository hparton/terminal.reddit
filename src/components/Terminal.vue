<template>
  <div class="terminal" ref="terminal">
    <div v-for="item in responses" class="terminal-line">
        <prompt v-if="item.type === 'command'" :active="false" :text="item.text" :directory="item.directory"></prompt>
        <response v-else :content="item.content" :type="item.type"></response>
    </div>
    <prompt :active="true" :visible="promptActive" v-on:emitCommand="saveCommand" :history="commands" :directory="currentSub"></prompt>
  </div>
</template>

<script>
  import Prompt from './Prompt'
  import response from './responses/createResponse'

  import axios from 'axios'

  import {bus} from '../bus'

  export default {
    name: 'terminal',
    components: {
      Prompt,
      response
    },
    data () {
      return {
        promptActive: true,
        sort: 'hot',
        currentSub: 'all',
        responses: [],
        commands: [],
        listings: [],
        pagination: {
          last: false,
          count: 25
        }
      }
    },
    created () {
      setTimeout(function () {
        bus.$emit('typeCommand', 'motd')
      }, 200)
      var self = this

      this.registerCommands()

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
      parseCommand: function (string) {
        var argv = string.split(/ +/)
        var name = argv[0]
        // take the name out of the args list
        argv.shift()

        this.runCommand(name, argv)
      },
      registerCommands: function () {
        var self = this

        this.command('hi', function () {
          self.createResponse('message', 'Howdy')
        }, ['Say hello to the computer'])

        this.command('motd', function () {
          self.createSpacedResponse('motd')
        }, ['Show the message of the day'])

        this.command('help', function () {
          self.createSpacedResponse('help')
        }, ['Show the help function... which you have to know to view this.'])

        this.command('clear', function () {
          self.responses = []
          self.promptActive = true
        }, ['Clear the terminal of any responses'])

        this.command('list', function (argv) {
          self.getPosts().then(function (response) {
            self.updateListings(response)
            self.createResponse('list', self.listings)
          })
        }, [`List the current ${self.pagination.count} posts in the current subreddit`])

        this.command('more', function (argv) {
          if (self.pagination.last) {
            self.getPosts(self.pagination.last).then(function (response) {
              self.updateListings(response)
              self.createResponse('list', self.listings)
            })
          } else {
            self.createResponse('message', 'You first need to grab some inital listings using `list`')
          }
        }, ['Get more posts from the same subreddit'])

        this.command('move', function (argv) {
          self.moveCurrentSub(argv[0])
        }, ['Change subreddit'])

        this.command('sort', function (argv) {
          self.changeSortMode(argv[0])
        }, ['Change subreddit sorting mode'])

        this.command('limit', function (argv) {
          self.setLimit(argv[0])
        }, ['Limit the amount of returned posts'])

        this.command('comments', function (argv) {
          for (var i = 0; i < self.listings.length; i++) {
            if (self.listings[i].id === argv[0]) {
              var listing = self.listings[i]
              self.getComments(listing.name)
              .then(function (response) {
                bus.$emit('showPreview', {data: response.data, type: 'thread'})
              })
              break
            }
          }
        }, ['View the comments for a specific post'])
      },
      command: function (name, func, help) {
        this.commands.push({
          name: name,
          command: func,
          help: help
        })
      },
      runCommand: function (name, argv) {
        for (var i = 0; i < this.commands.length; i++) {
          if (this.commands[i].name === name) {
            return this.commands[i].command(argv)
          }
        }

        this.createResponse('message', 'That command is not recognized')
      },
      saveCommand: function (string) {
        this.promptActive = false

        let command = {
          type: 'command',
          directory: this.currentSub,
          text: string
        }

        this.responses.push(command)
        // this.commands.push(command)

        let self = this
        setTimeout(function () {
          self.parseCommand(string)
        }, 20)
      },
      createSpacedResponse: function (type, content) {
        this.createResponse('message', '')
        this.createResponse(type, content)
        this.createResponse('message', '')
      },
      createResponse: function (type, content) {
        let response = {
          type: type,
          content: content
        }

        this.responses.push(response)
        this.promptActive = true
      },
      getPosts: function (after) {
        return axios.get('https://www.reddit.com/r/' + this.currentSub + '/' + this.sort + '.json', {
          params: {
            after: after,
            limit: this.pagination.count
          }
        })
      },
      getComments: function (name) {
        return axios.get('https://www.reddit.com/by_id/' + name + '.json')
      },
      updateListings: function (response) {
        var output = []
        for (var i = 0; i < response.data.data.children.length; i++) {
          var child = response.data.data.children[i].data
          // ID, Score, Type, Date ?, Name,
          var line = {
            id: child.id,
            name: child.name,
            score: child.score,
            media_type: child.post_hint,
            created_utc: child.created_utc,
            title: child.title,
            permalink: child.permalink,
            url: child.url
          }
          output.push(line)
        }

        this.pagination.last = response.data.data.children[response.data.data.children.length - 1].data.name
        this.listings = output
      },
      changeSortMode: function (mode) {
        if (mode === 'hot' || mode === 'new' || mode === 'rising' || mode === 'controversial' || mode === 'top') {
          this.sort = mode
          this.pagination.last = false
          this.createResponse('message', `Now sorting by ${mode}`)
        } else {
          this.createResponse('message', 'Please specify a valid sorting mode (hot/new/controversial/rising/top)')
        }
      },
      setLimit: function (count) {
        if (count > 0 && count <= 100) {
          this.pagination.count = count
          this.createResponse('message', `Limit set to ${this.pagination.count}`)
        } else {
          this.createResponse('message', 'Limit has to be between 1 - 100')
        }
      },
      moveCurrentSub: function (sub) {
        if (sub) {
          this.currentSub = sub
          this.pagination.last = false
          this.promptActive = true
        } else {
          this.createResponse('message', 'Please specify a valid subreddit to move to')
        }
      }
    }
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
