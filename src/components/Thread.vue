<template>
  <div class="thread">
    <h1 class="thread__title">{{body.title}}</h1>
    <p><span class="score--positive">▲</span> {{body.score}} | submitted by {{body.author}} | {{body.created_utc | UNIXtimeAgo }}</p>
    <div class="thread__self-text" v-if="body.selftext" v-html="marked"></div>
    <ul class="thread__comments" v-if="comments.length">
      <comment v-if="comments.length && comment.kind !== 'more'" v-for="comment in comments" :comment="comment.data" :depth="0"></comment>
    </ul>
    <div v-else class="thread__comments-loading">
      Loading Comments...
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import snuownd from 'snuownd'
import comment from './comment'

export default {
  name: 'thread',
  props: ['content'],
  components: {
    comment
  },
  data () {
    return {
      comments: []
    }
  },
  computed: {
    body: function () {
      return this.content.data.children[0].data
    },
    marked: function () {
      return snuownd.getParser().render(this.body.selftext)
    }
  },
  created () {
    var self = this
    axios.get('https://www.reddit.com/r/' + this.content.data.children[0].data.subreddit + '/comments/' + this.content.data.children[0].data.id + '.json')
      .then(function (response) {
        console.log(response.data)
        self.comments = response.data[1].data.children
      })
  }
}
</script>

<style>
  .thread a {
    color: white;
  }

  .thread__title {
    font-size: 24px;
  }

  .thread h1 {
    font-size: 20px;
  }

  .thread h2 {
    font-size: 20px;
  }

  .thread h3 {
    font-size: 16px;
  }

  .thread h4 {
    font-size: 14px;
  }

  .thread__self-text ol,
  .thread__self-text ul,
  .comment-body ol,
  .comment-body ul {
    padding-left: 20px;
  }

  .thread__self-text ol,
  .comment-body ol {
    list-style: decimal outside;
  }
  .thread__self-text ul,
  .comment-body ul {
    list-style: disc outside;
  }

  .score--positive {
    color: #a3be8c;
  }

  .score--negative {
    color:  #bf616a;
  }

  .thread__comments {
    padding-left: 0;
  }
</style>
