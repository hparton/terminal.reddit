<template>
  <div class="terminal" ref="terminal">
    <div v-for="item in responses" class="terminal-line">
        <prompt v-if="item.type === 'command'" :active="false" :text="item.text" :directory="item.directory"></prompt>
        <response v-else :content="item.content" :type="item.type"></response>
    </div>
    <prompt :active="true" :visible="promptActive" v-on:emitCommand="saveCommand" :directory="state.currentSub"></prompt>
  </div>
</template>

<script>
  import Prompt from './Prompt'
  import response from './responses/createResponse'

  import store from '../store'
  import bus from '../bus'

  export default {
    name: 'terminal',
    components: {
      Prompt,
      response
    },
    data () {
      return {
        promptActive: true,
        responses: [],
        commands: [],
        state: store.state
      }
    },
    created () {
      setTimeout(() => {
        bus.$emit('typeCommand', 'motd')
      }, 200)

      this.registerCommands()

      store.getSubReddits().then((response) => {
        let popularSubs = []

        for (var i = 0; i < response.data.data.children.length; i++) {
          let child = response.data.data.children[i].data
          // Just doing a check to make sure we dont get that one.
          if (child.url !== '/r/The_Donald/') popularSubs.push(child.url.slice(3, child.url.length - 1))
        }

        store.setPopularSubs(popularSubs)
      })

      bus.$on('closePreview', () => {
        this.activatePrompt()
      })
    },
    watch: {
      responses () {
        this.$nextTick(() => {
          this.scrollBottom()
        })
      }
    },
    methods: {
      parseCommand (string) {
        var commands = string.split(' && ')
        for (var i = 0; i < commands.length; i++) {
          var argv = commands[i].split(/ +/)
          var name = argv[0]
          // take the name out of the args list
          argv.shift()

          this.runCommand(name, argv)
        }
      },
      activatePrompt () {
        this.promptActive = true
        this.$nextTick(() => {
          this.scrollBottom()
        })
      },
      deactivatePrompt () {
        this.promptActive = false
      },
      registerCommands () {
        this.command('help', () => {
          this.createResponse('help', this.commands)
        }, ['Show the help function... which you have to know to view this.'])

        this.command('list', (argv) => {
          store.getPosts().then((response) => {
            store.setLatestListings(response)
            this.createResponse('list', this.state.latestListings)
          })
        }, [`List the first ${this.state.pagination.count} posts in the current subreddit`])

        this.command('more', (argv) => {
          if (this.state.pagination.last) {
            store.getPosts(this.state.pagination.last).then((response) => {
              store.setLatestListings(response)
              this.createResponse('list', this.state.latestListings)
            })
          } else {
            this.createResponse('message', 'You first need to grab some inital listings using `list`')
          }
        }, ['Get more posts from the same subreddit'])

        this.command('move', (argv) => {
          store.setCurrentSub(argv[0]).then((response) => {
            this.activatePrompt()
          }).catch((error) => {
            this.createResponse('message', error)
          })
        }, ['Change subreddit', 'move <subreddit/random>'])

        this.command('sort', (argv) => {
          store.setSortMode(argv[0]).then((response) => {
            this.createResponse('message', response)
          }).catch((error) => {
            this.createResponse('message', error)
          })
        }, ['Change subreddit sorting mode', 'sort <hot/new/rising/top>'])

        this.command('limit', (argv) => {
          store.setLimit(argv[0]).then((response) => {
            this.createResponse('message', response)
          }).catch((error) => {
            this.createResponse('message', error)
          })
        }, ['Limit the amount of returned posts', 'limit <number>'])

        this.command('view', (argv) => {
          store.getPost('t3_' + argv[0]).then((response) => {
            let post = response.data.data.children[0].data

            if (post.is_self) {
              bus.$emit('showPreview', {data: response.data, type: 'thread'})
            } else {
              var popup = window.open(post.url.replace(/&amp;/g, '&'))

              // Check if the new window is created and send an error if it fails, otherwise it just silently fails and leaves the user confused.
              try {
                popup.focus()
              } catch (e) {
                this.createResponse('message', 'You need to allow popups before the view command will work, there should be an icon in the far right of your URL Bar')
              }
            }

            this.activatePrompt()
          }).catch(() => {
            this.createResponse('message', 'Could not find a post with that id.')
          })
        }, ['View the link for a specific post (you must allow popups)', 'view <post-id>'])

        this.command('comments', (argv) => {
          store.getPost('t3_' + argv[0])
          .then((response) => {
            bus.$emit('showPreview', {data: response.data, type: 'thread'})
          }).catch(() => {
            this.createResponse('message', 'Could not find a post with that id.')
          })
        }, ['View the comments for a specific post', 'comments <post-id>'])

        this.command('hi', () => {
          this.createResponse('message', 'Howdy')
        }, ['Say hello to the computer'])

        this.command('motd', () => {
          this.createSpacedResponse('motd')
        }, ['Show the message of the day'])

        this.command('echo', (argv) => {
          this.createResponse('message', argv.join(' '))
        }, ['Echo out a string onto the command line', 'echo <hello world!>'])

        this.command('clear', () => {
          this.responses = []
          this.activatePrompt()
        }, ['Clear the terminal of any responses'])
      },
      command (name, func, help) {
        this.commands.push({
          name: name,
          command: func,
          help: help
        })
      },
      runCommand (name, argv) {
        for (var i = 0; i < this.commands.length; i++) {
          if (this.commands[i].name === name) {
            return this.commands[i].command(argv)
          }
        }

        this.createResponse('message', 'That command is not recognized: ' + name)
      },
      saveCommand (string) {
        this.deactivatePrompt()

        let command = {
          type: 'command',
          directory: this.state.currentSub,
          text: string
        }

        this.responses.push(command)

        setTimeout(() => {
          this.parseCommand(string)
        }, 20)
      },
      createSpacedResponse (type, content) {
        this.createResponse('message', '')
        this.createResponse(type, content)
        this.createResponse('message', '')
      },
      createResponse (type, content) {
        let response = {
          type: type,
          content: content
        }

        this.responses.push(response)
        this.activatePrompt()
      },
      scrollBottom () {
        this.$refs.terminal.scrollTop = this.$refs.terminal.scrollHeight
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
}

@media screen and (min-width: 1800px) {
  .terminal-line {
    max-width: 70%;
  }
}

.terminal-line > * {
  display: inline-block;
  vertical-align: middle;
  text-align: start;
}

.terminal {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
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
