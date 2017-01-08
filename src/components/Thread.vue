<template>
  <div class="thread">
    <h1>{{body.title}}</h1>
    <p><span class="score--positive">▲</span> {{body.score}} | submitted by {{body.author}} | {{body.created_utc | UNIXtimeAgo }}</p>
    <div v-if="body.selftext">
      <p>{{body.selftext}}</p>
    </div>
    <ul class="thread-comments">
      <comment v-if="comments.length && comment.kind !== 'more'" v-for="comment in comments" :comment="comment.data" :depth="0"></comment>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
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
  .score--positive {
    color: #a3be8c;
  }

  .score--negative {
    color:  #bf616a;
  }

  .thread-comments {
    padding-left: 0;
  }
</style>
