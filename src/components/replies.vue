<template>
  <div class="comment">
  <!-- {{ reply.children[0].data.body }} -->
  {{reply.body}}
  <replies v-if="reply.replies" :reply="reply.replies.data.children[0].data" :depth="childDepth">
  </div>
</template>

<script>
export default {
  name: 'replies',
  props: ['reply', 'depth'],
  computed: {
    childDepth: function () {
      return this.depth + 1
    }
  },
  created () {
    console.log(this.reply)
  }
}
</script>

<style>
  .comment .comment {
      margin-left: 1.5em;
  }


</style>
