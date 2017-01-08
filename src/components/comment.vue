<!-- That comment for loop could do with some improvements, it works but its kind of confusing to get your head around -->

<template>
  <li class="comment">
    <div class="comment-body" v-html="marked"></div>
    <ul class="comment-kids" v-if="comment.replies">
      <comment
        v-for="reply in comment.replies.data.children"
        v-if="reply.kind !== 'more'"
        :comment="reply.data"
        :depth="depth + 1"
      ></comment>
    </ul>
  </li>
</template>

<script>
import snuownd from 'snuownd'

export default {
  name: 'comment',
  props: ['comment', 'depth'],
  created () {
    // if (this.depth === 1) {
    //   console.log(this.comment)
    // }
  },
  computed: {
    marked: function () {
      return snuownd.getParser().render(this.comment.body)
    }
  }
}
</script>

<style>
  .comment-kids .comment-kids {
      margin-left: 1.5em;
  }
</style>
