<template>
  <div class="preview">
    <header><a href="#" @click.prevent="closePreview">← Go Back [ESC] Quit</a></header>
    <!-- <div v-if="type === 'thread'"> -->
      <div v-if="content.data.children[0].data.post_hint === 'image'">
        <img ref="imageSource" v-bind:src="content.data.children[0].data.url">
      </div>
    <!-- </div> -->
      <div v-else>
        <h1>{{body.title}}</h1>
        <p><span class="score">▲</span> {{body.score}} | submitted by {{body.author}}</p>
        <div v-if="body.selftext">
          <p>{{body.selftext}}</p>
        </div>
        <div v-if="comments.length" v-for="comment in comments" class="comment">
          {{comment.data.body}}

          <div v-if="comment.data.replies">
            <div v-for="reply in comment.data.replies.data.children">
              {{reply.data.body}}
            </div >
          </div >
        </div>
      </div>
  </div>
</template>

<script>
import {bus} from '../main'
import axios from 'axios'

export default {
  props: ['type', 'content'],
  data () {
    return {
      comments: []
    }
  },
  computed: {
    body: function () {
      return this.content.data.children[0].data
    }
  },
  created () {
    // console.log(this.content)
    window.addEventListener('keydown', this.keyListener, false)

    var self = this
    axios.get('https://www.reddit.com/r/' + this.content.data.children[0].data.subreddit + '/comments/' + this.content.data.children[0].data.id + '.json')
      .then(function (response) {
        console.log(response.data)
        self.comments = response.data[1].data.children
      })
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyListener, false)
  },
  methods: {
    keyListener: function (e) {
      // CTRL + C or ESC
      if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'c') || e.which === 27) {
        this.closePreview()
      }
    },
    closePreview: function () {
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

  .score {
    color: #a3be8c;
  }

  .comment {
    border-left: 2px solid white;
    padding-left: 10px;
    line-height: 1.4;
  }

  .comment + .comment {
    margin-top: 1rem;
  }
</style>
